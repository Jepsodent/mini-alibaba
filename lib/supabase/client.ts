
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
// console.log(supabaseKey, supabaseUrl)
export const createClient = () =>
    createBrowserClient(
        supabaseUrl!,
        supabaseKey!,
    );
