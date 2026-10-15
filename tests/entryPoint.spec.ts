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

// `require('@ondewo/sip-client-nodejs')` must work. Up to ondewo-proto-compiler 5.15.4 the generated
// public-api.js (the package `main`) was a list of `export * from` lines in a CommonJS package, so
// Node loaded it as an ES module and failed with ERR_MODULE_NOT_FOUND. The package root is loaded
// in a child process exactly the way a consumer does it, on every Node version CI runs.

import { strict as assert } from 'assert';
import { execFileSync } from 'child_process';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, join, relative } from 'path';
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

/**
 * `require()` the package root (its `main`) in a fresh Node process.
 *
 * @returns The names the entry point exports.
 */
function exportedNames(): string[] {
	const script: string = `process.stdout.write(JSON.stringify(Object.keys(require(${JSON.stringify(REPO_ROOT)}))))`;
	// The child loads the SHIPPED auth/*.js; keep it out of the parent's c8 coverage, which measures the test build.
	const env: NodeJS.ProcessEnv = { ...process.env };
	env.NODE_V8_COVERAGE = '';
	return JSON.parse(execFileSync(process.execPath, ['-e', script], { encoding: 'utf8', env })) as string[];
}

/**
 * `require()` the package root in a fresh Node process and evaluate one expression against it.
 *
 * @param expression - JavaScript expression over `m`, the loaded package root; its value must be JSON.
 * @returns The JSON-decoded value of the expression.
 */
function evaluateOnPackage(expression: string): unknown {
	const script: string = `const m = require(${JSON.stringify(REPO_ROOT)}); process.stdout.write(JSON.stringify(${expression}))`;
	const env: NodeJS.ProcessEnv = { ...process.env };
	env.NODE_V8_COVERAGE = '';
	return JSON.parse(execFileSync(process.execPath, ['-e', script], { encoding: 'utf8', env })) as unknown;
}

/**
 * List the RPCs of one generated client exported from the package root.
 *
 * @param client - Name of the generated client.
 * @returns The method names of the client's service definition, sorted.
 */
function serviceMethods(client: string): string[] {
	return (evaluateOnPackage(`Object.keys(m[${JSON.stringify(client)}].service)`) as string[]).sort();
}

/**
 * List the generated stubs below `api/` whose file name ends with `suffix`.
 *
 * @param suffix - File name ending, e.g. `_pb.js`.
 * @param replacement - What `suffix` is replaced by in the returned path (the module specifier's ending).
 * @returns Repository-relative paths (`./api/...`) with `suffix` replaced by `replacement`, sorted.
 */
function generatedStubs(suffix: string, replacement: string): string[] {
	const found: string[] = [];
	const walk: (dir: string) => void = (dir: string): void => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path: string = join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(path);
			} else if (entry.name.endsWith(suffix)) {
				found.push(`./${relative(REPO_ROOT, path).slice(0, -suffix.length)}${replacement}`);
			}
		}
	};
	walk(join(REPO_ROOT, 'api'));
	return found.sort();
}

/** The ondewo/sip protos of the pinned ondewo-sip-api submodule. */
const SIP_PROTOS_DIR: string = join(REPO_ROOT, 'src', 'ondewo-sip-api', 'ondewo', 'sip');

/**
 * Read every `service` and its `rpc` names out of the pinned ondewo/sip protos, so the expectation moves
 * with the API instead of being a list that the next API release breaks.
 *
 * @returns Service name to its RPCs as the generated client names them (lower camel case), sorted.
 */
function protoServices(): Map<string, string[]> {
	assert.ok(
		existsSync(SIP_PROTOS_DIR),
		`${SIP_PROTOS_DIR} is missing: run git submodule update --init src/ondewo-sip-api`
	);
	const services: Map<string, string[]> = new Map<string, string[]>();
	for (const file of readdirSync(SIP_PROTOS_DIR).filter((name: string): boolean => name.endsWith('.proto'))) {
		const source: string = readFileSync(join(SIP_PROTOS_DIR, file), 'utf8').replace(/\/\/.*$/gm, '');
		for (const block of source.matchAll(/^service\s+(\w+)\s*\{([\s\S]*?)^\}/gm)) {
			const rpcs: string[] = [...block[2].matchAll(/\brpc\s+(\w+)\s*\(/g)].map(
				(match: RegExpMatchArray): string => match[1].charAt(0).toLowerCase() + match[1].slice(1)
			);
			services.set(block[1], rpcs.sort());
		}
	}
	return services;
}

describe('package entry point', () => {
	// A release that commits a regenerated api/ without the regenerated public-api.* tags a version whose
	// entry point lacks exports the npm tarball of that same version has.
	it('public-api.js re-exports every generated stub and nothing that does not exist', () => {
		const required: string[] = [
			...readFileSync(join(REPO_ROOT, 'public-api.js'), 'utf8').matchAll(/require\('(\.\/api\/[^']+)'\)/g)
		]
			.map((match: RegExpMatchArray): string => match[1])
			.sort();
		assert.deepEqual(required, generatedStubs('_pb.js', '_pb'));
	});

	it('public-api.d.ts exports the typings of every generated stub', () => {
		const exported: Set<string> = new Set<string>(
			[...readFileSync(join(REPO_ROOT, 'public-api.d.ts'), 'utf8').matchAll(/from '(\.\/api\/[^']+)'/g)].map(
				(match: RegExpMatchArray): string => match[1]
			)
		);
		const missing: string[] = generatedStubs('_pb.d.ts', '_pb.d').filter(
			(stub: string): boolean => !exported.has(stub)
		);
		assert.deepEqual(missing, []);
	});

	it('package.json main is the CommonJS public-api.js', () => {
		const manifest: { main?: string } = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8')) as {
			main?: string;
		};
		assert.equal(manifest.main, 'public-api.js');
		const lines: string[] = readFileSync(join(REPO_ROOT, 'public-api.js'), 'utf8').split('\n');
		assert.deepEqual(
			lines.filter((line: string): boolean => line.startsWith('export ')),
			[]
		);
	});

	it('require() of the package root loads and exports the generated clients and the helpers', () => {
		const names: string[] = exportedNames();
		for (const name of [
			'SipClient',
			'SipStartCallRequest',
			'SipReportAnsweringMachineDetectedRequest',
			'AnsweringMachineDetectionResult',
			'SipSetCallMediaControlRequest',
			'SipCallAudioRequest',
			'SipCallAudioResponse',
			'createGrpcClient',
			'createChannelCredentials',
			'GrpcClientConfig',
			'login',
			'OfflineTokenProvider'
		]) {
			assert.ok(names.includes(name), `${name} is not exported from the package root`);
		}
	});

	it('every service of the pinned ondewo-sip-api protos has a client carrying exactly its RPCs', () => {
		const services: Map<string, string[]> = protoServices();
		assert.ok(services.size > 0, 'no service found in the ondewo/sip protos');
		const clients: Record<string, string[]> = evaluateOnPackage(
			`Object.fromEntries(${JSON.stringify([...services.keys()])}.map((s) => [s, m[s + 'Client'] ? Object.keys(m[s + 'Client'].service).sort() : null]))`
		) as Record<string, string[]>;
		for (const [service, rpcs] of services) {
			assert.deepEqual(clients[service], rpcs, `${service}Client does not match service ${service} of the proto`);
		}
	});

	it('SipClient carries the call-control and answering-machine RPCs of ondewo-sip-api 5.5.0', () => {
		const methods: string[] = serviceMethods('SipClient');
		for (const name of [
			'sipStartCall',
			'sipEndCall',
			'sipGetSipStatus',
			'sipReportAnsweringMachineDetected',
			'sipSetCallMediaControl',
			'sipStreamCallAudio'
		]) {
			assert.ok(methods.includes(name), `SipClient has no ${name}`);
		}
	});
});
