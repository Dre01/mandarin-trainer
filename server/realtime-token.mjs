import http from 'node:http';

const port = Number(process.env.PORT ?? 8787);
const model = 'gpt-realtime-2.1';

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }
  if (req.method !== 'POST' || req.url !== '/api/realtime-token') return json(res, 404, { error: 'Not found' });
  if (!process.env.OPENAI_API_KEY) return json(res, 500, { error: 'OPENAI_API_KEY is not set on the token server.' });

  try {
    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session: { type: 'realtime', model } }),
    });
    const data = await response.json();
    if (!response.ok) return json(res, response.status, data);
    return json(res, 200, { value: data.value });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(port, '127.0.0.1', () => console.log(`Realtime token server listening on http://127.0.0.1:${port}`));
