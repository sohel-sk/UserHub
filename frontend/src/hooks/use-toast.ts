"use client"

import { useState, useCallback } from "react"

interface Toast {
    id: string
    title?: string
    description?: string
    variant?: "default" | "destructive"
}

interface ToastState {
    toasts: Toast[]
    toast: (toast: Omit<Toast, "id">) => void
    dismiss: (id: string) => void
}

let toastCount = 0

const listeners: Array<(state: Toast[]) => void> = []
let memoryState: Toast[] = []

function dispatch(toasts: Toast[]) {
    memoryState = toasts
    listeners.forEach((listener) => listener(toasts))
}

export function toast(props: Omit<Toast, "id">) {
    const id = String(toastCount++)
    const newToast = { ...props, id }
    dispatch([...memoryState, newToast])

    setTimeout(() => {
        dispatch(memoryState.filter((t) => t.id !== id))
    }, 5000)

    return id
}

export function useToast(): ToastState {
    const [toasts, setToasts] = useState<Toast[]>(memoryState)

    useState(() => {
        listeners.push(setToasts)
        return () => {
        const index = listeners.indexOf(setToasts)
        if (index > -1) listeners.splice(index, 1)
        }
    })

    const dismiss = useCallback((id: string) => {
        dispatch(memoryState.filter((t) => t.id !== id))
    }, [])

    return {
        toasts,
        toast,
        dismiss,
    }
}
