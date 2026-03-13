"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    const cookiesStore = await cookies();
    const supabase = await createClient();
    try {
        await supabase.auth.signOut();
        cookiesStore.delete("user");
        revalidatePath("/", "layout")
        return {
            status: "success",
            message: "Logout successfully"
        }
    } catch (error) {
        console.log("Error signing out", error)
        return {
            status: "error",
            message: "Error signing out"
        }
    }
}