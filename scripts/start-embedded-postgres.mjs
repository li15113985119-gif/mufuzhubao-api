import EmbeddedPostgres from 'embedded-postgres';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const dataDir = resolve('.local-postgres');
mkdirSync(dataDir, { recursive: true });
const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  persistent: true,
  autoRehydrateSymlinks: true,
  onLog: (message) => console.log('[postgres]', message),
  onError: (error) => console.error('[postgres:error]', error),
});

try {
  await pg.initialise();
} catch (error) {
  if (!String(error).includes('already exists')) console.warn('初始化提示：', error.message || error);
}
await pg.start();
try {
  await pg.createDatabase('kongxiaozhi');
  console.log('数据库 kongxiaozhi 已创建');
} catch (error) {
  console.log('数据库已存在或无需创建');
}
console.log('Embedded PostgreSQL running at localhost:5432');
const shutdown = async () => { try { await pg.stop(); } finally { process.exit(0); } };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
await new Promise(() => {});