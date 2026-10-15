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
//

/**
 * Release credentials reach every process through the environment, never through its argv.
 *
 * `/proc/<pid>/cmdline` (and `ps`) is world-readable, so a token on the command line of docker, npm, make or
 * `/bin/sh -c` is visible to every user on the release host for the life of the process. make expands `$(NAME)`
 * and `${NAME}` INTO a recipe line before the shell runs it, so a recipe reads a credential as `$${NAME}`, which
 * the shell expands from the exported environment.
 *
 * @module
 */

import { test as runTestCase } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

/**
 * @param start - The directory to start from.
 * @returns The closest ancestor directory holding the Makefile (the repository root).
 */
function findRepoRoot(start: string): string {
	let dir: string = start;
	while (!existsSync(join(dir, 'Makefile'))) {
		dir = dirname(dir);
	}
	return dir;
}

/** The repository root (the compiled spec runs from a build directory below it). */
const REPO_ROOT: string = findRepoRoot(__dirname);
/** The Makefile holding the release recipes. */
const MAKEFILE: string = readFileSync(join(REPO_ROOT, 'Makefile'), 'utf8');
/** The recipe lines (make hands every tab-indented line to `/bin/sh -c`). */
const RECIPE_LINES: string[] = MAKEFILE.split('\n').filter((line: string): boolean => line.startsWith('\t'));
/** A variable name that holds a credential. */
const SECRET_NAME: string = '[A-Z0-9_]*(?:TOKEN|PASSWORD|USERNAME|SECRET|API_KEY)[A-Z0-9_]*';
/** The GitHub workflows, if any. */
const WORKFLOWS_DIR: string = join(REPO_ROOT, '.github', 'workflows');

/**
 * @param target - The make target.
 * @returns The target's rule line and recipe, up to the next blank line.
 */
function recipeOf(target: string): string {
	const start: number = MAKEFILE.indexOf(`\n${target}:`);
	if (start < 0) {
		throw new Error(`the Makefile has no ${target} target`);
	}
	return MAKEFILE.slice(start + 1).split('\n\n')[0];
}

/** @returns Every workflow line that interpolates a secret anywhere but into a plain `NAME: ${{ secrets.X }}` mapping. */
function workflowSecretLines(): string[] {
	const files: string[] = existsSync(WORKFLOWS_DIR) ? readdirSync(WORKFLOWS_DIR) : [];
	return files.flatMap((file: string): string[] =>
		readFileSync(join(WORKFLOWS_DIR, file), 'utf8')
			.split('\n')
			.filter((line: string): boolean => line.includes('secrets.'))
			.filter((line: string): boolean => !/^\s*[\w-]+:\s*\$\{\{\s*secrets\.\w+\s*\}\}\s*$/.test(line))
			.map((line: string): string => `${file}: ${line.trim()}`)
	);
}

/** @returns The recipe lines on which make itself would expand a credential. */
function recipeLinesExpandingASecret(): string[] {
	// `$(if $(NAME),<set>,<unset>)` only renders whether NAME is set; `$$` is the shell's own expansion.
	const expanded: RegExp = new RegExp(`(?<!\\$)\\$[({]${SECRET_NAME}[)}]`);
	const presenceCheck: RegExp = new RegExp(`\\$\\(if \\$[({]${SECRET_NAME}[)}],`, 'g');
	return RECIPE_LINES.filter((line: string): boolean => expanded.test(line.replace(presenceCheck, '')));
}

runTestCase('make never expands a credential into a recipe line', () => {
	assert.deepEqual(recipeLinesExpandingASecret(), []);
});

/** The targets whose docker run is handed the credentials file. */
const CREDENTIALED_TARGETS: string[] = [
	'release_preflight',
	'publish_npm_via_docker',
	'release_to_github_via_docker_image',
	'release_verify'
];

runTestCase('credentials reach docker only through the RELEASE_ENV_FILE env-file, never by name or value', () => {
	assert.equal(new RegExp(`(?:-e|--env)[\\s=]+${SECRET_NAME}\\b`).exec(MAKEFILE), null);
	for (const target of ['publish_npm_via_docker', 'release_to_github_via_docker_image']) {
		assert.ok(recipeOf(target).includes('docker run --rm --env-file "$(RELEASE_ENV_FILE)"'), target);
	}
	// These two also run on their own (the release driver), with only DEVOPS_ACCOUNT_DIR set.
	for (const target of ['release_preflight', 'release_verify']) {
		assert.ok(recipeOf(target).includes('@$(USE_CREDENTIALS_FILE) docker run --rm --env-file "$$env_file"'), target);
	}
	const withEnvFile: string[] = RECIPE_LINES.filter((line: string): boolean => line.includes('--env-file'));
	assert.equal(withEnvFile.length, CREDENTIALED_TARGETS.length);
});

runTestCase('a token in the caller environment is passed to no recipe', () => {
	assert.match(MAKEFILE, /^unexport GITHUB_GH_TOKEN GH_TOKEN NPM_AUTOMATION_TOKEN$/m);
	assert.equal(/^(?:GITHUB_GH_TOKEN|NPM_AUTOMATION_TOKEN|GH_TOKEN)\s*[?:]?=/m.exec(MAKEFILE), null);
});

runTestCase('the utils image carries no credential, not even a placeholder', () => {
	const dockerfile: string = readFileSync(join(REPO_ROOT, 'Dockerfile.utils'), 'utf8');
	assert.equal(new RegExp(`^\\s*(?:ENV|ARG)\\s+${SECRET_NAME}`, 'm').exec(dockerfile), null);
});

runTestCase('npm reads its token from the environment through a temporary userconfig, never from its argv', () => {
	const tokenLines: string[] = RECIPE_LINES.filter((line: string): boolean => line.includes('_authToken'));
	assert.equal(tokenLines.length, 2);
	for (const line of tokenLines) {
		assert.ok(line.includes('"//registry.npmjs.org/:_authToken=\\$${NPM_AUTOMATION_TOKEN}" > "$$cfg"'), line);
	}
});

runTestCase('gh gets its token per call through GH_TOKEN and never logs in', () => {
	assert.ok(!MAKEFILE.includes('gh auth login'));
	const ghCalls: string[] = RECIPE_LINES.filter((line: string): boolean => /\bgh (?:api|release)\b/.test(line));
	assert.ok(ghCalls.length >= 3);
	for (const line of ghCalls) {
		assert.ok(line.includes('GH_TOKEN="$$GITHUB_GH_TOKEN" gh '), line);
	}
});

runTestCase('the devops release writes the credentials to a file and never into the environment of the release', () => {
	const recipe: string = recipeOf('ondewo_release');
	assert.ok(!recipe.includes('$(info)'));
	assert.ok(!recipe.includes('$(shell'));
	assert.ok(!recipe.includes('set -a'));
	assert.ok(recipe.includes('\t$(WRITE_CREDENTIALS); \\'));
	// the values are evaluated inside a ( subshell ) whose only output is the 0600 mktemp file
	const write: string = (MAKEFILE.match(/^WRITE_CREDENTIALS=.*\n.*$/m) ?? [''])[0];
	assert.ok(write.includes("grep -h -E '^(GITHUB_GH_TOKEN|NPM_AUTOMATION_TOKEN)='"));
	assert.match(write, /^WRITE_CREDENTIALS=\( eval "\$\$\(grep [^\n]*\n[^\n]*\) > "\$\$env_file"$/);
	assert.match(recipe, /\$\(MAKE\) release RELEASE_ENV_FILE="\$\$env_file"$/);
	assert.equal(/\bmake\b[^\n]*\$\(info\)/.exec(MAKEFILE), null);
	assert.equal(new RegExp(`(?:\\bmake|\\$\\(MAKE\\))[^\\n]*\\b${SECRET_NAME}=`).exec(RECIPE_LINES.join('\n')), null);
});

runTestCase('no workflow interpolates a secret into a run line', () => {
	assert.deepEqual(workflowSecretLines(), []);
});
