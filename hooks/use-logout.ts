"use client"
import { logout } from "@/action/auth-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";






export function useLogout() {
    const router = useRouter()
    const handleLogout = async () => {
        const { status, message } = await logout()
        if (status === "success") {
            toast.success(message);
            router.push("/");
        } else {
            toast.error("Logout Failed", { description: message });
        }
    }


    return handleLogout

}