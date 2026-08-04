import { NextResponse } from 'next/server';
import { classifyMood } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

// TEMPORARY diagnostic — reports whether Spotify env vars are present and whether
// the refresh-token exchange works. Exposes NO secret values (only lengths/flags).
// Also reports how the playing track was classified into an avatar mood.
export async function GET() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;

  const present = {
    clientId: !!id,
    clientSecret: !!secret,
    refreshToken: !!refresh,
    clientIdLen: id?.length ?? 0,
    refreshLen: refresh?.length ?? 0,
  };

  let tokenOk = false;
  let tokenError: string | null = null;
  let accessToken: string | null = null;

  try {
    if (id && secret && refresh) {
      const basic = Buffer.from(`${id}:${secret}`).toString('base64');
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh,
        }),
        cache: 'no-store',
      });
      tokenOk = res.ok;
      if (res.ok) accessToken = (await res.json()).access_token ?? null;
      else tokenError = (await res.text()).slice(0, 300);
    }
  } catch (e) {
    tokenError = String(e).slice(0, 300);
  }

  // Mood diagnostics — raw genre list and the audio-features HTTP status, so a
  // wrong GIF can be traced to empty genres vs. a 403 vs. bad thresholds.
  const mood: Record<string, unknown> = { playing: false };

  try {
    if (accessToken) {
      const auth = { Authorization: `Bearer ${accessToken}` };
      const res = await fetch(
        'https://api.spotify.com/v1/me/player/currently-playing',
        { headers: auth, cache: 'no-store' }
      );

      if (res.status === 200) {
        const song = await res.json();
        if (song?.item && song.is_playing) {
          const title: string = song.item.name ?? '';
          const artistIds: string[] = (song.item.artists ?? [])
            .map((a: { id: string }) => a.id)
            .filter(Boolean);

          const [artistsRes, featuresRes] = await Promise.all([
            fetch(`https://api.spotify.com/v1/artists?ids=${artistIds.join(',')}`, {
              headers: auth,
              cache: 'no-store',
            }),
            fetch(`https://api.spotify.com/v1/audio-features/${song.item.id}`, {
              headers: auth,
              cache: 'no-store',
            }),
          ]);

          let genres: string[] = [];
          if (artistsRes.ok) {
            const data = await artistsRes.json();
            genres = [
              ...new Set(
                (data.artists ?? []).flatMap((a: { genres?: string[] }) =>
                  (a.genres ?? []).map((g) => g.toLowerCase())
                )
              ),
            ] as string[];
          }

          let features: { energy: number; danceability: number } | null = null;
          if (featuresRes.ok) {
            const data = await featuresRes.json();
            if (typeof data?.energy === 'number') {
              features = { energy: data.energy, danceability: data.danceability };
            }
          }

          mood.playing = true;
          mood.title = title;
          mood.genres = genres;
          mood.artistsStatus = artistsRes.status;
          // 403 = endpoint deprecated for this app; genre-only classification.
          mood.audioFeaturesStatus = featuresRes.status;
          mood.features = features;
          mood.resolved = classifyMood(genres, features, title);
        }
      } else {
        mood.currentlyPlayingStatus = res.status;
      }
    }
  } catch (e) {
    mood.error = String(e).slice(0, 300);
  }

  return NextResponse.json({ present, tokenOk, tokenError, mood });
}
