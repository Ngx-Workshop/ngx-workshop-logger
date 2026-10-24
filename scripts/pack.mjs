import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['pack', '--pack-destination', '../..'],
  { cwd: fileURLToPath(new URL('../dist/ngx-workshop-logger', import.meta.url)), stdio: 'inherit' });
process.exit(result.status ?? 1);
