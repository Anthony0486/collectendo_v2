import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";

type NavbarProps = {
  isAuthenticated?: boolean;
  username?: string;
};

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalogue" },
];

export function Navbar({ isAuthenticated = false, username }: NavbarProps) {
  const userInitial = (username?.trim()?.[0] || "A").toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-red-700/40 bg-[#e60012] text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white ring-1 ring-white/30 sm:h-10 sm:w-10">
              C
            </div>
            <p className="text-base font-semibold tracking-tight text-white sm:text-lg">
              Collectendo
            </p>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-medium text-red-50/90 transition hover:text-white sm:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/catalogue"
                className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#e60012] transition hover:bg-red-50 md:inline-flex"
              >
                + Ajouter
              </Link>
              <div
                className="flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-sm font-medium text-white ring-1 ring-white/25 sm:pr-3"
                title={username}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-[#e60012]">
                  {userInitial}
                </span>
                {username ? (
                  <span className="max-w-[90px] truncate text-xs sm:max-w-[120px] sm:text-sm">
                    {username}
                  </span>
                ) : null}
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20 sm:py-2"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20 sm:py-2 sm:text-sm"
              >
                Se connecter
              </Link>
              <Link
                href="/inscription"
                className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#e60012] transition hover:bg-red-50 sm:px-4 sm:py-2 sm:text-sm"
              >
                S’inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
