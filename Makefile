export
# ---------------- BEFORE RELEASE ----------------
# 1 - Update Version Number
# 2 - Update src/RELEASE.md
# -------------- Release Process Steps (make ondewo_release) --------------
# 1 - spc: the release branch and tag do not exist yet
# 2 - Load the credentials from devops-accounts into a 0600 file outside the repository, delete the clone
# 3 - release_preflight: credentials valid, version unreleased, notes present, host tools (read-only)
# 4 - Build, then the full test suite and the pre-commit hooks
# 5 - Commit locally; check_tag_matches_package: the tarball is exactly what is committed
# 6 - npm publish, then wait until npm serves the version
# 7 - Push, release branch, release tag, GitHub release
# 8 - release_verify: tag on origin, GitHub release notes, npm version

########################################################
# 		Variables
########################################################

ONDEWO_SIP_VERSION=5.5.0
SIP_API_GIT_BRANCH=tags/5.5.0
# Must name the tag the committed ondewo-proto-compiler submodule points at, otherwise
# check_out_correct_submodule_versions checks the submodule BACK to the older tag.
ONDEWO_PROTO_COMPILER_GIT_BRANCH=tags/5.15.5
ONDEWO_PROTO_COMPILER_DIR=ondewo-proto-compiler
SIP_APIS_DIR=src/ondewo-sip-api
SIP_PROTOS_DIR=${SIP_APIS_DIR}/ondewo
GOOGLE_APIS_DIR=${SIP_APIS_DIR}/googleapis
GOOGLE_PROTOS_DIR=${GOOGLE_APIS_DIR}/google
IMAGE_UTILS_NAME=ondewo-sip-client-utils-nodejs:${ONDEWO_SIP_VERSION}
PRETTIER_WRITE?=
NPM_PACKAGE=@ondewo/sip-client-nodejs
GH_REPO_NAME=ondewo/ondewo-sip-client-nodejs

# The credentials of a release live ONLY in this file (NAME=value lines, mode 0600, outside the repository),
# written by ondewo_release and handed to exactly the docker runs that use them with `--env-file`. It is
# never sourced into make or into a shell, so no token reaches npm ci, its install scripts, the tests or the
# hooks.
RELEASE_ENV_FILE?=
# How long release_verify_npm waits for npm to serve a fresh publish.
VERIFY_ATTEMPTS?=20
VERIFY_INTERVAL_S?=30
# A token that is in the CALLER's environment is not passed on to any recipe either.
unexport GITHUB_GH_TOKEN GH_TOKEN NPM_AUTOMATION_TOKEN
# The PATH of the credentials file stays out of every recipe environment too: `$(MAKE) release
# RELEASE_ENV_FILE=...` is a command-line variable, which make exports, so `npm test` and every container
# inherited it - and a spec that ran make under that environment printed the real tokens into the release
# log. Recipes read it as $(RELEASE_ENV_FILE); recursive makes still get it through MAKEFLAGS.
unexport RELEASE_ENV_FILE

# node/npm and pre-commit run on the host when it has them, else in the pinned utils image as the invoking
# user. The image mounts the repository, which never holds the devops-accounts clone during a release.
HOST_HAS_NODE?=$(shell command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1 && echo yes)
HOST_HAS_PRE_COMMIT?=$(shell command -v pre-commit >/dev/null 2>&1 && echo yes)
IN_TOOLS=docker run --rm --user "$$(id -u):$$(id -g)" -v "$(CURDIR)":/work -w /work ${IMAGE_UTILS_NAME}
IN_NODE=$(if $(HOST_HAS_NODE),,$(IN_TOOLS) )
IN_PRE_COMMIT=$(if $(HOST_HAS_PRE_COMMIT),,$(IN_TOOLS) )
NODE_IMAGE_IF_NEEDED=$(if $(HOST_HAS_NODE),,build_utils_docker_image)
TOOLS_IMAGE_IF_NEEDED=$(if $(and $(HOST_HAS_NODE),$(HOST_HAS_PRE_COMMIT)),,build_utils_docker_image)

# The release-notes section of ONDEWO_SIP_VERSION: from its heading (anchored, the version taken literally)
# to the next ***** separator.
RELEASE_NOTES_RANGE=/^\#+ Release ONDEWO SIP Nodejs Client \Q${ONDEWO_SIP_VERSION}\E$$/../^\*{5}/
CURRENT_RELEASE_NOTES=`cat RELEASE.md \
	| perl -ne 'print if $(RELEASE_NOTES_RANGE)'`

GH_REPO="https://github.com/ondewo/ondewo-sip-client-nodejs"
DEVOPS_ACCOUNT_GIT="ondewo-devops-accounts"
# An existing devops-accounts checkout to read instead of cloning one (the driver's single temp clone).
DEVOPS_ACCOUNT_DIR?=
# Shell fragment: write the two tokens of the devops-accounts checkout "$$accounts" to the file "$$env_file"
# (NAME=value lines). The values pass through a subshell only, so no shell, make or argv keeps one.
WRITE_CREDENTIALS=( eval "$$(grep -h -E '^(GITHUB_GH_TOKEN|NPM_AUTOMATION_TOKEN)=' "$$accounts/account_github.env" "$$accounts/account_npm.env")"; \
		printf 'GITHUB_GH_TOKEN=%s\nNPM_AUTOMATION_TOKEN=%s\n' "$$GITHUB_GH_TOKEN" "$$NPM_AUTOMATION_TOKEN" ) > "$$env_file"
# Shell fragment for a recipe line that hands the credentials to a container: "$$env_file" is RELEASE_ENV_FILE
# when the release set it, else (release_preflight / release_verify run on their own by the driver) a 0600
# file written from DEVOPS_ACCOUNT_DIR for this one line and deleted when it exits.
USE_CREDENTIALS_FILE=env_file="$(RELEASE_ENV_FILE)"; \
	if test -z "$$env_file" && test -n "$(DEVOPS_ACCOUNT_DIR)"; then \
		test -d "$(DEVOPS_ACCOUNT_DIR)" || { echo "$@: DEVOPS_ACCOUNT_DIR=$(DEVOPS_ACCOUNT_DIR) is not a directory"; exit 1; }; \
		accounts="$(DEVOPS_ACCOUNT_DIR)"; env_file="$$(mktemp)"; trap 'rm -f "$$env_file"' EXIT; \
		$(WRITE_CREDENTIALS) || exit 1; \
	fi; \
	test -n "$$env_file" && test -f "$$env_file" || { \
		echo "$@: no credentials - set DEVOPS_ACCOUNT_DIR to a devops-accounts checkout, or run 'make ondewo_release'"; exit 1; }; \
	for name in GITHUB_GH_TOKEN NPM_AUTOMATION_TOKEN; do \
		grep -q "^$$name=." "$$env_file" || { echo "$@: $$name is missing or empty"; exit 1; }; \
	done;
.DEFAULT_GOAL := help

########################################################
#       ONDEWO Standard Make Targets
########################################################

setup_developer_environment_locally: install_packages install_precommit_hooks ## Installs all needed packages and precommit hooks

install_packages: ## Install npm packages
	npm i

install_precommit_hooks: ## Install precommit hooks
	npx husky install
	uv tool install pre-commit || pipx install pre-commit || pip install --user pre-commit

run_precommit_hooks: ## Runs all precommit hooks
	.husky/pre-commit

prettier: $(NODE_IMAGE_IF_NEEDED) ## Checks formatting with Prettier - Use PRETTIER_WRITE=-w to also automatically apply corrections where needed
	$(IN_NODE)node_modules/.bin/prettier --config .prettierrc --check --ignore-path .prettierignore $(PRETTIER_WRITE) ./

eslint: $(NODE_IMAGE_IF_NEEDED) ## Checks Code Logic and Typing
	$(IN_NODE)./node_modules/.bin/eslint --config eslint.config.mjs .

TEST: ## Prints some important variables
	@echo "Release Notes: \n \n$(CURRENT_RELEASE_NOTES)"
	@echo "Release env file: \t $(if $(RELEASE_ENV_FILE),<set>,<unset>)"

help: ## Print usage info about help targets
	# (first comment after target starting with double hashes ##)
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-40s\033[0m %s\n", $$1, $$2}'

makefile_chapters: ## Shows all sections of Makefile
	@echo `cat Makefile| grep "########################################################" -A 1 | grep -v "########################################################"`

check_build: ## Checks if all built proto-code is there
	@rm -rf build_check.txt
	@for proto in `find src/ondewo-sip-api/ondewo -iname "*.proto*"`; \
	do \
		cat $${proto} | grep import | grep "google/" | cut -d "/" -f 3 | cut -d "." -f 1 >> build_check.txt; \
		perl -i -pe 's/import.*//g' build_check.txt; \
		echo $${proto} | cut -d "/" -f 5 | cut -d "." -f 1 >> build_check.txt; \
	done
	@echo "`sort build_check.txt | uniq`" > build_check.txt
	@for file in `cat build_check.txt`;\
	do \
		find api -iname "*pb*" | grep -q $${file}; \
		if test $$? != 0; then  echo "No Proto-Code for $${file}" & exit 1;fi \
	done
	@rm -rf build_check.txt

########################################################
#       Repo Specific Make Targets
########################################################

########################################################
#		Release

# The ORDER is pinned by tests/releaseProcess.spec.ts. Nothing leaves this host before the tests passed and
# the tarball is known to be exactly what is committed; nothing is pushed before npm SERVES the version, so
# a rejected publish leaves origin untouched.
release: ## Create the npm and GitHub release (use ondewo_release, which supplies RELEASE_ENV_FILE)
	@echo "Start Release"
	$(MAKE) release_preflight
	$(MAKE) build
	$(MAKE) check_build
	$(MAKE) release_tests
	$(MAKE) release_precommit_hooks
	git status
	git add api
	git add Makefile
	git add src
# auth/ is the hand-written Keycloak provider and its spec, and README.md is a BUILD OUTPUT
# (`make build` runs `cp src/README.md .`). Both are top-level, so `git add src` covers
# neither: leaving them out publishes a change to npm while the git tag of that same version
# does not contain it, and destroys anything written only in the root README on the next build.
	git add auth
	git add README.md
# public-api.js / public-api.d.ts (the package entry point) are regenerated by `make build` with
# api/. Leaving them out publishes exports to npm that the git tag of that same version lacks.
	git add public-api.js
	git add public-api.d.ts
	git add RELEASE.md
	git add package.json
	git add package-lock.json
# A regression test written while a release is prepared belongs in the tag it guards.
	git add tests
	git add .ci-package.json
	git add ${ONDEWO_PROTO_COMPILER_DIR}
	git add ${SIP_APIS_DIR}
	git status
# Skip only an EMPTY commit (a re-run after the content was committed by hand); a commit that fails
# for any other reason fails the release before anything is published.
	git diff --cached --quiet || git commit --no-verify -m "Preparing for Release ${ONDEWO_SIP_VERSION}"
	$(MAKE) check_tag_matches_package
	$(MAKE) publish_npm_via_docker
	$(MAKE) release_verify_npm
	git push
	$(MAKE) create_release_branch
	$(MAKE) create_release_tag
	$(MAKE) release_to_github_via_docker_image
	$(MAKE) release_verify
	@echo "Finished Release"

# Read-only. Everything here can fail without leaving a trace, so it runs before anything is built,
# committed, published or pushed.
release_preflight: ## Fails unless the credentials are valid, the version is unreleased, its notes exist and the host tools are there
	@echo "START release_preflight ${ONDEWO_SIP_VERSION}"
	@for tool in docker make git perl curl; do \
		command -v $$tool >/dev/null 2>&1 || { echo "release_preflight: $$tool is not installed on this host"; exit 1; }; \
	done
	@test -n "$$(perl -ne 'print if $(RELEASE_NOTES_RANGE)' src/RELEASE.md | perl -ne 'print unless /^\#|^\*{5}|^\s*$$/')" || { \
		echo "release_preflight: src/RELEASE.md has no non-empty '## Release ONDEWO SIP Nodejs Client ${ONDEWO_SIP_VERSION}' section"; exit 1; }
	@$(MAKE) --no-print-directory spc
	@code="$$(curl -s -o /dev/null -w '%{http_code}' "https://registry.npmjs.org/$(subst /,%2f,${NPM_PACKAGE})/${ONDEWO_SIP_VERSION}")"; \
		case "$$code" in \
			404) echo "-- npm: ${NPM_PACKAGE}@${ONDEWO_SIP_VERSION} is not published yet";; \
			200) echo "release_preflight: ${NPM_PACKAGE}@${ONDEWO_SIP_VERSION} is already on npm"; exit 1;; \
			*) echo "release_preflight: cannot tell whether npm has ${NPM_PACKAGE}@${ONDEWO_SIP_VERSION} (HTTP $$code)"; exit 1;; \
		esac
	@git push --dry-run origin HEAD >/dev/null 2>&1 || { echo "release_preflight: 'git push --dry-run origin HEAD' fails - check the SSH access to origin"; exit 1; }
	@echo "-- git: may push to origin"
	@$(MAKE) --no-print-directory build_utils_docker_image >/dev/null
# npm reads the literal `${NPM_AUTOMATION_TOKEN}` from the temporary userconfig and substitutes the
# container's environment value, so the token is on no argv and in no file.
	@$(USE_CREDENTIALS_FILE) docker run --rm --env-file "$$env_file" ${IMAGE_UTILS_NAME} sh -ec ' \
		cfg="$$(mktemp)"; trap "rm -f \"$$cfg\"" EXIT; \
		printf "%s\n" "//registry.npmjs.org/:_authToken=\$${NPM_AUTOMATION_TOKEN}" > "$$cfg"; \
		user="$$(npm whoami --userconfig "$$cfg" --registry https://registry.npmjs.org/ 2>/dev/null)" || { echo "release_preflight: npm rejects NPM_AUTOMATION_TOKEN"; exit 1; }; \
		echo "-- npm: NPM_AUTOMATION_TOKEN authenticates as $$user"; \
		push="$$(GH_TOKEN="$$GITHUB_GH_TOKEN" gh api repos/${GH_REPO_NAME} --jq .permissions.push 2>/dev/null)" || { echo "release_preflight: GitHub rejects GITHUB_GH_TOKEN"; exit 1; }; \
		test "$$push" = true || { echo "release_preflight: GITHUB_GH_TOKEN may not push to ${GH_REPO_NAME}"; exit 1; }; \
		echo "-- GitHub: GITHUB_GH_TOKEN may push to ${GH_REPO_NAME}"'
	@echo "DONE release_preflight ${ONDEWO_SIP_VERSION}"

# The suites the `tests` workflow runs, run BEFORE anything is committed or published: the workflow
# runs only after the push, so on its own it cannot stop a release.
release_tests: $(NODE_IMAGE_IF_NEEDED) ## Runs the CI test suites against the built tree (gates the release)
	$(IN_NODE)npm ci --no-audit --no-fund
	$(IN_NODE)npm test
	$(IN_NODE)npm run typecheck:examples
	$(IN_NODE)npm run test:examples
	@before="$$(cat auth/*.js auth/*.d.ts | sha256sum)"; \
		$(IN_NODE)npm run build:auth && \
		if test "$$before" != "$$(cat auth/*.js auth/*.d.ts | sha256sum)"; then \
			echo "auth/*.js or auth/*.d.ts was stale and has been regenerated: review it and re-run the release"; \
			exit 1; \
		fi

# The husky hook runs `pre-commit run` on the STAGED files and skips it when pre-commit is not installed;
# a release has to run every hook on every file.
release_precommit_hooks: $(TOOLS_IMAGE_IF_NEEDED) ## Runs eslint, prettier and every pre-commit hook on all files
	$(MAKE) eslint
	$(MAKE) prettier PRETTIER_WRITE=-w
	$(IN_PRE_COMMIT)pre-commit run --all-files

# Every file the tarball ships must be committed and byte-equal at HEAD, so the git tag of a version holds
# exactly what npm serves for it. README.md (the GitHub-only part is cut out) and package.json (the
# scripts are removed) are derived: package.json is compared without its scripts.
check_tag_matches_package: $(NODE_IMAGE_IF_NEEDED) ## Fails unless every file npm would publish is committed and byte-equal at HEAD
	@files="$$($(IN_NODE)npm pack ./npm --dry-run --json --ignore-scripts 2>/dev/null \
		| perl -MJSON::PP -0777 -ne 'print "$$_->{path}\n" for @{decode_json($$_)->[0]{files}}')" \
		&& test -n "$$files" || { echo "check_tag_matches_package: npm pack listed no files"; exit 1; }; \
	bad=0; \
	for f in $$files; do \
		case "$$f" in README.md|package.json) continue;; esac; \
		if ! git cat-file -e "HEAD:$$f" 2>/dev/null; then echo "check_tag_matches_package: $$f is not committed"; bad=1; \
		elif ! git show "HEAD:$$f" | cmp -s - "npm/$$f"; then echo "check_tag_matches_package: npm/$$f differs from HEAD:$$f"; bad=1; fi; \
	done; \
	strip='my $$p = decode_json($$_); delete $$p->{scripts}; print JSON::PP->new->canonical->encode($$p)'; \
	if test "$$(git show HEAD:package.json | perl -MJSON::PP -0777 -ne "$$strip")" != "$$(perl -MJSON::PP -0777 -ne "$$strip" npm/package.json)"; then \
		echo "check_tag_matches_package: npm/package.json differs from HEAD:package.json beyond its scripts"; bad=1; fi; \
	test "$$(perl -MJSON::PP -0777 -ne 'print decode_json($$_)->{version}' npm/package.json)" = "${ONDEWO_SIP_VERSION}" || { \
		echo "check_tag_matches_package: npm/package.json is not version ${ONDEWO_SIP_VERSION}"; bad=1; }; \
	test $$bad -eq 0 && echo "check_tag_matches_package: the $$(echo "$$files" | wc -l) shipped files are committed at HEAD"

# A publish that npm did not accept must fail the release before the push, branch, tag and GitHub release.
release_verify_npm: $(NODE_IMAGE_IF_NEEDED) ## Fails unless npm serves the released version (retried: the registry lags)
	@for attempt in $$(seq 1 $(VERIFY_ATTEMPTS)); do \
		if test "$$($(IN_NODE)npm view ${NPM_PACKAGE}@${ONDEWO_SIP_VERSION} version 2>/dev/null)" = "${ONDEWO_SIP_VERSION}"; then \
			echo "npm serves ${NPM_PACKAGE}@${ONDEWO_SIP_VERSION}"; \
			exit 0; \
		fi; \
		echo "npm does not serve ${NPM_PACKAGE}@${ONDEWO_SIP_VERSION} yet (attempt $$attempt/$(VERIFY_ATTEMPTS))"; \
		test "$$attempt" -ge $(VERIFY_ATTEMPTS) || sleep $(VERIFY_INTERVAL_S); \
	done; \
	echo "${NPM_PACKAGE}@${ONDEWO_SIP_VERSION} is not on npm"; \
	exit 1

# Read-only, after the release: the tag is on origin, the GitHub release has notes, npm serves the version.
release_verify: ## Fails unless origin has the tag, the GitHub release has notes and npm serves the version
	@git ls-remote --exit-code --tags origin "refs/tags/${ONDEWO_SIP_VERSION}" >/dev/null || { \
		echo "release_verify: tag ${ONDEWO_SIP_VERSION} is not on origin"; exit 1; }
	@$(MAKE) --no-print-directory build_utils_docker_image >/dev/null
	@$(USE_CREDENTIALS_FILE) docker run --rm --env-file "$$env_file" ${IMAGE_UTILS_NAME} sh -ec ' \
		body="$$(GH_TOKEN="$$GITHUB_GH_TOKEN" gh release view "${ONDEWO_SIP_VERSION}" --repo ${GH_REPO_NAME} --json body --jq .body)" || { \
			echo "release_verify: cannot read GitHub release ${ONDEWO_SIP_VERSION} - GITHUB_GH_TOKEN rejected or no such release"; exit 1; }; \
		test -n "$$(printf "%s" "$$body" | tr -d "[:space:]")" || { echo "release_verify: GitHub release ${ONDEWO_SIP_VERSION} has no notes"; exit 1; }; \
		echo "-- GitHub release ${ONDEWO_SIP_VERSION} has notes"'
	@$(MAKE) --no-print-directory release_verify_npm

create_release_branch: ## Create Release Branch and push it to origin
	git checkout -b "release/${ONDEWO_SIP_VERSION}"
	git push -u origin "release/${ONDEWO_SIP_VERSION}"

create_release_tag: ## Create Release Tag and push it to origin
	git tag -a ${ONDEWO_SIP_VERSION} -m "release/${ONDEWO_SIP_VERSION}"
	git push origin ${ONDEWO_SIP_VERSION}

########################################################
#		Docker

build_compiler: ## Builds Ondewo-Proto-Compiler
	cd ondewo-proto-compiler/nodejs && sh build.sh

build_utils_docker_image: ## Build utils docker image
	docker build -q -f Dockerfile.utils -t ${IMAGE_UTILS_NAME} .

# The notes are sliced on the HOST and handed over as a read-only file; gh gets the token per call through
# GH_TOKEN, so nothing logs in and nothing is stored.
release_to_github_via_docker_image: build_utils_docker_image ## Creates the GitHub release (refuses empty notes)
	@notes="$$(mktemp)"; trap 'rm -f "$$notes"' EXIT; \
		printf '%s\n' "$(CURRENT_RELEASE_NOTES)" > "$$notes"; \
		test -n "$$(tr -d '[:space:]' < "$$notes")" || { echo "ERROR: no 'Release ONDEWO SIP Nodejs Client ${ONDEWO_SIP_VERSION}' section in RELEASE.md"; exit 1; }; \
		chmod 0644 "$$notes"; \
		docker run --rm --env-file "$(RELEASE_ENV_FILE)" -v "$$notes":/release-notes.md:ro ${IMAGE_UTILS_NAME} \
			sh -ec 'GH_TOKEN="$$GITHUB_GH_TOKEN" gh release create --repo ${GH_REPO_NAME} "${ONDEWO_SIP_VERSION}" --notes-file /release-notes.md --title "Release ${ONDEWO_SIP_VERSION}"'

# npm reads the literal `${NPM_AUTOMATION_TOKEN}` from the temporary userconfig and substitutes the
# container's environment value, so the token is on no argv and in no file. npm/ is mounted read-only.
publish_npm_via_docker: build_utils_docker_image ## Publishes npm/ to npmjs.com
	@docker run --rm --env-file "$(RELEASE_ENV_FILE)" -v "$(CURDIR)/npm":/npm:ro ${IMAGE_UTILS_NAME} sh -ec ' \
		cfg="$$(mktemp)"; trap "rm -f \"$$cfg\"" EXIT; \
		printf "%s\n" "//registry.npmjs.org/:_authToken=\$${NPM_AUTOMATION_TOKEN}" > "$$cfg"; \
		node --version; npm --version; \
		npm whoami --userconfig "$$cfg" --registry https://registry.npmjs.org/; \
		npm publish /npm --access public --userconfig "$$cfg" --registry https://registry.npmjs.org/'

########################################################
#		DEVOPS-ACCOUNTS

# The credentials are copied into a 0600 file OUTSIDE the repository and the devops-accounts clone is
# deleted BEFORE `$(MAKE) release`, so the clone is never inside the directory the codegen container
# mounts; the trap deletes it (and the file) on every exit, a failed release included. The values pass
# through a subshell only: neither make nor the release's environment ever holds one.
# make runs a line that names $(MAKE) even under `make -n`, so a dry run is answered without credentials.
ondewo_release: spc ## Release with credentials from devops-accounts (DEVOPS_ACCOUNT_DIR: an existing checkout to use)
	@if test -n "$(findstring n,$(firstword -$(MAKEFLAGS)))"; then \
		echo "dry run: load the credentials into a 0600 file, delete ${DEVOPS_ACCOUNT_GIT}, then:"; \
		$(MAKE) release RELEASE_ENV_FILE=/dev/null; exit 0; \
	fi; \
	set -e; \
	env_file="$$(mktemp)"; \
	trap 'rm -f "$$env_file"; rm -rf ${DEVOPS_ACCOUNT_GIT}' EXIT; \
	if test -n "${DEVOPS_ACCOUNT_DIR}" && test -d "${DEVOPS_ACCOUNT_DIR}"; then \
		accounts="${DEVOPS_ACCOUNT_DIR}"; \
	else \
		rm -rf ${DEVOPS_ACCOUNT_GIT}; \
		git clone --quiet --depth 1 git@bitbucket.org:ondewo/${DEVOPS_ACCOUNT_GIT}.git ${DEVOPS_ACCOUNT_GIT}; \
		accounts=${DEVOPS_ACCOUNT_GIT}; \
	fi; \
	$(WRITE_CREDENTIALS); \
	rm -rf ${DEVOPS_ACCOUNT_GIT}; \
	$(MAKE) release RELEASE_ENV_FILE="$$env_file"

spc: ## Checks that neither the release branch nor the tag exists, locally or on origin (anchored)
	@if git rev-parse -q --verify "refs/tags/${ONDEWO_SIP_VERSION}" >/dev/null; then echo "-- Test 1: Tag ${ONDEWO_SIP_VERSION} exists locally!!"; exit 1; fi
	@if git rev-parse -q --verify "refs/heads/release/${ONDEWO_SIP_VERSION}" >/dev/null || git rev-parse -q --verify "refs/remotes/origin/release/${ONDEWO_SIP_VERSION}" >/dev/null; then \
		echo "-- Test 2: Branch release/${ONDEWO_SIP_VERSION} exists locally!!"; exit 1; fi
	@git ls-remote --exit-code --tags origin "refs/tags/${ONDEWO_SIP_VERSION}" >/dev/null 2>&1; rc=$$?; \
		if test $$rc -eq 0; then echo "-- Test 3: Tag ${ONDEWO_SIP_VERSION} exists on origin!!"; exit 1; \
		elif test $$rc -ne 2; then echo "-- Test 3: cannot list the tags of origin (git ls-remote exit $$rc)"; exit 1; fi
	@git ls-remote --exit-code --heads origin "refs/heads/release/${ONDEWO_SIP_VERSION}" >/dev/null 2>&1; rc=$$?; \
		if test $$rc -eq 0; then echo "-- Test 4: Branch release/${ONDEWO_SIP_VERSION} exists on origin!!"; exit 1; \
		elif test $$rc -ne 2; then echo "-- Test 4: cannot list the branches of origin (git ls-remote exit $$rc)"; exit 1; fi
	@echo "-- spc: neither branch release/${ONDEWO_SIP_VERSION} nor tag ${ONDEWO_SIP_VERSION} exists"

########################################################
# Build

update_package: ## Updates Package Version in src/package.json
	@perl -i -pe "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"${ONDEWO_SIP_VERSION}\"/g" src/package.json

build: check_out_correct_submodule_versions build_compiler update_package npm_run_build ## Build Code with Proto-Compiler
	cp src/README.md .
	cp src/RELEASE.md .
	$(MAKE) restore_ci_test_setup
	$(MAKE) create_npm_package
	$(MAKE) remove_npm_script
	@$(eval README_CUT_LINES:=$(shell cat -n src/README.md | perl -ne 'print if /START OF GITHUB README/../END OF GITHUB README/' | grep -o -E '[0-9]+' | perl -pe 's/^0+//' | awk 'NR==1; END{print}'))
	@$(eval DELETE_LINES:=$(shell echo ${README_CUT_LINES}| perl -pe "s/[[:space:]]/,/"))
	@perl -i -ne 'BEGIN{($$s,$$e)=split/,/,"${DELETE_LINES}"} print unless $$. >= $$s && $$. <= $$e' npm/README.md
	$(MAKE) install_dependencies

remove_npm_script: ## Removes the scripts section from the npm/ package.json copy (root package.json is left intact)
	@test -f npm/package.json || make create_npm_package
	$(eval script_lines:= $(shell cat npm/package.json 2>/dev/null | perl -ne 'print "$$.\n" if /\"scripts\"/../\}\,/'))
	$(eval start:= $(shell echo "$(script_lines)" | awk '{print $$1}'))
	$(eval end:= $(shell echo "$(script_lines)" | awk '{print $$NF}'))
	@if [ -n "$(start)" ] && [ -n "$(end)" ]; then perl -i -ne 'print unless $$. >= $(start) && $$. <= $(end)' npm/package.json; fi

create_npm_package: ## Create NPM Package for Release
	rm -rf npm
	mkdir npm
	cp -R api npm
	cp -R auth npm
# The package ships auth/*.js and auth/*.d.ts. Its TypeScript SOURCES must stay out: a consumer's tsc resolves
# `./auth/grpcChannel` to the .ts before the .d.ts and type-checks it under the consumer's own options
# (skipLibCheck does not cover .ts files), which ondewo-vtsi-client-nodejs 9.1.0 failed under
# exactOptionalPropertyTypes.
	rm -f npm/auth/*.spec.* npm/auth/*.test.*
	find npm/auth -name '*.ts' ! -name '*.d.ts' -delete
	cp public-api.d.ts npm
	cp public-api.js npm
	cp package.json npm
	cp package-lock.json npm
	cp LICENSE npm
	cp README.md npm
	# the published tarball is ./npm, so the ROOT .npmignore is never consulted: write one here too
	printf '%s\n' '*.spec.*' '*.test.*' '*.ts' '!*.d.ts' > npm/.npmignore

# The codegen rewrites package.json; restore_ci_test_setup puts the dev tooling ranges of .ci-package.json
# back. `npm install` then only brings package-lock.json in line with them. `npm i --save-dev <name>`
# re-resolved every tool on each release and moved eslint 10 back to 9.
install_dependencies: $(NODE_IMAGE_IF_NEEDED) ## Brings package-lock.json in line with package.json
	$(IN_NODE)npm install --no-audit --no-fund

# ondewo-sip-api is used at the tag SIP_API_GIT_BRANCH, which already holds every proto. Its own
# `make build` is never called: on a branch it commits and pushes ondewo-sip-api.
check_out_correct_submodule_versions: ## Fetches all Submodules and checks out specified branch
	@echo "START checking out correct submodule versions ..."
	git submodule update --init --recursive
	git -C ${SIP_APIS_DIR} fetch --all
	git -C ${SIP_APIS_DIR} checkout ${SIP_API_GIT_BRANCH}
	git -C ${ONDEWO_PROTO_COMPILER_DIR} fetch --all
	git -C ${ONDEWO_PROTO_COMPILER_DIR} checkout ${ONDEWO_PROTO_COMPILER_GIT_BRANCH}
	@echo "DONE checking out correct submodule versions."

# The codegen container writes into the repository root (its output volume), so it refuses to start while
# a devops-accounts clone is there. It runs as root; the files it creates are handed back to the invoking
# user from inside a container, so no sudo is needed.
npm_run_build: ## Generates api/, public-api.* and package.json with the proto compiler image
	@echo "START npm run build ..."
	@test ! -e ${DEVOPS_ACCOUNT_GIT} || { echo "npm_run_build: refusing to mount the repository while ${DEVOPS_ACCOUNT_GIT}/ is in it"; exit 1; }
	docker run --rm -v "$(CURDIR)/src":/input-volume -v "$(CURDIR)":/output-volume ondewo-nodejs-proto-compiler ondewo-sip-api ondewo
	docker run --rm --entrypoint sh -v "$(CURDIR)":/output-volume ondewo-nodejs-proto-compiler \
		-c "find /output-volume -xdev -user 0 -exec chown $$(id -u):$$(id -g) {} +"
	@echo "DONE npm run build."

restore_ci_test_setup: $(NODE_IMAGE_IF_NEEDED) ## Re-add CI test scripts + devDeps (from .ci-package.json) stripped by the proto-compiler root regen
	@$(IN_NODE)node -e 'const fs=require("fs");if(!fs.existsSync(".ci-package.json")){console.log("no .ci-package.json, skipping");process.exit(0)}const sorted=(o)=>Object.fromEntries(Object.entries(o).sort(([a],[b])=>(a<b?-1:a>b?1:0)));const p=JSON.parse(fs.readFileSync("package.json","utf8"));const c=JSON.parse(fs.readFileSync(".ci-package.json","utf8"));p.scripts=Object.assign({},p.scripts||{},c.scripts||{});p.dependencies=sorted(Object.assign({},p.dependencies||{},c.dependencies||{}));p.devDependencies=sorted(Object.assign({},p.devDependencies||{},c.devDependencies||{}));if(c.allowScripts)p.allowScripts=Object.assign({},p.allowScripts||{},c.allowScripts);if(c.description)p.description=c.description;fs.writeFileSync("package.json",JSON.stringify(p,null,2)+"\n");console.log("restore-ci-package: merged CI test setup; scripts=["+Object.keys(p.scripts).join(",")+"]")'
