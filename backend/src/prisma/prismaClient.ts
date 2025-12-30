import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import config = require('../config/config');


const prismaAdapter = new PrismaPg({
    connectionString: config.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter: prismaAdapter,
});

export = prisma;
