import { useAuth } from "../context/authContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { LayoutDashboard, User, Shield, Activity } from "lucide-react"

export default function DashboardPage() {
    const { user } = useAuth()

    const stats = [
        {
        title: "Account Status",
        value: user?.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
        description: "Your current account status",
        icon: Activity,
        color: user?.status === "ACTIVE" ? "text-emerald-500" : "text-red-500",
        },
        {
        title: "Role",
        value: user?.role === "ADMIN" ? "Administrator" : "User",
        description: "Your access level",
        icon: Shield,
        color: "text-primary",
        },
    ]

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-teal-500/25">
                <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name || "User"}</p>
            </div>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {stats.map((stat, index) => (
            <Card key={index} className="hover:-translate-y-1 transition-transform duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <CardDescription>{stat.description}</CardDescription>
                </CardContent>
            </Card>
            ))}

            <Card className="hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Profile</CardTitle>
                <User className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gradient truncate">{user?.email}</div>
                <CardDescription>Your registered email</CardDescription>
            </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
            <CardDescription>Your account information at a glance</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium">{user?.name || "Not set"}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                <p className="font-medium">{user?.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="font-medium">{user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}</p>
                </div>
            </div>
            </CardContent>
        </Card>
        </main>
    )
}
