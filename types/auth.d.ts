


type User = {
    id?: string
    name: string,
    email: string,
    avatar_url: string

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