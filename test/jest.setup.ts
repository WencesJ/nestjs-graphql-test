import { execSync } from 'child_process';
import { join } from 'path';
const prismaBinary = join(__dirname, '..', 'node_modules', '.bin', 'prisma');
beforeAll(async () => {
  execSync(`${prismaBinary} migrate deploy`);
});
