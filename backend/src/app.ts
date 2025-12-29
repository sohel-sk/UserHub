import express = require("express");
import cors = require("cors");
import prisma = require("./prisma/prismaClient");

const app = express();
app.use(cors())

app.get("/test-db", async (_, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

export = app;
