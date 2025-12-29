import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import prisma from "../prisma/prismaClient";
import { number } from "zod";

// GET /admin/users?page=1
export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => { 
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
            where: {
                role: "USER",
            },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                lastLogin: true,
            },
            orderBy: {createdAt: "desc"},
        }),
        prisma.user.count(),
    ]);


    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
        users,
        pagination: {
            totalUsers,
            totalPages,
            currentPage: page,
        }
    });
}

// PATCH /admin/user/:id/activate
export const activateUser = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.params;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" },
    });

    return res.status(200).json({
        message: "User activated successfully",
        userId: updatedUser.id,
    });

}

// PATCH /admin/user/:id/deactivate
export const deactivateUser = async (req: AuthenticatedRequest, res: Response) => { 
    const { userId } = req.params;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: "INACTIVE" },
    });

    return res.status(200).json({
        message: "User deactivated successfully",
        userId: updatedUser.id,
    });
}