import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    
    if (user?.role !== "ADMIN") { 
        return <Navigate to="/" />;
    }
    return children;

}