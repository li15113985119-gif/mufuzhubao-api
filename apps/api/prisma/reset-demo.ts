import { PrismaClient } from '@prisma/client';
import { seedDemoData } from './seed';
if (process.env.NODE_ENV === 'production') { throw new Error('演示数据重置脚本禁止在生产环境运行'); }
const prisma = new PrismaClient();
async function main() {
  await prisma.$transaction([
    prisma.caseView.deleteMany(), prisma.caseFeedback.deleteMany(), prisma.favorite.deleteMany(), prisma.issue.deleteMany(),
    prisma.activityLog.deleteMany(), prisma.attachment.deleteMany(), prisma.resource.deleteMany(), prisma.faultCase.deleteMany(), prisma.user.deleteMany(),
  ]);
  const result = await seedDemoData(prisma);
  console.log('Demo reset complete:', result);
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());