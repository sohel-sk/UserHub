import dotenv = require("dotenv");
dotenv.config();

interface Config {
    PORT: number;
    nodeEnv: string;
}

const config: Config = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    nodeEnv: process.env.NODE_ENV || "development",
};

export = config;