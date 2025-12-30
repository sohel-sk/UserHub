import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient";
import config = require("../config/config");

interface JwtPayload { 
    userId: string;
    role: string;
}

export interface AuthenticatedRequest extends Request { 
    user?: {
        id: string;
        role: string;
    }
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => { 

    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(
            token as string,
            config.JWT_SECRET
        ) as JwtPayload;


        const user = await prisma.user.findUnique({
            where: {
                id:decoded.userId
            },
        })

        if (!user) { 
            return res.status(401).json({
                message: "Invalid token"
            })
        }
        
        if (user.status !== "ACTIVE") { 
            return res.status(403).json({
                message: "Account is deactivated. Contact the Admin for the activation of the account",
            });
        }

        req.user = {
            id: user.id,
            role:user.role,
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
        
    }
}

export const noCache = (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    res.set("Cache-Control", "no-store");
    next();
};

