// @ts-nocheck
// ═══════════════════════════════════════════════════════════
// GENSTRO INTELLIGENCE — QUANTUM-GRADE EDGE SECURITY LAYER
// Vercel Edge Middleware (Web Standards API)
// OWASP 2026 Compliant | Anti-DDoS | Anti-Bot | Anti-Enum
// ═══════════════════════════════════════════════════════════

// ─── Sliding window rate limiter (per-IP) ────────────────
const RATE_LIMIT_WINDOW = 10_000;       // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 30;     // max 30 requests per window
const BURST_THRESHOLD = 15;             // 15 requests in 2 seconds = instant block
const BURST_WINDOW = 2_000;
const BLOCK_DURATION = 60_000;          // 60 second block

const requestLog = new Map<string, number[]>();
const blockedIPs = new Map<string, number>();

// ─── Suspicious pattern detection ────────────────────────
const BLOCKED_PATHS = [
  /\.env/i, /\.git/i, /wp-admin/i, /wp-login/i, /wp-content/i,
  /\.php$/i, /\.asp$/i, /\.aspx$/i, /\.jsp$/i,
  /phpmyadmin/i, /adminer/i, /mysql/i, /postgres/i,
  /\.sql$/i, /\.bak$/i, /\.backup$/i, /\.old$/i,
  /\.ds_store/i, /thumbs\.db/i,
  /\/debug/i, /\/trace/i, /\/actuator/i,
  /cgi-bin/i, /\.cgi$/i, /\.pl$/i,
  /xmlrpc/i, /\.xml$/i,
  /\/config/i, /\/admin/i, /\/api\/v/i,
  /\.log$/i, /\.ini$/i, /\.conf$/i,
  /node_modules/i, /package\.json$/i, /package-lock/i,
  /\.map$/i, /tsconfig/i, /\.ts$/i,
  /\/\.well-known\/(?!security\.txt)/i,
];

const BLOCKED_USER_AGENTS = [
  /sqlmap/i, /nikto/i, /nessus/i, /openvas/i,
  /nmap/i, /masscan/i, /zmap/i,
  /gobuster/i, /dirb/i, /dirbuster/i, /ffuf/i, /feroxbuster/i,
  /wfuzz/i, /hydra/i, /medusa/i,
  /havij/i, /acunetix/i, /netsparker/i,
  /burpsuite/i, /zaproxy/i, /owasp/i,
  /python-requests\/[0-9]/i, /python-urllib/i,
  /curl\/[0-9]/i, /wget\/[0-9]/i,
  /scrapy/i, /mechanize/i, /phantom/i,
  /headless/i, /selenium/i, /puppeteer/i, /playwright/i,
];

const BLOCKED_METHODS = new Set(['TRACE', 'TRACK', 'CONNECT', 'OPTIONS']);

// ─── IP extraction ───────────────────────────────────────
function getClientIP(request: Request): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

// ─── Rate limiter check ──────────────────────────────────
function isRateLimited(ip: string): { limited: boolean; remaining: number } {
  const now = Date.now();

  // Check if IP is in block list
  const blockedUntil = blockedIPs.get(ip);
  if (blockedUntil && now < blockedUntil) {
    return { limited: true, remaining: 0 };
  } else if (blockedUntil) {
    blockedIPs.delete(ip);
  }

  // Get request timestamps for this IP
  const timestamps = requestLog.get(ip) || [];

  // Clean old entries
  const windowStart = now - RATE_LIMIT_WINDOW;
  const recent = timestamps.filter(t => t > windowStart);

  // Burst detection (rapid-fire requests)
  const burstStart = now - BURST_WINDOW;
  const burstCount = recent.filter(t => t > burstStart).length;
  if (burstCount >= BURST_THRESHOLD) {
    blockedIPs.set(ip, now + BLOCK_DURATION);
    requestLog.delete(ip);
    return { limited: true, remaining: 0 };
  }

  // Sliding window check
  recent.push(now);
  requestLog.set(ip, recent);

  if (recent.length > MAX_REQUESTS_PER_WINDOW) {
    blockedIPs.set(ip, now + BLOCK_DURATION);
    return { limited: true, remaining: 0 };
  }

  return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - recent.length };
}

// ─── Payload size check ──────────────────────────────────
function isOversizedPayload(request: Request): boolean {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10_240) { // 10KB max
    return true;
  }
  return false;
}

// ─── Request fingerprint anomaly detection ───────────────
function isAnomalousRequest(request: Request): boolean {
  const url = new URL(request.url);

  // No accept header = bot/scanner
  const accept = request.headers.get('accept');
  if (!accept && request.method === 'GET') return true;

  // Extremely long URLs (buffer overflow attempts)
  if (url.pathname.length > 500) return true;

  // Null bytes in URL (path traversal)
  if (url.pathname.includes('\0')) return true;
  if (url.pathname.includes('%00')) return true;

  // Directory traversal
  if (url.pathname.includes('..')) return true;

  // SQL injection patterns in URL
  const sqlPatterns = /('|--|;|\/\*|\*\/|union\s+select|drop\s+table|insert\s+into|delete\s+from|update\s+.*set|exec\s*\(|execute\s*\()/i;
  if (sqlPatterns.test(decodeURIComponent(url.search || ''))) return true;

  // XSS patterns in URL
  const xssPatterns = /(<script|javascript:|on\w+\s*=|eval\s*\(|document\.(cookie|write|location)|window\.(location|open))/i;
  if (xssPatterns.test(decodeURIComponent(url.search || ''))) return true;

  return false;
}

// ═══════════════════════════════════════════════════════════
// MAIN MIDDLEWARE
// ═══════════════════════════════════════════════════════════
export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const ip = getClientIP(request);
  const ua = request.headers.get('user-agent') || '';
  const path = url.pathname;

  // ─── 1. Method restriction ────────────────────────────
  if (BLOCKED_METHODS.has(request.method)) {
    return new Response(null, { status: 405 });
  }

  // ─── 2. Oversized payload rejection ───────────────────
  if (isOversizedPayload(request)) {
    return new Response(null, { status: 413 });
  }

  // ─── 3. Blocked path patterns (recon/enumeration) ─────
  if (BLOCKED_PATHS.some(pattern => pattern.test(path))) {
    // Return 404 instead of 403 — don't reveal what's protected
    return new Response(null, { status: 404 });
  }

  // ─── 4. Scanner/bot user-agent blocking ───────────────
  if (BLOCKED_USER_AGENTS.some(pattern => pattern.test(ua))) {
    return new Response(null, { status: 404 });
  }

  // ─── 5. Anomalous request detection ───────────────────
  if (isAnomalousRequest(request)) {
    return new Response(null, { status: 400 });
  }

  // ─── 6. Rate limiting (DDoS / brute force) ────────────
  const { limited, remaining } = isRateLimited(ip);
  if (limited) {
    return new Response(null, {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Remaining': '0',
      },
    });
  }

  // ─── 7. Pass through — fetch origin and add security headers ─
  const response = await fetch(request);
  const secured = new Response(response.body, response);

  // Rate limit headers
  secured.headers.set('X-RateLimit-Remaining', String(remaining));
  secured.headers.set('X-RateLimit-Limit', String(MAX_REQUESTS_PER_WINDOW));

  // Strip any leaked server info
  secured.headers.delete('X-Powered-By');
  secured.headers.delete('Server');

  return secured;
}
