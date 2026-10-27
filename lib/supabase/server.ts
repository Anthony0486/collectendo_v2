import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    throw new Error(
      "Les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont manquantes dans .env.local."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Appelé depuis un Server Component : la mise à jour des cookies est gérée par proxy.ts
        }
      },
    },
  });
}

export type CurrentUserProfile = {
  id: string;
  email: string;
  username: string;
};

export async function getCurrentUser(): Promise<CurrentUserProfile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const metadataUsername =
      typeof user.user_metadata?.username === "string"
        ? user.user_metadata.username
        : typeof user.user_metadata?.display_name === "string"
          ? user.user_metadata.display_name
          : user.email?.split("@")[0] || "Joueur";

    return {
      id: user.id,
      email: user.email || "",
      username: metadataUsername,
    };
  } catch {
    return null;
  }
}

