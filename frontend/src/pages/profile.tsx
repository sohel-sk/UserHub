import { useState } from "react";
import { useAuth } from "../context/authContext";

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { toast } from "../hooks/use-toast"
import { Mail, Lock, Eye, EyeOff, User ,Save} from "lucide-react";
import api from "../services/api";


export default function ProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [loadingPassword, setLoadingPassword] = useState(false)


    


    const handleUpdateProfile = async (e: React.FormEvent) => { 
        e.preventDefault();
        setLoadingProfile(true);

        try {
            await api.patch("/user/profile", { name, email });
            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully."
            })
        } catch (error) {
            toast({
                title: "Update failed",
                description: error instanceof Error ? error.message : "Could not update profile",
                variant: "destructive",
            })
            
        } finally { 
            setLoadingProfile(false);
        }

    }
    const passwordRequirements = [
        { label: "At least 8 characters", met: newPassword.length >= 8 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(newPassword) },
        { label: "Contains number", met: /[0-9]/.test(newPassword) },
    ]

    const allRequirementsMet = passwordRequirements.every((req) => req.met)



    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPassword(true);

        try {
            if (!allRequirementsMet) { 
                toast({
                    title: "Weak password",
                    description: "Please meet all password requirements",
                    variant: "destructive",
                })
                return;
            }
            await api.patch("/user/profile/change-password", { currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            toast({
                title: "Password changed",
                description: "Your password has been updated successfully."
            });
        } catch (error) {
            toast({
                title: "Password change failed",
                description: error instanceof Error ? error.message : "Could not change password",
                variant: "destructive",
            });
            
        } finally { 
            setLoadingPassword(false);
        }

    }


    return (
        <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-teal-500/25">
                    <User className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gradient">Profile Settings</h1>
                    <p className="text-muted-foreground">Manage your account information</p>
                </div>
                </div>
            </div>

            <div className="space-y-6">
                <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your name and email address</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="fullName"
                            type="text"
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                        />
                        </div>
                    </div>
                    <Button type="submit" disabled={loadingProfile}>
                        {loadingProfile ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save Changes
                        </>
                        )}
                    </Button>
                    </form>
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        </div>
                    </div>
                    <Button type="submit" disabled={loadingPassword}>
                        {loadingPassword ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                        <>
                            <Lock className="h-4 w-4" />
                            Change Password
                        </>
                        )}
                    </Button>
                    </form>
                </CardContent>
                </Card>
            </div>
        </main>
    );
}


