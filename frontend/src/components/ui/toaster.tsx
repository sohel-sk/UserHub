"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-xl border border-white/20 bg-white/90 backdrop-blur-xl px-4 py-3 shadow-xl shadow-black/10 animate-in slide-in-from-right-full",
            toast.variant === "destructive" && "border-red-200 bg-red-50/90",
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <p
                className={cn(
                  "text-sm font-medium",
                  toast.variant === "destructive" ? "text-red-800" : "text-foreground",
                )}
              >
                {toast.title}
              </p>
            )}
            {toast.description && (
              <p className={cn("text-sm", toast.variant === "destructive" ? "text-red-600" : "text-muted-foreground")}>
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
