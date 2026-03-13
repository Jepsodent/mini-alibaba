"use server"
// TODO NYA ADALAH BIKIN ACTION .TS DAN SETUP COOKIE + USER SESSION DI SUPABASE 

import { createClient } from "@/lib/supabase/server";
import { loginSchemaForm } from "@/validation/auth-validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function loginPassword(prevState: AuthFormState, formData: FormData) {
    const validateFields = loginSchemaForm.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })

    if (!validateFields.success) {
        return {
            status: 'error',
            errors: {
                ...validateFields.error.flatten().fieldErrors,
                _form: []
            }
        }
    }
    console.log(validateFields.data)

    const supabase = await createClient()
    const { error, data: { user } } = await supabase.auth.signInWithPassword(validateFields.data)

    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState,
                _form: [error.message]
            }
        }
    }
    if (user) {
        const cookieStore = await cookies();
        cookieStore.set('user', JSON.stringify(user), {
            httpOnly: true,
            path: '/',
            secure: true,
            maxAge: 24 * 60 * 60
        })
    }
    redirect('/dashboard')
}