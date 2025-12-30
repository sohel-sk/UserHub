import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import type { ReactNode } from "react";

interface ProtectedRouteprops { 
    children: ReactNode
    requiredRole?: "USER" | "ADMIN"
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteprops) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
};
