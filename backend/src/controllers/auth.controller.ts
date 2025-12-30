import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient";
import { signupSchema, loginSchema } from "../validators/auth.validator";
import config from "../config/config";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

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
        return res.status(500).json({
        message: "Internal server error "+error.message,
        });
    }
};

export const login = async (req: Request, res: Response) => { 
    try {
        // validation input
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;

        // check user exists or not 
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        // no user found (resource not found code returned)
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

    
        // check for activity status
        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                message: "Account is deactivated. Contact admin.",
            });
        }

        // password hash compare
        const passwordCheck = await bcrypt.compare(password, user.password);

        // wrong password return (unauthorized status code returned )
        if (!passwordCheck) { 
            return res.status(401).json({
                message: "Invalid Credentials",
            });
        }

        // create jwt token 
        const token = jwt.sign({
            userId: user.id, role: user.role
        },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // set cookie values
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: false,
            sameSite: 'lax'
        })

        // update last login time before sending 200 status response

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // return response with 200 OK status
        return res.status(200).json({
            message: "Login Successfull",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });
        
    } catch (error: any) {
        if (error.name === "ZodError") { 
            return res.status(400).json({
                message: "Validation Error - ",
                errors: error.errors,
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
        
    }
}

export const getme = async (req: AuthenticatedRequest, res: Response) => { 
    try {

        const userId = req.user?.id;
        if(userId === undefined) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                createdAt: true,
            }
        });
        return res.status(200).json(user);
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            errors:error.errors,
        })
    }
}

export const logout = async (req: Request, res: Response) => {
    // Clear the token cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ message: "Logout successful" });
}