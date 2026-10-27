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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white ring-1 ring-white/30">
            C
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">Collectendo</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-red-50/90 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/catalogue"
                className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#e60012] transition hover:bg-red-50 sm:inline-flex"
              >
                + Ajouter
              </Link>
              <div
                className="flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1.5 pr-3 text-sm font-medium text-white ring-1 ring-white/25"
                title={username}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-[#e60012]">
                  {userInitial}
                </span>
                {username ? (
                  <span className="hidden max-w-[120px] truncate sm:inline">
                    {username}
                  </span>
                ) : null}
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/20"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/connexion"
                className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20 sm:inline-flex"
              >
                Se connecter
              </Link>
              <Link
                href="/inscription"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#e60012] transition hover:bg-red-50"
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