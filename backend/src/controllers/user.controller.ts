import { Response } from "express";
import prisma from "../prisma/prismaClient";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import bcrypt from "bcrypt";

// Get Profile Controller
// GET /user/profile
export const getProfile = async (
    req: AuthenticatedRequest,
    res: Response
) => { 
    const userId = req.user?.id;
    
    try {

        if (!userId) { 
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const user = await prisma.user.findUnique({
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
                updatedAt: true,
                lastLogin: true,
            }
        });
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

// Update Profile Controller
// PATCH /user/profile
export const updateProfile = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const { name, email } = req.body;
    if (!name && !email) { 
        return res.status(400).json({
            message: "At least one field (name or email) must be provided for update",
        });
    }
    if (email) { 
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser && existingUser.id !== userId) {
            return res.status(409).json({
                message: "Email is already in use",
            });
        }
    }

    const updateData: { name?: string; email?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: updateData,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            updatedAt: true,
        },
    });

    return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
    });
}

// Change Password Controller
// PATCH /user/profile/change-password
export const changePassword = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            message: "Current password and new password are required",
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user?.password) { 
        return res.status(404).json({
            message: "User not found",
        });
    }

    const ismatch = await bcrypt.compare(currentPassword, user?.password);

    if (!ismatch) {
        return res.status(401).json({
            message: "Current password is incorrect",
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
    });

    return res.status(200).json({
        message: "Password changed successfully",
    });
}