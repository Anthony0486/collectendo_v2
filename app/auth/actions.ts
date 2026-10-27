"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase n'est pas encore configuré. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local.",
    };
  }

  const username = String(formData.get("username") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (username.length < 3) {
    return {
      error: "Le pseudo doit contenir au moins 3 caractères.",
    };
  }

  if (!email || !email.includes("@")) {
    return {
      error: "Veuillez saisir une adresse e-mail valide.",
    };
  }

  if (password.length < 6) {
    return {
      error: "Le mot de passe doit contenir au moins 6 caractères.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Les mots de passe ne correspondent pas.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();

  if (existingProfile) {
    return {
      error: "Ce pseudo est déjà utilisé par un autre membre.",
    };
  }

  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    (headersList.get("host") ? `https://${headersList.get("host")}` : "");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
      data: {
        username,
        display_name: username,
      },
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  return {
    success:
      "Ton compte a bien été créé ! Vérifie ta boîte mail pour confirmer ton adresse et te connecter.",
  };
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase n'est pas encore configuré. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local.",
    };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return {
      error: "Veuillez renseigner votre e-mail et votre mot de passe.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error:
          "Ton adresse e-mail n'a pas encore été confirmée. Vérifie ta boîte mail.",
      };
    }
    return {
      error: `Identifiants incorrects (${error.message}). Vérifie ton adresse e-mail et ton mot de passe.`,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/");
}

