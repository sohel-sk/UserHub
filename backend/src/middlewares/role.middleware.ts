import { Response,NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

export const authorize =
    (allowedRoles: Array<"USER" | "ADMIN">) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => { 
        if (!req.user) { 
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!allowedRoles.includes(req.user.role as "USER" | "ADMIN")) { 
            return res.status(403).json({
                message: "Access Denied",
            });
        }

        next();
    }