import dotenv = require("dotenv");
dotenv.config();

interface Config {
    PORT: number;
    nodeEnv: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    FRONTEND_URL: string;
}

const config: Config = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
};

export = config;