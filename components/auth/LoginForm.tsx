"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { type AuthActionState, signInAction } from "@/app/auth/actions";

const initialState: AuthActionState = {};

export function LoginForm({ isConfigured }: { isConfigured: boolean }) {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2 text-center">
        <span className="inline-flex rounded-full border border-[#e60012]/20 bg-[#e60012]/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#e60012]">
          Espace Membre
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Se connecter
        </h1>
        <p className="text-sm text-slate-600">
          Accède à ta collection Nintendo et suis tes prochaines acquisitions.
        </p>
      </div>

      {!isConfigured ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
          <p className="font-semibold">Configuration Supabase requise</p>
          <p className="mt-1 text-amber-900">
            Ajoute{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            et{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
            </code>{" "}
            dans tes variables d’environnement pour activer la connexion.
          </p>
        </div>
      ) : null}

      {state.error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.error}
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-800"
          >
            Adresse e-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="email"
            placeholder="ton.email@exemple.fr"
            className="w-full rounded-xl border border-red-200 bg-[#f9f9f9] px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#e60012] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-800"
            >
              Mot de passe
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-xs font-medium text-[#e60012] hover:text-[#c70010]"
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="current-password"
            placeholder="Ton mot de passe"
            className="w-full rounded-xl border border-red-200 bg-[#f9f9f9] px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#e60012] focus:bg-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full rounded-full bg-[#e60012] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-[#c70010] disabled:opacity-60"
        >
          {isPending ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="font-semibold text-[#e60012] hover:text-[#c70010]"
        >
          S’inscrire
        </Link>
      </p>
    </div>
  );
}
