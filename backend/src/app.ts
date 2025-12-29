import express from "express";
import cors from 'cors';
import prisma from "./prisma/prismaClient";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/auth.middleware";
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors());
app.use("/auth", authRoutes)


export = app;
