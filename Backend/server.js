const http = require('node:http');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 4000);
const MAX_BODY_BYTES = 10 * 1024;
const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 30);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10_000);
const KIMI_API_URL = process.env.KIMI_API_URL || 'https://api.moonshot.ai/v1/chat/completions';
const KIMI_MODEL = process.env.KIMI_MODEL || 'moonshot-v1-8k';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
const requestLog = new Map();

const ROUTE_CONTEXT = {
  '/': 'Genstro Intelligence is a cybersecurity and AI platform connecting strategy, defense, and innovation.',
  '/about': 'This page explains the mission, architecture, and philosophy behind Genstro Intelligence.',
  '/redteam': 'Red Team focuses on adversarial simulation, attack path testing, and security validation.',
  '/blueteam': 'Blue Team focuses on defense, detection, monitoring, operational resilience, and incident response.',
  '/purpleteam': 'Purple Team unifies offensive and defensive perspectives so protection improves with each test.',
  '/quantum': 'Quantum security emphasizes cryptographic readiness, post-quantum strategies, and future-safe architectures.',
  '/research': 'Research and development connects applied security, AI systems, and next-generation resilience.',
  '/rnd': 'Research and development connects applied security, AI systems, and next-generation resilience.',
  '/contact': 'Contact is the route for partnerships, discussions, and service inquiries.',
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
  });
  response.end(JSON.stringify(payload));
}

function getClientIp(request) {
  return request.headers['x-real-ip'] || request.socket.remoteAddress || 'unknown';
}

function checkRateLimit(ip, requestLogStore, maxRequests = RATE_LIMIT_MAX, windowMs = RATE_LIMIT_WINDOW_MS) {
  const now = Date.now();
  const recent = (requestLogStore.get(ip) || []).filter(timestamp => timestamp > now - windowMs);
  if (recent.length >= maxRequests) {
    requestLogStore.set(ip, recent);
    return { allowed: false, remaining: 0 };
  }
  recent.push(now);
  requestLogStore.set(ip, recent);
  return { allowed: true, remaining: maxRequests - recent.length };
}

function sanitizeMessage(message) {
  return typeof message === 'string' ? message.trim().slice(0, MAX_MESSAGE_LENGTH) : '';
}

function buildMockResponse(message, route) {
  const lower = message.toLowerCase();
  const context = ROUTE_CONTEXT[route] || ROUTE_CONTEXT['/'];
  let text = `I’m guiding you through the ${context.toLowerCase()}`;

  if (lower.includes('quantum')) {
    text = 'Quantum security starts with a cryptographic inventory, post-quantum readiness, and disciplined key management.';
  } else if (lower.includes('red')) {
    text = 'Red Team work validates attack paths and exposes weak assumptions before a real exploit appears.';
  } else if (lower.includes('blue')) {
    text = 'Blue Team work emphasizes detection, monitoring, containment, and rapid response across the security stack.';
  } else if (lower.includes('purple')) {
    text = 'Purple Team fuses adversarial testing with defensive tuning so each simulation improves protective coverage.';
  }

  return {
    text,
    status: 'mock',
    suggestions: ['Explore the active route', 'Review security posture', 'Ask about quantum strategy'],
  };
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = '';
    request.setEncoding('utf8');
    request.on('data', chunk => {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body is too large'), { statusCode: 413 }));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(Object.assign(new Error('Request body must be valid JSON'), { statusCode: 400 }));
      }
    });
    request.on('error', reject);
  });
}

async function buildResponse(message, route) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) return buildMockResponse(message, route);

  const upstream = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: KIMI_MODEL,
      temperature: 0.2,
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are Deliah, the concise cybersecurity guide for Genstro Intelligence. The visitor is on ${route || '/'}. Do not claim to take actions, access systems, or know private data. Refuse requests for credentials, secrets, malware, or unauthorized access.`,
        },
        { role: 'user', content: message },
      ],
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!upstream.ok) throw new Error(`Kimi upstream returned HTTP ${upstream.status}`);
  const data = await upstream.json();
  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== 'string' || !text.trim()) throw new Error('Kimi returned no assistant message');

  return {
    text: text.trim().slice(0, 2_000),
    status: 'live',
    suggestions: ['Explore the active route', 'Review security posture', 'Ask about quantum strategy'],
  };
}

async function handleRequest(request, response, requestLogStore = requestLog, rateLimitConfig = {}) {
  const maxRequests = rateLimitConfig.maxRequests || RATE_LIMIT_MAX;
  const windowMs = rateLimitConfig.windowMs || RATE_LIMIT_WINDOW_MS;
  const rateLimit = checkRateLimit(getClientIp(request), requestLogStore, maxRequests, windowMs);
  response.setHeader('X-RateLimit-Limit', String(maxRequests));
  response.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));
  if (!rateLimit.allowed) {
    response.setHeader('Retry-After', String(Math.ceil(windowMs / 1000)));
    sendJson(response, 429, { error: 'Too many requests' });
    return;
  }

  const origin = request.headers.origin;
  if (origin && origin !== ALLOWED_ORIGIN) {
    sendJson(response, 403, { error: 'Origin is not allowed' });
    return;
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (request.method === 'GET' && url.pathname === '/health') {
    sendJson(response, 200, { status: 'ok', provider: process.env.KIMI_API_KEY ? 'kimi' : 'mock' });
    return;
  }

  if (request.method !== 'POST' || url.pathname !== '/api/deliah') {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  try {
    const payload = await readJson(request);
    const message = sanitizeMessage(payload.message);
    if (!message) {
      sendJson(response, 400, { error: 'message must be a non-empty string' });
      return;
    }
    const result = await buildResponse(message, typeof payload.route === 'string' ? payload.route.slice(0, 100) : '/');
    response.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    sendJson(response, 200, result);
  } catch (error) {
    const status = error.statusCode || 502;
    sendJson(response, status, { error: status === 502 ? 'AI service is temporarily unavailable' : error.message });
  }
}

function createServer(options = {}) {
  const serverRequestLog = new Map();
  return http.createServer((request, response) => {
    handleRequest(request, response, serverRequestLog, options).catch(() => {
      if (!response.headersSent) sendJson(response, 500, { error: 'Internal server error' });
    });
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    console.log(`Deliah backend listening on http://${HOST}:${PORT}`);
  });
  const shutdown = signal => server.close(() => {
    console.log(`Deliah backend stopped (${signal})`);
    process.exit(0);
  });
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = { buildMockResponse, createServer, handleRequest, sanitizeMessage };