import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(projectRoot, '.env');
const outputPath = resolve(projectRoot, 'src/app/runtime-config.ts');

const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const separator = line.indexOf('=');
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
);

if (!env.authorization_url) {
  throw new Error('Missing authorization_url in .env');
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `export const runtimeConfig = {\n  authorization_url: ${JSON.stringify(env.authorization_url)},\n} as const;\n`,
);
