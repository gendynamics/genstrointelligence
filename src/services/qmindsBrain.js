/*
 * QMINDS brain — what Qminds knows and what he can do from chat.
 *
 * Skills handled locally (always): greetings, introductions, help, thanks,
 * "take me to <page>", and motion requests ("do a spin", "wave").
 * Questions: if REACT_APP_QMINDS_API_URL points at an AI backend that answers
 * POST { message, route } with { text, status: 'live' }, that answer is used;
 * otherwise (no URL, offline, or a mock backend) the local knowledge below answers.
 *
 * Move names here must match MOVES in components/QmindsAvatar.jsx.
 */

const API_URL = process.env.REACT_APP_QMINDS_API_URL || '';
const MAX_MESSAGE_LENGTH = 500;

export const DEFAULT_TIPS = [
  "Welcome. Genstro Intelligence is the portal to next-generation AI. Enter once — and the future expands infinitely. I'm Qminds, your AI security analyst.",
  'Ask me about red team, blue team, and purple team operations — or the products we are building.',
  'Every page carries its own signal. Navigate and I will brief you on each domain.',
  'Security intelligence means seeing exposure clearly before it becomes impact.',
  'The door is always open. Where would you like to go next?',
];

export const PAGE_TIPS = {
  '/blueteam': [
    'Blue Team — The Cybersecurity Shield. Defend. Detect. Dominate.',
    'Detection engineering turns raw telemetry into decisions — identity, endpoint, cloud, and network signal in one operating picture.',
    'Incident response is measured in minutes. Containment paths should be rehearsed, never improvised.',
    'Threat hunting assumes breach. The only question is how fast you see it.',
    'A strong SOC measures dwell time and decision velocity — not ticket counts.',
  ],
  '/redteam': [
    'Red Team — Offensive Cybersecurity Operations. Strike first, strike smart.',
    'Penetration testing maps the breach paths defenders fear most — before someone else finds them.',
    'Social engineering tests the human layer: process, trust, and the gaps in between.',
    'Exploit validation beats vulnerability lists. Business impact is the metric.',
    'The strongest defense is informed by the logic of the adversary.',
  ],
  '/purpleteam': [
    'Purple Team — where offense proves defense, and defense sharpens offense.',
    'Continuous validation maps detections to MITRE ATT&CK so coverage is measured, not assumed.',
    'Every red team finding becomes a blue team detection. That is the loop.',
    'Blind spots are found by testing, not by trusting the dashboard.',
    'Coverage scoring turns security posture into a number leadership can track.',
  ],
  '/quantum': [
    'Quantum Computing — The Next Frontier of Cybersecurity and AI.',
    'Harvest-now-decrypt-later attacks are already underway. Data stolen today may be decrypted tomorrow.',
    'Cryptographic agility means swapping algorithms without re-architecting the business.',
    'Post-quantum migration starts with inventory: keys, certificates, and where they live.',
    'Quantum readiness is a roadmap, not a product — assess, prioritize, migrate, validate.',
  ],
  '/products': [
    "Welcome. Genstro Intelligence is the portal to next-generation AI. Enter once — and the future expands infinitely. I'm Qminds, your guide through the grid.",
    'GENSTRO SIEM correlates millions of events per second with adaptive threat scoring.',
    'REDSTRIKE runs continuous attack campaigns against your infrastructure — and reports exploitable paths.',
    'SHIELDWALL stops zero-day threats, ransomware, and fileless attacks before execution.',
    'QUANTUM VAULT brings post-quantum cryptography to data at rest, in transit, and in use.',
  ],
};

// Site sections Qminds can brief on, navigate to, and react to with a move.
export const CATEGORIES = [
  {
    route: '/redteam', name: 'Red Team', move: 'strike', question: 'What does Red Team do?',
    keywords: ['red team', 'redteam', 'red', 'offensive', 'offense', 'attack', 'attacks', 'penetration', 'pentest', 'pen test', 'exploit', 'social engineering', 'adversary'],
    summary: 'Red Team is offensive security: adversary simulation, penetration testing and social engineering that map the breach paths defenders fear most — before someone else finds them. Exploit validation beats vulnerability lists.',
  },
  {
    route: '/blueteam', name: 'Blue Team', move: 'guard', question: 'What does Blue Team do?',
    keywords: ['blue team', 'blueteam', 'blue', 'defense', 'defence', 'defensive', 'detection', 'soc', 'incident', 'incident response', 'threat hunting', 'monitoring'],
    summary: 'Blue Team is the cybersecurity shield: detection engineering, threat hunting and incident response that turn identity, endpoint, cloud and network telemetry into one operating picture.',
  },
  {
    route: '/purpleteam', name: 'Purple Team', move: 'spin', question: 'How does Purple Team work?',
    keywords: ['purple team', 'purpleteam', 'purple', 'validation', 'mitre', 'att&ck', 'coverage'],
    summary: 'Purple Team is one loop where offense proves defense and defense sharpens offense: every red team finding becomes a blue team detection, with coverage mapped to MITRE ATT&CK.',
  },
  {
    route: '/quantum', name: 'Quantum', move: 'levitate', question: 'Why does quantum matter now?',
    keywords: ['quantum', 'post-quantum', 'post quantum', 'pqc', 'cryptography', 'cryptographic', 'crypto', 'encryption', 'harvest now', 'decrypt later'],
    summary: 'Harvest-now-decrypt-later attacks are already underway — data stolen today may be decrypted tomorrow. Quantum readiness is a roadmap: inventory your keys and certificates, build cryptographic agility, then assess, prioritize, migrate and validate.',
  },
  {
    route: '/products', name: 'Products', move: 'point', question: 'Tell me about Shieldwall',
    keywords: ['product', 'products', 'portfolio', 'platforms', 'tools'],
    summary: 'The Genstro portfolio: Genstro SIEM for detection, Redstrike for offensive testing, Shieldwall for endpoint protection, Quantum Vault for post-quantum encryption, Purplenet for validation — plus an AI security analyst.',
  },
  {
    route: '/rnd', aliases: ['/research'], name: 'R&D', move: 'scan', question: 'What is R&D working on?',
    keywords: ['r&d', 'rnd', 'research', 'development', 'innovation', 'lab'],
    summary: 'R&D builds the next generation of cyber defense before adversaries redefine the threat model — the next frontier of defense begins where uncertainty is first observed.',
  },
  {
    route: '/ai', name: 'AI', move: 'scan', question: 'What does the AI do?',
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'decision engine'],
    summary: 'Genstro AI is the decision engine behind resilient operations: machine intelligence that turns noisy data into decisive action, because signal quality is the difference between noise and advantage.',
  },
  {
    route: '/architecture', name: 'Architecture', move: 'scan', question: 'What does Architecture cover?',
    keywords: ['architecture', 'api design', 'observability'],
    summary: 'Architecture is about building systems that grow with your needs — from API design to observability — so teams move fast, systems scale reliably and codebases stay maintainable.',
  },
  {
    route: '/pricing', name: 'Pricing', move: 'point', question: 'How does pricing work?',
    keywords: ['pricing', 'price', 'prices', 'cost', 'costs', 'plans', 'subscription', 'quote'],
    summary: 'Pricing is sized to the decision: you choose a starting point, and engagement scope and platform access are set through a confidential briefing.',
  },
  {
    route: '/about', name: 'About', move: 'wave', question: 'What is Genstro Intelligence?',
    keywords: ['about', 'mission', 'company', 'genstro', 'genstro intelligence'],
    summary: 'Genstro Intelligence builds the intelligence layer behind enterprise trust — offense, defense and leadership aligned around one operating picture.',
  },
  {
    route: '/contact', name: 'Contact', move: 'wave', question: 'How do I request a briefing?',
    keywords: ['contact', 'reach', 'email', 'sales', 'talk to someone', 'human', 'briefing', 'assessment', 'partnership', 'partner'],
    summary: 'Use the Contact page to request an executive briefing, platform review or security assessment. Describe the context and a Genstro specialist will follow up.',
  },
  {
    route: '/', name: 'Home', move: 'wave', question: 'What do you do?',
    keywords: ['home', 'homepage', 'home page', 'main page'],
    summary: 'Home is the front door of Genstro Intelligence — security intelligence for the consequential.',
  },
];

export const PRODUCTS = [
  { name: 'Genstro SIEM', keywords: ['siem', 'genstro siem'], text: 'Genstro SIEM is the detection platform: it correlates millions of events per second with adaptive threat scoring, so you see the signal before it becomes impact.' },
  { name: 'Redstrike', keywords: ['redstrike', 'red strike'], text: 'Redstrike is the offensive toolkit: it runs continuous attack campaigns against your infrastructure and reports exploitable paths.' },
  { name: 'Shieldwall', keywords: ['shieldwall', 'shield wall'], text: 'Shieldwall is endpoint protection that stops zero-day threats, ransomware and fileless attacks before execution.' },
  { name: 'Quantum Vault', keywords: ['quantum vault', 'vault'], text: 'Quantum Vault brings post-quantum cryptography to data at rest, in transit and in use.' },
  { name: 'Purplenet', keywords: ['purplenet', 'purple net'], text: 'Purplenet is the validation engine — it makes confidence something you can test.' },
];

const RELATED = {
  '/redteam': '/blueteam',
  '/blueteam': '/purpleteam',
  '/purpleteam': '/quantum',
  '/quantum': '/products',
  '/products': '/contact',
  '/rnd': '/ai',
  '/ai': '/architecture',
  '/architecture': '/products',
  '/pricing': '/contact',
  '/about': '/products',
  '/contact': '/products',
  '/': '/products',
};

// [pattern, move, reply]
const MOVE_COMMANDS = [
  [/\b(spin|flip|backflip|jump|twirl)\b/, 'spin', 'Power spin — engaged.'],
  [/\b(dance|celebrate|party|groove)\b/, 'strike', 'My victory routine: sprint, then spin.'],
  [/\b(run|sprint|race)\b/, 'run', 'Running hot.'],
  [/\b(shield|guard|block|defend)\b/, 'guard', 'Shields up — that is my Blue Team stance.'],
  [/\b(fly|float|levitate|hover)\b/, 'levitate', 'Entering superposition.'],
  [/\b(look around|scan)\b/, 'scan', 'Scanning the perimeter.'],
  [/\b(point)\b/, 'point', 'Right this way.'],
  [/\b(nod)\b/, 'nod', 'Acknowledged.'],
  [/\b(wave|say hi|say hello)\b/, 'wave', 'Hello there!'],
];

const NAV_RE = /\b(take me|bring me|go|navigate|head|show me|open|visit|switch to|let'?s see)\b/;
const REQUEST_RE = /\b(do|can you|could you|will you|show me|let'?s see|please|try|again)\b/;
const SKILLS_TEXT = 'I can brief you on Red, Blue and Purple Team operations, quantum readiness, our products and pricing — and take you to any page. Try "take me to Quantum". I also have moves: spin, wave, shield, levitate, scan and run.';

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasKeyword(lower, keyword) {
  return new RegExp(`(^|[^a-z0-9&])${escapeRegExp(keyword)}(?=$|[^a-z0-9&])`).test(lower);
}

function bestMatch(lower, entries) {
  let best = null;
  let bestScore = 0;
  entries.forEach(entry => {
    const score = entry.keywords.reduce((sum, k) => sum + (hasKeyword(lower, k) ? k.length : 0), 0);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  });
  return best;
}

export function sanitizeMessage(message) {
  return String(message || '').trim().slice(0, MAX_MESSAGE_LENGTH);
}

export function categoryForRoute(route = '/') {
  return CATEGORIES.find(c => c.route === route || (c.aliases || []).includes(route)) || null;
}

export function moveForRoute(route) {
  const category = categoryForRoute(route);
  return category ? category.move : 'wave';
}

export function tipsForRoute(route) {
  const category = categoryForRoute(route);
  return PAGE_TIPS[route] || (category && PAGE_TIPS[category.route]) || DEFAULT_TIPS;
}

export function suggestionsFor(route) {
  const here = categoryForRoute(route) || categoryForRoute('/');
  const next = categoryForRoute(RELATED[here.route] || '/products');
  return [here.question, `Take me to ${next.name}`, 'Show me your moves'];
}

function reply(route, text, extra = {}) {
  return { text, suggestions: suggestionsFor(route), source: 'local', ...extra };
}

// Things Qminds always handles himself, even when an AI backend is available.
export function detectSkill(message, route = '/') {
  const lower = sanitizeMessage(message).toLowerCase();
  if (!lower) return null;
  const words = lower.split(/\s+/).length;

  if (/\b(your moves|your skills|tricks|what moves)\b/.test(lower)) {
    return reply(route, `Here is a taste. ${SKILLS_TEXT}`, { move: 'spin' });
  }

  const target = bestMatch(lower, PRODUCTS) ? categoryForRoute('/products') : bestMatch(lower, CATEGORIES);
  if (NAV_RE.test(lower) && target && !/\b(how|why|what)\b/.test(lower)) {
    if (target.route === route || (target.aliases || []).includes(route)) {
      return reply(route, `You're already on ${target.name}. Ask me anything about it.`, { move: 'nod' });
    }
    return reply(route, `Heading to ${target.name}.`, { navigate: target.route, move: 'point' });
  }

  if (REQUEST_RE.test(lower) || words <= 3) {
    const command = MOVE_COMMANDS.find(([pattern]) => pattern.test(lower));
    if (command) return reply(route, command[2], { move: command[1] });
  }

  if (/^(hi|hello|hey|yo|hiya|greetings|good (morning|afternoon|evening))\b/.test(lower)) {
    return reply(route, "Hi, I'm Qminds — Genstro Intelligence's AI security analyst. Ask me about any part of the site, or tell me where to take you.", { move: 'wave' });
  }
  if (/\b(who are you|what are you|your name|introduce yourself)\b/.test(lower)) {
    return reply(route, "I'm Qminds, the AI security analyst for Genstro Intelligence. I brief you on each page, answer questions, and can take you anywhere on the site.", { move: 'wave' });
  }
  if (/\b(help|what can you do|what do you do|how does this work)\b/.test(lower)) {
    return reply(route, SKILLS_TEXT, { move: 'nod' });
  }
  if (/\b(thanks|thank you|thx|cheers|appreciate)\b/.test(lower)) {
    return reply(route, 'Anytime. I am right here if you need me.', { move: 'nod' });
  }
  if (/\b(bye|goodbye|see you)\b/.test(lower)) {
    return reply(route, 'Signing off — I will keep watch from the corner.', { move: 'wave' });
  }
  return null;
}

// Keyword answers from the site's own copy; used when no live AI answer is available.
export function localReply(message, route = '/') {
  const text = sanitizeMessage(message);
  if (!text) {
    return reply(route, 'Ask me about red team, blue team, quantum, or our products — or tell me where to take you.');
  }
  const lower = text.toLowerCase();

  const product = bestMatch(lower, PRODUCTS);
  if (product) {
    const offer = route === '/products' ? {} : { suggestions: [`Take me to Products`, 'What does Red Team do?', 'Show me your moves'] };
    return reply(route, product.text, offer);
  }

  const category = bestMatch(lower, CATEGORIES);
  if (category) {
    const here = categoryForRoute(route);
    const suggestions = here && here.route === category.route
      ? suggestionsFor(route)
      : [`Take me to ${category.name}`, ...suggestionsFor(route).slice(0, 2)];
    return reply(route, category.summary, { suggestions });
  }

  const tips = tipsForRoute(route);
  return reply(route, `I don't have a confident answer for that yet. Here is what matters on this page: ${tips[1] || tips[0]} You can also ask me to take you somewhere.`);
}

export async function askQminds({ message, route = '/' }, { apiUrl = API_URL, fetchImpl = typeof fetch === 'function' ? fetch : null, timeoutMs = 12000 } = {}) {
  const text = sanitizeMessage(message);
  const skill = detectSkill(text, route);
  if (skill) return skill;

  if (text && apiUrl && fetchImpl) {
    try {
      const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined;
      const response = await fetchImpl(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, route }),
        signal,
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.status === 'live' && typeof data.text === 'string' && data.text.trim()) {
          return reply(route, data.text.trim().slice(0, 1200), { source: 'live' });
        }
      }
    } catch {
      // Network error or timeout: answer locally instead.
    }
  }
  return localReply(text, route);
}
