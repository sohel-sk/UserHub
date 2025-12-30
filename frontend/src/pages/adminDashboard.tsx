"use client"

import { useState, useEffect } from "react"
import api  from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, 
} from "../components/ui/alert-dialog"
import { toast } from "../hooks/use-toast"
import { Users, ChevronLeft, ChevronRight, UserCheck, UserX, Shield } from "lucide-react"
import type { User, PaginatedResponse } from "../types"
import { cn } from "../lib/utils"

export default  function AdminPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean
        user: User | null
        action: "activate" | "deactivate"
    }>({
        open: false,
        user: null,
        action: "activate",
    })

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await api.get("admin/users", {
                params: { page },
            });
            const response: PaginatedResponse<User> = {
                data: res.data.users,
                total: res.data.pagination.totalUsers,
                page: res.data.pagination.currentPage,
                limit: 10,
                totalPages: res.data.pagination.totalPages,
            }

        setUsers(response.data)
        setTotalPages(response.totalPages)
        } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Could not load users",
            variant: "destructive",
        })
        } finally {
        setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page])

    const handleStatusChange = async () => {
        if (!confirmDialog.user) return

        const { id } = confirmDialog.user;

        const action = confirmDialog.action

        try {
        await api.patch(`/admin/user/${id}/${action}`)
            setUsers((prevUsers) =>
            prevUsers.map((u) =>
                    u.id === id
                    ? {
                        ...u,
                        status: action === "activate" ? "ACTIVE" : "INACTIVE",
                        }
                    : u
                )
            )
        toast({
            title: "User updated",
            description: `User has been ${confirmDialog.action}d successfully.`,
        })
        } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Could not update user",
            variant: "destructive",
        })
        } finally {
        setConfirmDialog({ open: false, user: null, action: "activate" })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-teal-500/25">
                <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gradient">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage users and permissions</p>
            </div>
            </div>
        </div>

        <Card>
            <CardHeader>
            <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>User Management</CardTitle>
            </div>
            <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
            {loading ? (
                <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                        <tr key={user.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-4">
                            <div>
                                <p className="font-medium">{user.name || "No name"}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            </td>
                            <td className="px-4 py-4">
                            <span
                                className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                                user.role === "ADMIN"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-secondary text-secondary-foreground",
                                )}
                            >
                                {user.role === "ADMIN" && <Shield className="h-3 w-3" />}
                                {user.role}
                            </span>
                            </td>
                            <td className="px-4 py-4">
                            <span
                                className={cn(
                                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                                user.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
                                )}
                            >
                                {user.status}
                            </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 text-right">
                            {user.status === "ACTIVE" ? (
                                <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setConfirmDialog({ open: true, user, action: "deactivate" })}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                <UserX className="h-4 w-4 mr-1" />
                                Deactivate
                                </Button>
                            ) : (
                                <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setConfirmDialog({ open: true, user, action: "activate" })}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activate
                                </Button>
                            )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
                </>
            )}
            </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                {confirmDialog.action === "activate" ? "Activate User" : "Deactivate User"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                Are you sure you want to {confirmDialog.action}{" "}
                {confirmDialog.user?.name || confirmDialog.user?.email}?
                {confirmDialog.action === "deactivate" && " They will no longer be able to access their account."}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleStatusChange}>
                {confirmDialog.action === "activate" ? "Activate" : "Deactivate"}
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </main>
    )
}
