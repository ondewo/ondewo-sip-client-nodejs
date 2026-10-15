// Copyright 2021-2026 ONDEWO GmbH
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * The release process of the ONDEWO SIP client SDK contract, pinned against the Makefile.
 *
 * Order: release_preflight -> build -> tests -> hooks -> local commit -> check_tag_matches_package -> npm
 * publish -> npm serves it -> git push -> branch -> tag -> GitHub release -> release_verify. A step that
 * moves earlier than one that can fail leaves a half-made release behind: ondewo-vtsi-client-nodejs 9.1.0
 * pushed "Preparing for Release" to master before npm had accepted anything.
 *
 * Where a recipe can be run without credentials or a network it is RUN here, in a scratch repository.
 *
 * @module
 */

import { strict as assert } from 'assert';
import { execFileSync, spawnSync, SpawnSyncReturns } from 'child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { describe, it } from 'node:test';

/**
 * Walk up from the compiled spec to the repository root (the directory holding the Makefile).
 *
 * @param start - Directory to start from.
 * @returns The repository root.
 */
function findRepoRoot(start: string): string {
	let dir: string = start;
	while (!existsSync(join(dir, 'Makefile'))) {
		const parent: string = dirname(dir);
		assert.notEqual(parent, dir, 'no Makefile above the test build');
		dir = parent;
	}
	return dir;
}

const REPO_ROOT: string = findRepoRoot(__dirname);
const MAKEFILE: string = readFileSync(join(REPO_ROOT, 'Makefile'), 'utf8');

/**
 * @param target - The make target.
 * @returns The target's rule line and recipe, up to the next blank line.
 */
function recipeOf(target: string): string {
	const start: number = MAKEFILE.indexOf(`\n${target}:`);
	assert.ok(start >= 0, `the Makefile has no ${target} target`);
	return MAKEFILE.slice(start + 1).split('\n\n')[0];
}

/**
 * @param target - The make target.
 * @returns The target's recipe lines (tab-indented), without the tab.
 */
function recipeLines(target: string): string[] {
	return recipeOf(target)
		.split('\n')
		.filter((line: string): boolean => line.startsWith('\t'))
		.map((line: string): string => line.slice(1));
}

/**
 * @param lines - Recipe lines.
 * @param step - The exact recipe line of the step.
 * @returns The index of the step; fails when it is absent or present twice.
 */
function indexOfStep(lines: string[], step: string): number {
	const found: number[] = lines
		.map((line: string, index: number): number => index)
		.filter((index: number): boolean => lines[index] === step);
	assert.equal(found.length, 1, `the release runs '${step}' ${found.length} times`);
	return found[0];
}

/**
 * Create a scratch git repository holding a copy of the Makefile.
 *
 * @returns The repository directory.
 */
function scratchRepository(): string {
	const dir: string = mkdtempSync(join(tmpdir(), 'sip-nodejs-release-'));
	writeFileSync(join(dir, 'Makefile'), MAKEFILE);
	git(dir, 'init', '-q');
	return dir;
}

/**
 * @param dir - The repository.
 * @param args - git arguments.
 * @returns git's stdout.
 */
function git(dir: string, ...args: string[]): string {
	return execFileSync('git', ['-c', 'user.name=spec', '-c', 'user.email=spec@ondewo.com', ...args], {
		cwd: dir,
		encoding: 'utf8'
	});
}

/**
 * Run make in a scratch repository, with no credential in its environment: not even the DEVOPS_ACCOUNT_DIR
 * the release driver hands the client or the RELEASE_ENV_FILE of ondewo_release. Inside a release both name
 * the REAL credentials, which the stand-in docker below prints, and the "no credential" cases would pass.
 *
 * @param dir - The repository.
 * @param args - make arguments.
 * @param env - Extra environment.
 * @returns The finished process.
 */
function runMake(dir: string, args: string[], env: NodeJS.ProcessEnv = {}): SpawnSyncReturns<string> {
	const base: NodeJS.ProcessEnv = { ...process.env };
	for (const name of [
		'DEVOPS_ACCOUNT_DIR',
		'RELEASE_ENV_FILE',
		'GITHUB_GH_TOKEN',
		'GH_TOKEN',
		'NPM_AUTOMATION_TOKEN',
		'MAKEFLAGS',
		'MAKELEVEL',
		'MFLAGS'
	]) {
		delete base[name];
	}
	return spawnSync('make', ['--no-print-directory', ...args], { cwd: dir, encoding: 'utf8', env: { ...base, ...env } });
}

describe('the release target', () => {
	const lines: string[] = recipeLines('release');

	it('runs every step of the contract in the contract order', () => {
		const order: string[] = [
			'$(MAKE) release_preflight',
			'$(MAKE) build',
			'$(MAKE) check_build',
			'$(MAKE) release_tests',
			'$(MAKE) release_precommit_hooks',
			'git diff --cached --quiet || git commit --no-verify -m "Preparing for Release ${ONDEWO_SIP_VERSION}"',
			'$(MAKE) check_tag_matches_package',
			'$(MAKE) publish_npm_via_docker',
			'$(MAKE) release_verify_npm',
			'git push',
			'$(MAKE) create_release_branch',
			'$(MAKE) create_release_tag',
			'$(MAKE) release_to_github_via_docker_image',
			'$(MAKE) release_verify'
		];
		const indices: number[] = order.map((step: string): number => indexOfStep(lines, step));
		const sorted: number[] = [...indices].sort((a: number, b: number): number => a - b);
		assert.deepEqual(indices, sorted, 'the release steps are out of order');
	});

	it('runs the preflight before anything else', () => {
		const firstCommand: string | undefined = lines.find((line: string): boolean => !line.startsWith('@echo'));
		assert.equal(firstCommand, '$(MAKE) release_preflight');
	});

	it('stages before it commits, and pushes nothing before npm serves the version', () => {
		const commit: number = lines.findIndex((line: string): boolean => line.includes('git commit'));
		const lastAdd: number = lines.map((line: string): boolean => line.startsWith('git add ')).lastIndexOf(true);
		assert.ok(lastAdd < commit);
		const firstPush: number = lines.findIndex((line: string): boolean => /\bgit push\b|create_release_/.test(line));
		assert.ok(firstPush > lines.indexOf('$(MAKE) release_verify_npm'));
	});

	it('ignores the failure of no step (no leading "-")', () => {
		assert.deepEqual(
			lines.filter((line: string): boolean => line.startsWith('-')),
			[]
		);
		assert.ok(!MAKEFILE.includes('\t-git commit'));
	});

	it('stages only paths that exist, and every artifact the tarball ships', () => {
		const staged: string[] = lines
			.filter((line: string): boolean => line.startsWith('git add '))
			.map((line: string): string =>
				line
					.slice('git add '.length)
					.replace('${ONDEWO_PROTO_COMPILER_DIR}', 'ondewo-proto-compiler')
					.replace('${SIP_APIS_DIR}', 'src/ondewo-sip-api')
			);
		assert.deepEqual(
			staged.filter((path: string): boolean => !existsSync(join(REPO_ROOT, path))),
			[]
		);
		const manifest: { main: string; typings: string } = JSON.parse(
			readFileSync(join(REPO_ROOT, 'package.json'), 'utf8')
		) as { main: string; typings: string };
		for (const artifact of [manifest.main, manifest.typings, 'api', 'auth', 'README.md', 'package.json', 'tests']) {
			assert.ok(staged.includes(artifact), `the release does not stage ${artifact}`);
		}
	});
});

describe('release_preflight', () => {
	const recipe: string = recipeOf('release_preflight');

	it('proves every credential, the unreleased version, the notes and the host tools', () => {
		for (const probe of [
			'for tool in docker make git perl curl; do',
			'src/RELEASE.md',
			'$(MAKE) --no-print-directory spc',
			'https://registry.npmjs.org/',
			'404) echo',
			'git push --dry-run origin HEAD',
			'npm whoami --userconfig "$$cfg" --registry https://registry.npmjs.org/',
			'gh api repos/${GH_REPO_NAME} --jq .permissions.push',
			'test "$$push" = true'
		]) {
			assert.ok(recipe.includes(probe), `release_preflight does not run: ${probe}`);
		}
	});

	it('changes nothing', () => {
		assert.equal(
			/git commit|git tag|git push(?! --dry-run)|npm publish|gh release create|git checkout/.exec(recipe),
			null
		);
	});

	it('spc checks the tag and branch anchored, locally and on origin', () => {
		const spc: string = recipeOf('spc');
		for (const check of [
			'git rev-parse -q --verify "refs/tags/${ONDEWO_SIP_VERSION}"',
			'git rev-parse -q --verify "refs/heads/release/${ONDEWO_SIP_VERSION}"',
			'git ls-remote --exit-code --tags origin "refs/tags/${ONDEWO_SIP_VERSION}"',
			'git ls-remote --exit-code --heads origin "refs/heads/release/${ONDEWO_SIP_VERSION}"'
		]) {
			assert.ok(spc.includes(check), check);
		}
		assert.ok(!/\| *grep/.test(spc), 'spc must not grep a version out of a listing');
	});

	it('spc refuses an existing tag but not a tag that merely contains the version', () => {
		const dir: string = scratchRepository();
		const origin: string = mkdtempSync(join(tmpdir(), 'sip-nodejs-origin-'));
		try {
			git(origin, 'init', '-q', '--bare');
			git(dir, 'commit', '-q', '--allow-empty', '-m', 'init');
			git(dir, 'remote', 'add', 'origin', origin);
			git(dir, 'tag', '19.1.0');
			git(dir, 'push', '-q', 'origin', '19.1.0');
			assert.equal(runMake(dir, ['spc', 'ONDEWO_SIP_VERSION=9.1.0']).status, 0);
			git(dir, 'tag', '9.1.0');
			assert.notEqual(runMake(dir, ['spc', 'ONDEWO_SIP_VERSION=9.1.0']).status, 0);
			git(dir, 'tag', '-d', '9.1.0');
			git(dir, 'push', '-q', 'origin', 'HEAD:refs/heads/release/9.1.0');
			git(dir, 'update-ref', '-d', 'refs/remotes/origin/release/9.1.0');
			const onOrigin: SpawnSyncReturns<string> = runMake(dir, ['spc', 'ONDEWO_SIP_VERSION=9.1.0']);
			assert.notEqual(onOrigin.status, 0);
			assert.match(onOrigin.stdout, /Branch release\/9\.1\.0 exists on origin/);
		} finally {
			rmSync(dir, { recursive: true, force: true });
			rmSync(origin, { recursive: true, force: true });
		}
	});
});

describe('ondewo_release', () => {
	const recipe: string = recipeOf('ondewo_release');

	it('checks spc first, and deletes the devops-accounts clone before the release and on every exit', () => {
		assert.match(recipe, /^ondewo_release: spc /);
		const trap: number = recipe.indexOf('trap \'rm -f "$$env_file"; rm -rf ${DEVOPS_ACCOUNT_GIT}\' EXIT;');
		const clone: number = recipe.indexOf('git clone');
		const deleted: number = recipe.lastIndexOf('rm -rf ${DEVOPS_ACCOUNT_GIT};');
		const release: number = recipe.indexOf('$(MAKE) release RELEASE_ENV_FILE="$$env_file"');
		assert.ok(trap >= 0 && trap < clone, 'the trap must be set before the clone');
		assert.ok(clone < deleted && deleted < release, 'the clone must be deleted before $(MAKE) release');
	});

	it('a dry run (make -n) reads no credential', () => {
		const dir: string = scratchRepository();
		const origin: string = mkdtempSync(join(tmpdir(), 'sip-nodejs-origin-'));
		try {
			git(origin, 'init', '-q', '--bare');
			git(dir, 'commit', '-q', '--allow-empty', '-m', 'init');
			git(dir, 'remote', 'add', 'origin', origin);
			// A real run reads this checkout and deletes it (it sits inside the repository); a dry run must not.
			const accounts: string = join(dir, 'ondewo-devops-accounts');
			mkdirSync(accounts);
			const result: SpawnSyncReturns<string> = runMake(dir, ['-n', 'ondewo_release', 'ONDEWO_SIP_VERSION=0.0.1'], {
				DEVOPS_ACCOUNT_DIR: 'ondewo-devops-accounts'
			});
			assert.equal(result.status, 0, result.stderr);
			assert.match(result.stdout, /^dry run: /m);
			assert.match(result.stdout, /^make.* release_preflight$/m);
			assert.ok(existsSync(accounts), 'the dry run ran the credential step');
		} finally {
			rmSync(dir, { recursive: true, force: true });
			rmSync(origin, { recursive: true, force: true });
		}
	});

	it('uses an existing DEVOPS_ACCOUNT_DIR instead of cloning', () => {
		assert.match(MAKEFILE, /^DEVOPS_ACCOUNT_DIR\?=$/m);
		assert.ok(recipe.includes('if test -n "${DEVOPS_ACCOUNT_DIR}" && test -d "${DEVOPS_ACCOUNT_DIR}"; then'));
	});

	it('hands the release a 0600 credentials file, keeps the tokens out of its environment and cleans up', () => {
		const dir: string = scratchRepository();
		const origin: string = mkdtempSync(join(tmpdir(), 'sip-nodejs-origin-'));
		try {
			git(origin, 'init', '-q', '--bare');
			git(dir, 'commit', '-q', '--allow-empty', '-m', 'init');
			git(dir, 'remote', 'add', 'origin', origin);
			// The accounts checkout sits INSIDE the repository, where the codegen container would see it.
			const accounts: string = join(dir, 'ondewo-devops-accounts');
			mkdirSync(accounts);
			writeFileSync(join(accounts, 'account_github.env'), '# GITHUB_GH_TOKEN=comment\nGITHUB_GH_TOKEN="gh-value"\n');
			writeFileSync(join(accounts, 'account_npm.env'), 'NPM_AUTOMATION_TOKEN=npm-value\nOTHER=x\n');
			const report: string = join(dir, 'report');
			// A stand-in for the real release: record what it sees, then fail.
			writeFileSync(
				join(dir, 'fake-release.mk'),
				[
					'release:',
					`\t@{ ls -l "$(RELEASE_ENV_FILE)" | cut -c1-10; cat "$(RELEASE_ENV_FILE)"; env | grep -c -E "^(GITHUB_GH_TOKEN|NPM_AUTOMATION_TOKEN|RELEASE_ENV_FILE)=" || true; test -e ondewo-devops-accounts && echo clone-present || echo clone-gone; echo "$(RELEASE_ENV_FILE)"; } > ${report}`,
					'\t@exit 1',
					''
				].join('\n')
			);
			const result: SpawnSyncReturns<string> = runMake(
				dir,
				// $(MAKE) release must reach the stand-in, so the recursive make reads it too.
				['ondewo_release', 'ONDEWO_SIP_VERSION=0.0.1', 'MAKE=make -f Makefile -f fake-release.mk'],
				{ DEVOPS_ACCOUNT_DIR: 'ondewo-devops-accounts' }
			);
			assert.notEqual(result.status, 0, 'a failed release must fail ondewo_release');
			const seen: string[] = readFileSync(report, 'utf8').trim().split('\n');
			assert.deepEqual(seen.slice(0, 5), [
				'-rw-------',
				'GITHUB_GH_TOKEN=gh-value',
				'NPM_AUTOMATION_TOKEN=npm-value',
				'0',
				'clone-gone'
			]);
			assert.ok(!existsSync(seen[5]), 'the credentials file must be deleted after the release');
			assert.ok(!existsSync(accounts), 'the devops-accounts clone must be gone');
		} finally {
			rmSync(dir, { recursive: true, force: true });
			rmSync(origin, { recursive: true, force: true });
		}
	});
});

describe('release_preflight and release_verify run on their own', () => {
	/**
	 * Run release_verify standalone in a scratch repository whose origin has the tag, with stand-ins for
	 * docker (records the env-file it is handed) and npm (serves the version) first on the PATH.
	 *
	 * @param env - Extra environment (DEVOPS_ACCOUNT_DIR).
	 * @returns The finished process and the stand-in docker's report.
	 */
	function verifyStandalone(env: NodeJS.ProcessEnv): { result: SpawnSyncReturns<string>; report: string } {
		const dir: string = scratchRepository();
		const origin: string = mkdtempSync(join(tmpdir(), 'sip-nodejs-origin-'));
		const bin: string = mkdtempSync(join(tmpdir(), 'sip-nodejs-bin-'));
		const report: string = join(bin, 'report');
		try {
			git(origin, 'init', '-q', '--bare');
			git(dir, 'commit', '-q', '--allow-empty', '-m', 'init');
			git(dir, 'remote', 'add', 'origin', origin);
			git(dir, 'tag', '0.0.1');
			git(dir, 'push', '-q', 'origin', '0.0.1');
			writeFileSync(
				join(bin, 'docker'),
				[
					'#!/bin/sh',
					'test "$1" = run || exit 0',
					`{ printf 'argv: %s' "$*" | tr '\\n' ' '; echo; } >> ${report}`,
					'while test $# -gt 0; do',
					`  if test "$1" = --env-file; then ls -l "$2" | cut -c1-10 >> ${report}; cat "$2" >> ${report}; echo "$2" >> ${report}; fi`,
					'  shift',
					'done',
					''
				].join('\n'),
				{ mode: 0o755 }
			);
			writeFileSync(join(bin, 'npm'), '#!/bin/sh\necho 0.0.1\n', { mode: 0o755 });
			const result: SpawnSyncReturns<string> = runMake(
				dir,
				['release_verify', 'ONDEWO_SIP_VERSION=0.0.1', 'VERIFY_ATTEMPTS=1', 'VERIFY_INTERVAL_S=0'],
				{ ...env, PATH: `${bin}:${process.env.PATH ?? ''}` }
			);
			if (!existsSync(report)) {
				return { result, report: '' };
			}
			return { result, report: readFileSync(report, 'utf8') };
		} finally {
			rmSync(dir, { recursive: true, force: true });
			rmSync(origin, { recursive: true, force: true });
			rmSync(bin, { recursive: true, force: true });
		}
	}

	it('read the tokens from DEVOPS_ACCOUNT_DIR into a 0600 file for that step only, never onto an argv', () => {
		const accounts: string = mkdtempSync(join(tmpdir(), 'sip-nodejs-accounts-'));
		try {
			writeFileSync(join(accounts, 'account_github.env'), 'GITHUB_GH_TOKEN="gh-value"\n');
			writeFileSync(join(accounts, 'account_npm.env'), 'NPM_AUTOMATION_TOKEN=npm-value\n');
			const { result, report } = verifyStandalone({ DEVOPS_ACCOUNT_DIR: accounts });
			assert.equal(result.status, 0, result.stdout + result.stderr);
			const lines: string[] = report.trim().split('\n');
			assert.match(lines[0], /^argv: run --rm --env-file \S+ /);
			assert.ok(!report.split('\n')[0].includes('-value'), 'a token reached the argv of docker');
			assert.deepEqual(lines.slice(1, 4), ['-rw-------', 'GITHUB_GH_TOKEN=gh-value', 'NPM_AUTOMATION_TOKEN=npm-value']);
			assert.ok(!existsSync(lines[4]), 'the credentials file must be deleted after the step');
			assert.ok(!(result.stdout + result.stderr).includes('-value'), 'a token reached the log');
		} finally {
			rmSync(accounts, { recursive: true, force: true });
		}
	});

	it('fail before docker when there is no credential to hand over', () => {
		for (const env of [{}, { DEVOPS_ACCOUNT_DIR: join(tmpdir(), 'sip-nodejs-no-such-dir') }]) {
			const { result, report } = verifyStandalone(env);
			assert.notEqual(result.status, 0);
			assert.match(result.stdout, /release_verify: (no credentials|DEVOPS_ACCOUNT_DIR=.* is not a directory)/);
			assert.equal(report, '');
		}
	});
});

describe('create_npm_package', () => {
	it('ships the built auth helpers and the stubs, and no spec, test or TypeScript source', () => {
		const dir: string = scratchRepository();
		try {
			for (const file of [
				'api/ondewo/sip/sip_pb.js',
				'api/ondewo/sip/sip_pb.d.ts',
				'auth/grpcChannel.ts',
				'auth/grpcChannel.js',
				'auth/grpcChannel.d.ts',
				'auth/grpcChannel.spec.ts',
				'auth/grpcChannel.spec.js',
				'auth/offlineTokenProvider.test.ts',
				'public-api.js',
				'public-api.d.ts',
				'package-lock.json',
				'LICENSE',
				'README.md'
			]) {
				mkdirSync(join(dir, dirname(file)), { recursive: true });
				writeFileSync(join(dir, file), '\n');
			}
			writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: '@ondewo/spec-package', version: '1.2.3' }));
			assert.equal(runMake(dir, ['create_npm_package']).status, 0);
			const packed: string = execFileSync('npm', ['pack', './npm', '--dry-run', '--json', '--ignore-scripts'], {
				cwd: dir,
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'ignore']
			});
			const shipped: string[] = (JSON.parse(packed) as { files: { path: string }[] }[])[0].files
				.map((file: { path: string }): string => file.path)
				.sort();
			assert.deepEqual(shipped, [
				'LICENSE',
				'README.md',
				'api/ondewo/sip/sip_pb.d.ts',
				'api/ondewo/sip/sip_pb.js',
				'auth/grpcChannel.d.ts',
				'auth/grpcChannel.js',
				'package.json',
				'public-api.d.ts',
				'public-api.js'
			]);
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
});

describe('check_tag_matches_package', () => {
	/**
	 * Lay out a scratch repository with a committed root and an npm/ package built from it.
	 *
	 * @returns The repository directory.
	 */
	function packagedRepository(): string {
		const dir: string = scratchRepository();
		const manifest: Record<string, unknown> = {
			name: '@ondewo/spec-package',
			version: '1.2.3',
			main: 'public-api.js',
			scripts: { start: 'node public-api.js' }
		};
		writeFileSync(join(dir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
		writeFileSync(join(dir, 'public-api.js'), "'use strict';\n");
		writeFileSync(join(dir, 'README.md'), '# full readme\n');
		git(dir, 'add', '.');
		git(dir, 'commit', '-q', '-m', 'release');
		mkdirSync(join(dir, 'npm'));
		const shipped: Record<string, unknown> = { ...manifest };
		delete shipped.scripts;
		writeFileSync(join(dir, 'npm', 'package.json'), `${JSON.stringify(shipped, null, 2)}\n`);
		writeFileSync(join(dir, 'npm', 'public-api.js'), "'use strict';\n");
		writeFileSync(join(dir, 'npm', 'README.md'), '# cut readme\n');
		return dir;
	}

	it('runs after the local commit and before the publish', () => {
		const lines: string[] = recipeLines('release');
		assert.ok(
			lines.findIndex((line: string): boolean => line.includes('git commit')) <
				lines.indexOf('$(MAKE) check_tag_matches_package')
		);
		assert.ok(lines.indexOf('$(MAKE) check_tag_matches_package') < lines.indexOf('$(MAKE) publish_npm_via_docker'));
	});

	it('passes when every shipped file is committed and byte-equal at HEAD', () => {
		const dir: string = packagedRepository();
		try {
			const result: SpawnSyncReturns<string> = runMake(dir, ['check_tag_matches_package', 'ONDEWO_SIP_VERSION=1.2.3']);
			assert.equal(result.status, 0, result.stdout + result.stderr);
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it('fails on a shipped file that differs from HEAD, is not committed, or a different version', () => {
		const cases: [string, (dir: string) => void, RegExp][] = [
			[
				'a changed file',
				(repo: string): void => writeFileSync(join(repo, 'npm', 'public-api.js'), "'use strict'; // changed\n"),
				/npm\/public-api\.js differs from HEAD:public-api\.js/
			],
			[
				'an uncommitted file',
				(repo: string): void => writeFileSync(join(repo, 'npm', 'extra.js'), '\n'),
				/extra\.js is not committed/
			],
			[
				'a changed manifest',
				(repo: string): void =>
					writeFileSync(
						join(repo, 'npm', 'package.json'),
						JSON.stringify({ name: '@ondewo/spec-package', version: '1.2.3', main: 'other.js' })
					),
				/npm\/package\.json differs from HEAD:package\.json beyond its scripts/
			]
		];
		for (const [name, breakIt, expected] of cases) {
			const dir: string = packagedRepository();
			try {
				breakIt(dir);
				const result: SpawnSyncReturns<string> = runMake(dir, [
					'check_tag_matches_package',
					'ONDEWO_SIP_VERSION=1.2.3'
				]);
				assert.notEqual(result.status, 0, `${name} must fail the check`);
				assert.match(result.stdout, expected, name);
			} finally {
				rmSync(dir, { recursive: true, force: true });
			}
		}
		const otherVersion: string = packagedRepository();
		try {
			assert.notEqual(runMake(otherVersion, ['check_tag_matches_package', 'ONDEWO_SIP_VERSION=1.2.4']).status, 0);
		} finally {
			rmSync(otherVersion, { recursive: true, force: true });
		}
	});
});

describe('the build', () => {
	it('update_package bumps a version with multi-digit components', () => {
		const dir: string = scratchRepository();
		try {
			mkdirSync(join(dir, 'src'));
			writeFileSync(join(dir, 'src', 'package.json'), '{\n  "version": "9.10.10"\n}\n');
			assert.equal(runMake(dir, ['update_package', 'ONDEWO_SIP_VERSION=10.0.11']).status, 0);
			assert.equal(readFileSync(join(dir, 'src', 'package.json'), 'utf8'), '{\n  "version": "10.0.11"\n}\n');
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it('keeps the dev tooling ranges of package.json through the codegen, and never re-resolves them', () => {
		const root: { devDependencies: Record<string, string> } = JSON.parse(
			readFileSync(join(REPO_ROOT, 'package.json'), 'utf8')
		) as { devDependencies: Record<string, string> };
		const ci: { devDependencies: Record<string, string> } = JSON.parse(
			readFileSync(join(REPO_ROOT, '.ci-package.json'), 'utf8')
		) as { devDependencies: Record<string, string> };
		assert.deepEqual(ci.devDependencies, root.devDependencies, '.ci-package.json must carry every dev tool range');
		assert.ok(!recipeOf('install_dependencies').includes('--save-dev'));

		const dir: string = scratchRepository();
		try {
			// What the codegen leaves behind: src/package.json's (older) tooling ranges.
			writeFileSync(
				join(dir, 'package.json'),
				JSON.stringify({ name: 'x', dependencies: { b: '1', a: '1' }, devDependencies: { eslint: '^9.13.0' } })
			);
			writeFileSync(join(dir, '.ci-package.json'), readFileSync(join(REPO_ROOT, '.ci-package.json'), 'utf8'));
			const result: SpawnSyncReturns<string> = runMake(dir, ['restore_ci_test_setup']);
			assert.equal(result.status, 0, result.stderr);
			const restored: { dependencies: Record<string, string>; devDependencies: Record<string, string> } = JSON.parse(
				readFileSync(join(dir, 'package.json'), 'utf8')
			) as { dependencies: Record<string, string>; devDependencies: Record<string, string> };
			assert.deepEqual(restored.devDependencies, root.devDependencies);
			assert.deepEqual(Object.keys(restored.devDependencies), Object.keys(root.devDependencies).sort());
			assert.deepEqual(Object.keys(restored.dependencies), ['a', 'b']);
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it('never runs make in ondewo-sip-api (its build commits and pushes it) and never needs sudo', () => {
		assert.ok(!recipeOf('check_out_correct_submodule_versions').includes('make -C'));
		assert.equal(
			/\bsudo\b/.exec(
				MAKEFILE.split('\n')
					.filter((line: string): boolean => line.startsWith('\t'))
					.join('\n')
			),
			null
		);
	});

	it('the codegen container, which mounts the repository, refuses to start while a devops-accounts clone is in it', () => {
		const recipe: string = recipeOf('npm_run_build');
		assert.ok(recipe.indexOf('test ! -e ${DEVOPS_ACCOUNT_GIT}') < recipe.indexOf('docker run'));
	});
});

describe('the utils image', () => {
	const dockerfile: string = readFileSync(join(REPO_ROOT, 'Dockerfile.utils'), 'utf8');

	it('pins the base image by version and digest, and nvm, node, gh and pre-commit by version', () => {
		assert.match(dockerfile, /^FROM python:\d+\.\d+\.\d+-slim-\w+@sha256:[0-9a-f]{64}$/m);
		assert.ok(!/latest|\/master\//.test(dockerfile));
		for (const pin of [
			/^ARG NVM_VERSION=v\d+\.\d+\.\d+$/m,
			/^ARG NODE_VERSION=\d+\.\d+\.\d+$/m,
			/^ARG GH_VERSION=\d+\.\d+\.\d+$/m,
			/^ARG GH_SHA256=[0-9a-f]{64}$/m,
			/^ARG PRE_COMMIT_VERSION=\d+\.\d+\.\d+$/m
		]) {
			assert.match(dockerfile, pin);
		}
		assert.ok(dockerfile.includes('sha256sum -c'));
	});

	it('holds no file of the repository, so it can be built before anything else and never carries a credential', () => {
		assert.equal(/^\s*(COPY|ADD)\b/m.exec(dockerfile), null);
		const ignored: string[] = readFileSync(join(REPO_ROOT, '.dockerignore'), 'utf8').split('\n');
		for (const entry of ['ondewo-devops-accounts', 'node_modules', '.git', 'src/ondewo-sip-api', '*']) {
			assert.ok(ignored.includes(entry), `.dockerignore does not exclude ${entry}`);
		}
	});
});

describe('the tests workflow', () => {
	const workflowsDir: string = join(REPO_ROOT, '.github', 'workflows');
	const workflows: string = readdirSync(workflowsDir)
		.filter((file: string): boolean => statSync(join(workflowsDir, file)).isFile())
		.flatMap((file: string): string[] => readFileSync(join(workflowsDir, file), 'utf8').split('\n'))
		.filter((line: string): boolean => !line.trim().startsWith('#'))
		.join('\n');

	it('runs on tags, installs from the lockfile and checks out the api submodule the API tests read', () => {
		assert.match(workflows, /^\s+tags: \['\*'\]$/m);
		assert.ok(!/\bnpm (?:install|i)\b/.test(workflows));
		assert.ok(workflows.includes('git submodule update --init src/ondewo-sip-api'));
	});
});
