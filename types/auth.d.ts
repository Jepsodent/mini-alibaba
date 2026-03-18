


type User = {
    id?: string
    email: string,
}
type AuthFormState = {
    status: string,
    errors?: {
        name?: string[],
        email?: string[],
        password?: string[],
        confirm_password?: string[],
        avatar_url?: string[],
        _form?: string[]
    }
}