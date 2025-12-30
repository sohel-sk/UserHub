export const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains number", met: /[0-9]/.test(password) },
    ]

