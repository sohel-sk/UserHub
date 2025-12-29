const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require("@prisma/adapter-pg");
import config = require('../config/config');


const prismaAdapter = new PrismaPg({
    connectionString: config.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter: prismaAdapter,
});

export = prisma;
