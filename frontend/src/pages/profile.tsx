import { useEffect } from "react";
import { useAuth } from "../context/authContext";

export default function ProfilePage() {
    const { user } = useAuth();

    useEffect(() => {
        document.title = "Profile - UserHub";
    }, []);


    return (
        <div>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
        </div>
    );
}


