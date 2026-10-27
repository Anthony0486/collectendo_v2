import Link from "next/link";

type SidebarProps = {
  isAuthenticated?: boolean;
};

const menuItems = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalogue" },
];

export function Sidebar({ isAuthenticated = false }: SidebarProps) {

  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="rounded-2xl border border-red-200 bg-[#f5f5f5] p-4 shadow-sm">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#e60012]">
          {isAuthenticated ? "Mon espace" : "Explorer"}
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-white hover:text-[#e60012]"
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6 rounded-xl border border-red-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#e60012]">
            {isAuthenticated ? "Astuce" : "Découvrir"}
          </p>
          <p className="mt-3 text-sm text-slate-700">
            {isAuthenticated
              ? "Parcours le catalogue pour retrouver tous les jeux sortis sur consoles Nintendo."
              : "Crée un compte pour gérer ta collection et suivre les sorties Nintendo."}
          </p>
        </div>
      </div>
    </aside>
  );
}
