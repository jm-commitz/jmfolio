const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing';
const ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/artists';
const AUDIO_FEATURES_ENDPOINT = 'https://api.spotify.com/v1/audio-features';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

/** Which hero avatar GIF the current track should show. */
export type AvatarMood = 'party' | 'rock' | 'normal';

export type NowPlaying = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  previewUrl?: string | null;
  mood?: AvatarMood;
};

async function getAccessToken(): Promise<string | null> {
  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

// Spotify has no genre field on a track — genres live on the artist. Tune the
// buckets by editing these lists; matching is substring-based and lowercased.
export const ROCK_GENRES = [
  'rock',
  'metal',
  'punk',
  'grunge',
  'emo',
  'hardcore',
  'shoegaze',
  'thrash',
  'screamo',
];

export const PARTY_GENRES = [
  'edm',
  'house',
  'techno',
  'trance',
  'dubstep',
  'electro',
  'disco',
  'club',
  'rave',
  'remix',
  'reggaeton',
  'hyperpop',
  'drum and bass',
  'hip hop',
  'rap',
  'trap',
  'dance',
  'k-pop',
];

type AudioFeatures = { energy: number; danceability: number };

// Warm serverless instances re-poll the same song every 30s — cache so that
// costs no extra Spotify requests.
const genreCache = new Map<string, string[]>();
const featureCache = new Map<string, AudioFeatures | null>();

/** Union of genres across all of the track's artists. One batched request. */
async function getArtistGenres(
  artistIds: string[],
  accessToken: string
): Promise<string[]> {
  const ids = artistIds.filter(Boolean);
  if (!ids.length) return [];

  const missing = ids.filter((id) => !genreCache.has(id));
  if (missing.length) {
    const res = await fetch(`${ARTISTS_ENDPOINT}?ids=${missing.join(',')}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      for (const artist of data.artists ?? []) {
        if (!artist?.id) continue;
        genreCache.set(
          artist.id,
          (artist.genres ?? []).map((g: string) => g.toLowerCase())
        );
      }
    }
    // Cache the miss too, so a permanently genre-less artist isn't refetched.
    for (const id of missing) if (!genreCache.has(id)) genreCache.set(id, []);
  }

  return [...new Set(ids.flatMap((id) => genreCache.get(id) ?? []))];
}

/**
 * Energy/danceability for the track, or null if unavailable. A 403 here is
 * expected and harmless: Spotify deprecated this endpoint for apps created
 * after 2024-11-27, so classification must stand on genres alone.
 */
async function getAudioFeatures(
  trackId: string,
  accessToken: string
): Promise<AudioFeatures | null> {
  if (!trackId) return null;
  if (featureCache.has(trackId)) return featureCache.get(trackId) ?? null;

  const res = await fetch(`${AUDIO_FEATURES_ENDPOINT}/${trackId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  let features: AudioFeatures | null = null;
  if (res.ok) {
    const data = await res.json();
    if (typeof data?.energy === 'number' && typeof data?.danceability === 'number') {
      features = { energy: data.energy, danceability: data.danceability };
    }
  }
  featureCache.set(trackId, features);
  return features;
}

export function classifyMood(
  genres: string[],
  features: AudioFeatures | null,
  title = ''
): AvatarMood {
  const score = (keywords: string[]) =>
    genres.filter((g) => keywords.some((k) => g.includes(k))).length;

  const rockScore = score(ROCK_GENRES);
  const partyScore = score(PARTY_GENRES);

  if (features) {
    const { energy, danceability } = features;
    if (energy >= 0.7 && danceability >= 0.65) return 'party';
    if (energy >= 0.7 && rockScore > 0) return 'rock';
    // Genres are artist-level, so a mellow track by a loud band reads rock
    // without this escape hatch.
    if (energy < 0.4 && danceability < 0.5) return 'normal';
  }

  // Ties favour rock, so "dance rock" lands on the band GIF.
  if (rockScore > 0 && rockScore >= partyScore) return 'rock';
  if (partyScore > 0) return 'party';
  if (/remix|club mix/i.test(title)) return 'party';
  return 'normal';
}

/** Genres + audio features for a track, tolerant of either call failing. */
export async function getTrackMood(
  trackId: string,
  artistIds: string[],
  title: string,
  accessToken: string
): Promise<{ mood: AvatarMood; genres: string[]; features: AudioFeatures | null }> {
  const [genres, features] = await Promise.all([
    getArtistGenres(artistIds, accessToken).catch(() => [] as string[]),
    getAudioFeatures(trackId, accessToken).catch(() => null),
  ]);
  return { mood: classifyMood(genres, features, title), genres, features };
}

export async function getNowPlaying(): Promise<NowPlaying> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { isPlaying: false };

  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  // 204 = nothing playing; anything else non-200 = treat as not playing.
  if (res.status !== 200) return { isPlaying: false };

  const song = await res.json();
  if (!song || !song.item || !song.is_playing) return { isPlaying: false };

  const { mood } = await getTrackMood(
    song.item.id,
    (song.item.artists ?? []).map((a: { id: string }) => a.id),
    song.item.name ?? '',
    accessToken
  ).catch(() => ({ mood: 'normal' as AvatarMood }));

  return {
    isPlaying: true,
    mood,
    title: song.item.name,
    artist: song.item.artists.map((a: { name: string }) => a.name).join(', '),
    album: song.item.album?.name,
    albumImageUrl: song.item.album?.images?.[0]?.url,
    songUrl: song.item.external_urls?.spotify,
    previewUrl: song.item.preview_url ?? null,
  };
}
