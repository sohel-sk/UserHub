import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { toast } from "../hooks/use-toast"
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Shield, Check, X } from "lucide-react"
import { cn } from "../lib/utils"

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { signup } = useAuth();
    const navigate = useNavigate();


    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains number", met: /[0-9]/.test(password) },
    ]

    const allRequirementsMet = passwordRequirements.every((req) => req.met)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!allRequirementsMet) { 
            toast({
                title: "Weak password",
                description: "Please meet all password requirements",
                variant: "destructive",
            })
            return;
        }

        setLoading(true);
        try {
            await signup(name, email, password,)
            toast({ title: "Account created!", description: "Welcome to UserHub." })
            navigate("/dashboard")

        } catch (error) {
            toast({
                title: "Signup failed",
                description: error instanceof Error ? error.message : "Could not create account.",
                variant: "destructive",
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-float" />
            <div
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "-3s" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <Card className="w-full max-w-md relative">
            <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-teal-500/25">
                <Shield className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-3xl">Create Account</CardTitle>
            <CardDescription>Join UserHub to get started</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                    />
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    />
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {password && (
                    <div className="mt-3 space-y-2 p-3 rounded-lg bg-secondary/50">
                    {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                        {req.met ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={cn(req.met ? "text-emerald-600" : "text-muted-foreground")}>{req.label}</span>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading || !allRequirementsMet}>
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                    <UserPlus className="h-5 w-5" />
                    Create Account
                    </>
                )}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                    Sign in
                </Link>
                </p>
            </CardFooter>
            </form>
        </Card>
    </div>
    );
}