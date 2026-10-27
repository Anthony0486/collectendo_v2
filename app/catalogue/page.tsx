import Link from "next/link";
import { GameCard } from "@/components/cards/GameCard";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  type CatalogGame,
  fetchNintendoGames,
  isIGDBConfigured,
  NINTENDO_PLATFORMS,
} from "@/lib/igdb";

type CataloguePageProps = {
  searchParams: Promise<{
    platform?: string;
    q?: string;
    page?: string;
  }>;
};

function buildCatalogueHref(params: {
  platform?: number;
  q?: string;
  page?: number;
}) {
  const search = new URLSearchParams();
  if (params.platform) {
    search.set("platform", String(params.platform));
  }
  if (params.q?.trim()) {
    search.set("q", params.q.trim());
  }
  if (params.page && params.page > 1) {
    search.set("page", String(params.page));
  }
  const qs = search.toString();
  return qs ? `/catalogue?${qs}` : "/catalogue";
}

export default async function CataloguePage({
  searchParams,
}: CataloguePageProps) {
  const resolvedParams = await searchParams;
  const selectedPlatformId = resolvedParams.platform
    ? Number.parseInt(resolvedParams.platform, 10)
    : undefined;
  const searchQuery = resolvedParams.q?.trim() || "";
  const currentPage = Math.max(
    1,
    resolvedParams.page ? Number.parseInt(resolvedParams.page, 10) || 1 : 1
  );

  const configured = isIGDBConfigured();
  let games: CatalogGame[] = [];
  let hasMore = false;
  let errorMessage: string | null = null;

  if (configured) {
    try {
      const result = await fetchNintendoGames({
        platformId: selectedPlatformId,
        search: searchQuery,
        page: currentPage,
        pageSize: 24,
      });
      games = result.games;
      hasMore = result.hasMore;
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "Impossible de récupérer le catalogue depuis IGDB.";
    }
  }

  const activePlatform = NINTENDO_PLATFORMS.find(
    (p) => p.id === selectedPlatformId
  );

  return (
    <SiteLayout>
      <div className="space-y-8">
        <section className="overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-white via-[#f9f9f9] to-[#f5f5f5] p-6 md:p-8">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-[#e60012]/20 bg-[#e60012]/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#e60012]">
              Base de données IGDB
            </span>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Catalogue des jeux Nintendo
                </h1>
                <p className="max-w-2xl text-base text-slate-700">
                  Explore tous les jeux sortis sur les consoles Nintendo, de la
                  NES jusqu’à la Nintendo Switch 2.
                </p>
              </div>

              <form
                action="/catalogue"
                method="GET"
                className="flex w-full max-w-md items-center gap-2"
              >
                {selectedPlatformId ? (
                  <input
                    type="hidden"
                    name="platform"
                    value={selectedPlatformId}
                  />
                ) : null}
                <input
                  type="search"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Rechercher un jeu (ex: Zelda, Mario, Metroid...)"
                  className="w-full rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#e60012] focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-[#e60012] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c70010]"
                >
                  Rechercher
                </button>
              </form>
            </div>

            <div className="pt-2">
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildCatalogueHref({ q: searchQuery })}
                  className={[
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                    !activePlatform
                      ? "bg-[#e60012] text-white shadow-sm"
                      : "border border-red-100 bg-white text-slate-700 hover:border-[#e60012]/40 hover:text-[#e60012]",
                  ].join(" ")}
                >
                  Toutes les consoles
                </Link>
                {NINTENDO_PLATFORMS.map((platform) => {
                  const isActive = activePlatform?.id === platform.id;
                  return (
                    <Link
                      key={platform.id}
                      href={buildCatalogueHref({
                        platform: platform.id,
                        q: searchQuery,
                      })}
                      className={[
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                        isActive
                          ? "bg-[#e60012] text-white shadow-sm"
                          : "border border-red-100 bg-white text-slate-700 hover:border-[#e60012]/40 hover:text-[#e60012]",
                      ].join(" ")}
                    >
                      {platform.shortName}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {!configured ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <h2 className="text-lg font-bold">
              Configuration de l’API IGDB (Twitch) requise
            </h2>
            <p className="mt-2 text-sm text-amber-900">
              Pour afficher les jeux depuis l’API IGDB, ajoute tes identifiants
              Twitch dans un fichier{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
                .env.local
              </code>{" "}
              :
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
              {`TWITCH_CLIENT_ID=ton_client_id_twitch\nTWITCH_CLIENT_SECRET=ton_client_secret_twitch`}
            </pre>
          </section>
        ) : errorMessage ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
            <h2 className="text-lg font-bold">Erreur lors du chargement</h2>
            <p className="mt-2 text-sm">{errorMessage}</p>
          </section>
        ) : games.length === 0 ? (
          <section className="rounded-2xl border border-red-100 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">
              Aucun jeu trouvé
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Essaie de modifier ta recherche ou de sélectionner une autre
              console Nintendo.
            </p>
            {(searchQuery || selectedPlatformId) && (
              <Link
                href="/catalogue"
                className="mt-4 inline-flex rounded-full bg-[#e60012] px-4 py-2 text-xs font-semibold text-white hover:bg-[#c70010]"
              >
                Réinitialiser les filtres
              </Link>
            )}
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {activePlatform
                  ? `Jeux sur ${activePlatform.name}`
                  : "Tous les jeux Nintendo"}
                {searchQuery ? ` — « ${searchQuery} »` : ""}
              </h2>
              <span className="text-xs font-medium text-slate-500">
                Page {currentPage}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  title={game.title}
                  platform={game.platform}
                  releaseDate={game.releaseDate}
                  cover={game.cover}
                  tag={game.tag}
                />
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-red-100 pt-4">
              {currentPage > 1 ? (
                <Link
                  href={buildCatalogueHref({
                    platform: selectedPlatformId,
                    q: searchQuery,
                    page: currentPage - 1,
                  })}
                  className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[#e60012]/40 hover:text-[#e60012]"
                >
                  ← Page précédente
                </Link>
              ) : (
                <span />
              )}

              {hasMore ? (
                <Link
                  href={buildCatalogueHref({
                    platform: selectedPlatformId,
                    q: searchQuery,
                    page: currentPage + 1,
                  })}
                  className="rounded-full bg-[#e60012] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c70010]"
                >
                  Page suivante →
                </Link>
              ) : null}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

