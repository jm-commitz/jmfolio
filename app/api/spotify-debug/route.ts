import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// TEMPORARY diagnostic — reports whether Spotify env vars are present and whether
// the refresh-token exchange works. Exposes NO secret values (only lengths/flags).
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
      if (!res.ok) tokenError = (await res.text()).slice(0, 300);
    }
  } catch (e) {
    tokenError = String(e).slice(0, 300);
  }

  return NextResponse.json({ present, tokenOk, tokenError });
}
