const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

export type NowPlaying = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  previewUrl?: string | null;
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

  return {
    isPlaying: true,
    title: song.item.name,
    artist: song.item.artists.map((a: { name: string }) => a.name).join(', '),
    album: song.item.album?.name,
    albumImageUrl: song.item.album?.images?.[0]?.url,
    songUrl: song.item.external_urls?.spotify,
    previewUrl: song.item.preview_url ?? null,
  };
}
