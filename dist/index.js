"use strict";
// src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const result = await prisma.$queryRaw `SELECT 1`;
    console.log('Database connection successful:', result);
}
main()
    .catch((e) => {
    console.error('Database connection failed:', e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
