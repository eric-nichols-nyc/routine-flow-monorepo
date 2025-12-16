export type AuthState = {
    error?: string
    fieldErrors?: {
        email?: string[]
        password?: string[]
    }
}
