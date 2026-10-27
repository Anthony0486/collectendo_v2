export type NintendoPlatform = {
  id: number;
  name: string;
  shortName: string;
};

export const NINTENDO_PLATFORMS: NintendoPlatform[] = [
  { id: 508, name: "Nintendo Switch 2", shortName: "Switch 2" },
  { id: 130, name: "Nintendo Switch", shortName: "Switch" },
  { id: 41, name: "Wii U", shortName: "Wii U" },
  { id: 37, name: "Nintendo 3DS", shortName: "3DS" },
  { id: 137, name: "New Nintendo 3DS", shortName: "New 3DS" },
  { id: 5, name: "Wii", shortName: "Wii" },
  { id: 20, name: "Nintendo DS", shortName: "DS" },
  { id: 159, name: "Nintendo DSi", shortName: "DSi" },
  { id: 21, name: "Nintendo GameCube", shortName: "GameCube" },
  { id: 24, name: "Game Boy Advance", shortName: "GBA" },
  { id: 4, name: "Nintendo 64", shortName: "N64" },
  { id: 22, name: "Game Boy Color", shortName: "GBC" },
  { id: 33, name: "Game Boy", shortName: "Game Boy" },
  { id: 87, name: "Virtual Boy", shortName: "Virtual Boy" },
  { id: 19, name: "Super Nintendo Entertainment System", shortName: "SNES" },
  { id: 18, name: "Nintendo Entertainment System", shortName: "NES" },
];

const NINTENDO_PLATFORM_IDS = new Set(NINTENDO_PLATFORMS.map((p) => p.id));

export type CatalogGame = {
  id: number;
  title: string;
  platform: string;
  releaseDate: string;
  cover: string;
  tag?: string;
};

type IGDBGameResponse = {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: {
    id: number;
    image_id: string;
  };
  platforms?: Array<{
    id: number;
    name: string;
    abbreviation?: string;
  }>;
};

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

function getCredentials() {
  const clientId = process.env.TWITCH_CLIENT_ID || process.env.IGDB_CLIENT_ID;
  const clientSecret =
    process.env.TWITCH_CLIENT_SECRET || process.env.IGDB_CLIENT_SECRET;

  return { clientId, clientSecret };
}

export function isIGDBConfigured(): boolean {
  const { clientId, clientSecret } = getCredentials();
  return Boolean(clientId && clientSecret);
}

async function getTwitchAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.accessToken;
  }

  const { clientId, clientSecret } = getCredentials();
  if (!clientId || !clientSecret) {
    throw new Error(
      "Les identifiants Twitch/IGDB (TWITCH_CLIENT_ID et TWITCH_CLIENT_SECRET) sont manquants."
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?${params.toString()}`,
    {
      method: "POST",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur d'authentification Twitch OAuth (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return cachedToken.accessToken;
}

function formatReleaseDate(unixTimestamp?: number): string {
  if (!unixTimestamp) {
    return "Date inconnue";
  }
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(unixTimestamp * 1000));
}

function formatNintendoPlatform(
  platforms?: IGDBGameResponse["platforms"],
  selectedPlatformId?: number
): string {
  if (!platforms || platforms.length === 0) {
    return "Nintendo";
  }

  if (selectedPlatformId) {
    const matched = NINTENDO_PLATFORMS.find((p) => p.id === selectedPlatformId);
    if (matched) {
      return matched.name;
    }
  }

  const nintendoOnly = platforms.filter((p) => NINTENDO_PLATFORM_IDS.has(p.id));
  if (nintendoOnly.length === 0) {
    return platforms[0].name;
  }

  const primary = NINTENDO_PLATFORMS.find((np) =>
    nintendoOnly.some((p) => p.id === np.id)
  );
  const label = primary ? primary.name : nintendoOnly[0].name;

  if (nintendoOnly.length > 1) {
    return `${label} +${nintendoOnly.length - 1}`;
  }

  return label;
}

export type FetchNintendoGamesOptions = {
  platformId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchNintendoGames({
  platformId,
  search,
  page = 1,
  pageSize = 24,
}: FetchNintendoGamesOptions = {}): Promise<{
  games: CatalogGame[];
  hasMore: boolean;
}> {
  const { clientId } = getCredentials();
  const accessToken = await getTwitchAccessToken();

  const validPlatformId =
    platformId && NINTENDO_PLATFORM_IDS.has(platformId)
      ? platformId
      : undefined;

  const platformFilter = validPlatformId
    ? `platforms = (${validPlatformId})`
    : `platforms = (${Array.from(NINTENDO_PLATFORM_IDS).join(",")})`;

  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;
  const limit = pageSize + 1; // +1 to detect if there is a next page

  const nowSeconds = Math.floor(Date.now() / 1000);
  const sanitizedSearch = search?.trim().replace(/"/g, '\\"');

  const whereClauses = [
    platformFilter,
    "cover != null",
    "first_release_date != null",
    `first_release_date <= ${nowSeconds}`,
  ];

  if (sanitizedSearch) {
    whereClauses.push(`name ~ *"${sanitizedSearch}"*`);
  }

  const query = [
    "fields id, name, first_release_date, cover.image_id, platforms.id, platforms.name, platforms.abbreviation;",
    `where ${whereClauses.join(" & ")};`,
    "sort first_release_date desc;",
    `limit ${limit};`,
    `offset ${offset};`,
  ].join("\n");

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId!,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "text/plain",
    },
    body: query,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur API IGDB (${response.status}): ${errorText}`);
  }

  const rawGames = (await response.json()) as IGDBGameResponse[];
  const hasMore = rawGames.length > pageSize;
  const slice = rawGames.slice(0, pageSize);

  const thirtyDaysAgo = nowSeconds - 30 * 24 * 60 * 60;

  const games: CatalogGame[] = slice.map((game) => {
    const coverUrl = game.cover?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : "";

    const isRecent =
      game.first_release_date && game.first_release_date >= thirtyDaysAgo;

    return {
      id: game.id,
      title: game.name,
      platform: formatNintendoPlatform(game.platforms, validPlatformId),
      releaseDate: formatReleaseDate(game.first_release_date),
      cover: coverUrl,
      tag: isRecent ? "Nouveau" : undefined,
    };
  });

  return { games, hasMore };
}

export async function fetchUpcomingNintendoGames(
  pageSize = 3
): Promise<CatalogGame[]> {
  const { clientId } = getCredentials();
  const accessToken = await getTwitchAccessToken();

  const platformFilter = `platforms = (${Array.from(NINTENDO_PLATFORM_IDS).join(",")})`;
  const nowSeconds = Math.floor(Date.now() / 1000);

  const query = [
    "fields id, name, first_release_date, cover.image_id, platforms.id, platforms.name, platforms.abbreviation;",
    `where ${platformFilter} & cover != null & first_release_date > ${nowSeconds};`,
    "sort first_release_date asc;",
    `limit ${pageSize};`,
  ].join("\n");

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId!,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "text/plain",
    },
    body: query,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return [];
  }

  const rawGames = (await response.json()) as IGDBGameResponse[];

  return rawGames.map((game) => ({
    id: game.id,
    title: game.name,
    platform: formatNintendoPlatform(game.platforms),
    releaseDate: formatReleaseDate(game.first_release_date),
    cover: game.cover?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : "",
    tag: "À venir",
  }));
}
