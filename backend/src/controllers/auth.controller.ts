import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient";
import { signupSchema } from "../validators/auth.validator";
import config from "../config/config";

export const signup = async (req: Request, res: Response) => {
    try {
        // validate input
        const validatedData = signupSchema.parse(req.body);
        const { name, email, password } = validatedData;

        // Check for existing user
        const existingUser = await prisma.user.findUnique({
        where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }

        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // creating User
        const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        });

        // Generating JWT
        const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: "1h" }
        );

        // response
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict'
        });

        return res.status(201).json({
        message: "User registered successfully"
        }).cookie("token ", token);
    } catch (error: any) {

        prisma.user.delete({
            where: {
                email: req.body.email
            }
        });
        
        if (error.name === "ZodError") {
        return res.status(400).json({
            message: error.message,
            
        });
        }
        console.error(error);
        return res.status(500).json({
        message: "Internal server error "+error.message,
        });
    }
};
