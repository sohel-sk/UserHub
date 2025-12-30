import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

interface User { 
    id: string;
    name: string;
    email: string;
    status: "ACTIVE" | "INACTIVE";
    role: "ADMIN" | "USER";
}


interface AuthContextType { 
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await api.get("/auth/me", {
                headers: {
                    "Cache-Control": "no-cache",
                },
            });
            setUser(response.data.user);

        } catch (error: any) {
            if (error.response?.status === 401) {
                setUser(null); // ONLY if truly unauthorized
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        await api.post("/auth/logout");
        
        setUser(null);
    };

    const login = async (email: string, password: string) => {
        const response = await api.post("/auth/login", { email, password });
        setUser(response.data.user);
    };

    const signup = async (name: string, email: string, password: string) => {
        const response = await api.post("/auth/signup", { name, email, password });
        setUser(response.data.user);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, login, signup }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );


};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => { 
    const context = useContext(AuthContext);
    if (!context) { 
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}