import { useEffect, useState } from "react";
import api from "../services/api";
import type { User } from "../types";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/admin/users?page=1").then(res => {
        setUsers(res.data.data);
        });
    }, []);

    return (
        <table>
        {
            users.map((u: User) => (
            <tr key={u.id}>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.status}</td>
            </tr>
        ))}
        </table>
    );
}
