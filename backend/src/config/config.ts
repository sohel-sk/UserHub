import dotenv = require("dotenv");
dotenv.config();

interface Config {
    PORT: number;
    nodeEnv: string;
    DATABASE_URL: string;
}

const config: Config = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL || "",
};

export = config;