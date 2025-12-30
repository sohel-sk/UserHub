export interface User {
    id: string
    email: string
    name: string
    role: "USER" | "ADMIN"
    status: "ACTIVE" | "INACTIVE"
    createdAt: string
    updatedAt: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}