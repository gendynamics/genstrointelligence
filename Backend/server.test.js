const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('./server');

let server;
let baseUrl;

test.before(async () => {
  server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

test('health reports mock mode without exposing secrets', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', provider: 'mock' });
});

test('Deliah endpoint validates input and returns a mock response', async () => {
  const response = await fetch(`${baseUrl}/api/deliah`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' },
    body: JSON.stringify({ message: 'How should we prepare for quantum security?', route: '/quantum' }),
  });
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.status, 'mock');
  assert.match(payload.text, /quantum/i);
});

test('Deliah endpoint rejects empty messages', async () => {
  const response = await fetch(`${baseUrl}/api/deliah`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '   ' }),
  });
  assert.equal(response.status, 400);
});

test('rate limiting returns retry guidance', async () => {
  const limitedServer = createServer({ maxRequests: 1, windowMs: 10_000 });
  await new Promise(resolve => limitedServer.listen(0, '127.0.0.1', resolve));
  const limitedUrl = `http://127.0.0.1:${limitedServer.address().port}`;

  await fetch(`${limitedUrl}/health`);
  const response = await fetch(`${limitedUrl}/health`);

  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '10');
  await new Promise(resolve => limitedServer.close(resolve));
});