// One-time helper to get your Spotify refresh token.
// Usage:  node scripts/spotify-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>
//
// Prereq: in your Spotify app settings, add this Redirect URI exactly:
//   http://127.0.0.1:8888/callback

import http from 'node:http';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || process.argv[2];
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || process.argv[3];
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const SCOPE = 'user-read-currently-playing user-read-playback-state';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    'Usage: node scripts/spotify-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>',
  );
  process.exit(1);
}

const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
  }).toString();

console.log('\n1) Open this URL in your browser and click Agree:\n');
console.log('   ' + authUrl + '\n');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (!url.pathname.startsWith('/callback')) {
    res.end('Waiting...');
    return;
  }
  const code = url.searchParams.get('code');
  if (!code) {
    res.end('No code found in callback.');
    return;
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const data = await tokenRes.json();

  if (data.refresh_token) {
    console.log('\n✅ Success! Add this to your .env.local:\n');
    console.log('   SPOTIFY_REFRESH_TOKEN=' + data.refresh_token + '\n');
    res.end('Success! Check your terminal for the refresh token. You can close this tab.');
  } else {
    console.log('\n❌ Error from Spotify:', data, '\n');
    res.end('Error: ' + JSON.stringify(data));
  }
  server.close();
});

server.listen(8888, () =>
  console.log('2) Waiting for approval at ' + REDIRECT_URI + ' ...\n'),
);
