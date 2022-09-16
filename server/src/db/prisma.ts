import { PrismaClient } from '@prisma/client';

interface CustomNodeJsGlobal {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();
prisma.$connect();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;