import {
    createClient,
    type SupabaseClient,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const missingConfigError = {
    message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
};

const missingClient = new Proxy(
    {},
    {
        get: (_target, property) => {
            if (property === "then") {
                return (
                    resolve: (value: {
                        data: null;
                        error: typeof missingConfigError;
                    }) => void
                ) => resolve({ data: null, error: missingConfigError });
            }

            return () => missingClient;
        },
    }
) as unknown as SupabaseClient;

export const supabase =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : missingClient;