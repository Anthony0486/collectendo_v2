"use client";

import Link from "next/link";
import { useActionState } from "react";
import { type AuthActionState, signUpAction } from "@/app/auth/actions";

const initialState: AuthActionState = {};

export function RegisterForm({ isConfigured }: { isConfigured: boolean }) {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2 text-center">
        <span className="inline-flex rounded-full border border-[#e60012]/20 bg-[#e60012]/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#e60012]">
          Rejoindre Collectendo
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Créer un compte
        </h1>
        <p className="text-sm text-slate-600">
          Crée ton profil pour gérer ta collection de jeux et consoles Nintendo.
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
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            dans ton fichier{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">
              .env.local
            </code>{" "}
            pour activer l’inscription.
          </p>
        </div>
      ) : null}

      {state.error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          <p className="font-semibold">{state.success}</p>
          <Link
            href="/connexion"
            className="inline-flex rounded-full bg-[#e60012] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#c70010]"
          >
            Aller à la page de connexion
          </Link>
        </div>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-slate-800"
            >
              Pseudo
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              minLength={3}
              placeholder="Ex: LinkDu64"
              className="w-full rounded-xl border border-red-200 bg-[#f9f9f9] px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#e60012] focus:bg-white focus:outline-none"
            />
          </div>

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
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-800"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Au moins 6 caractères"
              className="w-full rounded-xl border border-red-200 bg-[#f9f9f9] px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#e60012] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-slate-800"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="Répète ton mot de passe"
              className="w-full rounded-xl border border-red-200 bg-[#f9f9f9] px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#e60012] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-full bg-[#e60012] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-[#c70010] disabled:opacity-60"
          >
            {isPending ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-600">
        Tu as déjà un compte ?{" "}
        <Link
          href="/connexion"
          className="font-semibold text-[#e60012] hover:text-[#c70010]"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

