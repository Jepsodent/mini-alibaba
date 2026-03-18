

import z from "zod"

export const loginSchemaForm = z.object({
    email: z.string().email('Invalid email').min(1, 'Email required'),
    password: z.string().min(8, 'Minimum lenght of password is 8')
})

export const signUpSchemaForm = z.object({
    name: z.string().min(1, 'Name required'),
    email: z.string().email('Invalid email').min(1, 'Email required'),
    password: z.string().min(8, 'Minimum length of password is 8'),
    confirm_password: z.string().min(1, 'Confirm Password Required')
}).refine((data) => data.confirm_password === data.password, {
    message: "Password is not same",
    path: ['confirm_password']
})


export type Login = z.infer<typeof loginSchemaForm>
export type SignUp = z.infer<typeof signUpSchemaForm>