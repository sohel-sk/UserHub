import express from "express";
import cors from 'cors';
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);


export = app;
