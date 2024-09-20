// src/index.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const result = await prisma.$queryRaw`SELECT 1`;
  console.log('Database connection successful:', result);
}

main()
  .catch((e) => {
    console.error('Database connection failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
