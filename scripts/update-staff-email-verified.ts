import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating staff emailVerified field...');
  
  const result = await prisma.staff.updateMany({
    where: {
      emailVerified: false
    },
    data: {
      emailVerified: true
    }
  });
  
  console.log(`✅ Updated ${result.count} staff records`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
