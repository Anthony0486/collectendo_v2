import Link from "next/link";
import { GameCard } from "@/components/cards/GameCard";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  type CatalogGame,
  fetchNintendoGames,
  fetchUpcomingNintendoGames,
  isIGDBConfigured,
} from "@/lib/igdb";
import { getCurrentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  const isAuthenticated = Boolean(user);

  let recentGames: CatalogGame[] = [];
  let upcomingGames: CatalogGame[] = [];

  if (isIGDBConfigured()) {
    try {
      const [recentResult, upcomingResult] = await Promise.all([
        fetchNintendoGames({ pageSize: 3 }),
        fetchUpcomingNintendoGames(3),
      ]);
      recentGames = recentResult.games;
      upcomingGames = upcomingResult;
    } catch {
      recentGames = [];
      upcomingGames = [];
    }
  }

  const highlightedGames = (
    isAuthenticated && upcomingGames.length > 0 ? upcomingGames : recentGames
  ).slice(0, 2);

  return (
    <SiteLayout isAuthenticated={isAuthenticated} username={user?.username}>
      <div className="space-y-8">
        <section className="overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-white via-[#f9f9f9] to-[#f5f5f5] p-6 md:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-[#e60012]/20 bg-[#e60012]/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#e60012]">
                {isAuthenticated ? `Espace de ${user?.username}` : "Collecte Nintendo"}
              </span>

              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  {isAuthenticated
                    ? "Reprends ta collection là où tu l’avais laissée."
                    : "Gère ta collection Nintendo comme un pro."}
                </h1>
                <p className="max-w-xl text-lg leading-8 text-slate-700">
                  {isAuthenticated
                    ? "Retrouve tes jeux, mets à jour tes acquisitions et garde un œil sur les sorties à venir."
                    : "Suis tes jeux, découvre les sorties récentes et anticipe les prochaines sorties de la Nintendoverse."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={isAuthenticated ? "/catalogue" : "/inscription"}
                  className="rounded-full bg-[#e60012] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:bg-[#c70010]"
                >
                  {isAuthenticated ? "Ajouter un jeu" : "Rejoindre la communauté"}
                </Link>
                <Link
                  href="/catalogue"
                  className="rounded-full border border-red-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 hover:border-[#e60012]/40 hover:text-[#e60012]"
                >
                  {isAuthenticated ? "Parcourir le catalogue" : "Voir le catalogue"}
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#e60012]">
                {isAuthenticated ? "Prochaines sorties" : "À l’affiche"}
              </p>

              {highlightedGames.length > 0 ? (
                <div className="space-y-4">
                  {highlightedGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex gap-3 rounded-xl border border-red-100 bg-[#f5f5f5] p-2"
                    >
                      {game.cover ? (
                        <img
                          src={game.cover}
                          alt={game.title}
                          className="h-20 w-16 rounded-lg object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {game.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          {game.platform}
                        </p>
                        <p className="mt-1 text-xs text-[#e60012]">
                          Sortie : {game.releaseDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-slate-500">
                  Aucun jeu à afficher pour le moment.
                </p>
              )}
            </div>
          </div>
        </section>

        {recentGames.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Dernières sorties Nintendo
              </h2>
              <Link
                href="/catalogue"
                className="text-sm text-[#e60012] hover:text-[#c70010]"
              >
                Voir le catalogue →
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recentGames.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>
          </section>
        ) : null}

        {upcomingGames.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Prochaines sorties
              </h2>
              <Link
                href="/catalogue"
                className="text-sm text-[#e60012] hover:text-[#c70010]"
              >
                Explorer →
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {upcomingGames.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SiteLayout>
  );
}
