"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: "user" | "admin"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

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

  if (requiredRole === "admin" && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
