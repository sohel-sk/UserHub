import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"
import * as config from "../config/config";

const prismaAdapter = new PrismaPg({
    connectionString: config.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter: prismaAdapter,
});

export default prisma;

