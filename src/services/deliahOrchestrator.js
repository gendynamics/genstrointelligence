const ROUTE_CONTEXT = {
  '/': 'Genstro Intelligence is a cybersecurity and AI platform connecting strategy, defense, and innovation.',
  '/about': 'This page explains the mission, architecture, and philosophy behind Genstro Intelligence.',
  '/redteam': 'Red Team focuses on adversarial simulation, attack path testing, and security validation.',
  '/blueteam': 'Blue Team focuses on defense, detection, monitoring, operational resilience, and incident response.',
  '/purpleteam': 'Purple Team unifies offensive and defensive perspectives so protection improves with each test.',
  '/quantum': 'Quantum security emphasizes strong cryptographic readiness, post-quantum strategies, and future-safe architectures.',
  '/research': 'Research and development connects applied security, AI systems, and next-generation resilience work.',
  '/rnd': 'Research and development connects applied security, AI systems, and next-generation resilience work.',
  '/contact': 'Contact is the route for partnerships, discussions, and service inquiries.',
};

function sanitizeInput(message) {
  return String(message || '').trim().slice(0, 500);
}

const API_URL = process.env.REACT_APP_DELIAH_API_URL || 'http://localhost:4000/api/deliah';

export async function requestDeliahResponse({ message, route = '/' }) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: sanitizeInput(message), route }),
  });

  if (!response.ok) throw new Error(`Deliah API returned HTTP ${response.status}`);
  return response.json();
}

function buildRouteGuidance(route) {
  return ROUTE_CONTEXT[route] || ROUTE_CONTEXT['/'];
}

export function buildDeliahResponse({ message, route = '/' }) {
  const sanitizedMessage = sanitizeInput(message);

  if (!sanitizedMessage) {
    return {
      text: 'I can help with red team, blue team, quantum, or platform strategy. Ask me a question to begin.',
      status: 'error',
      suggestions: ['What is Red Team?', 'How does Blue Team work?', 'Explain Quantum security'],
    };
  }

  const lower = sanitizedMessage.toLowerCase();
  const routeContext = buildRouteGuidance(route);

  let text = `I’m guiding you through the ${routeContext.toLowerCase()}`;

  if (lower.includes('quantum')) {
    text = 'Quantum security is a strategic priority. Start with post-quantum readiness, key management hygiene, and cryptographic inventory reviews before broader rollouts.';
  } else if (lower.includes('red')) {
    text = 'Red Team work focuses on adversary simulation: validate attack paths, pressure-test controls, and expose weak assumptions before a real exploit appears.';
  } else if (lower.includes('blue')) {
    text = 'Blue Team work emphasizes detection, monitoring, containment, and rapid response across the operating environment and security stack.';
  } else if (lower.includes('purple')) {
    text = 'Purple Team is the fusion of adversarial testing and defensive tuning so each simulated attack improves protective coverage.';
  } else if (lower.includes('research') || lower.includes('r&d') || lower.includes('development')) {
    text = 'Research and development should turn signal into practical security capability: validate hypotheses, harden designs, and test readiness under operational conditions.';
  } else if (lower.includes('contact') || lower.includes('support') || lower.includes('help')) {
    text = 'The best next step is to connect with the team through the Contact route so the discussion can turn into a specific security or partnership plan.';
  }

  return {
    text,
    status: 'mock',
    suggestions: ['Explore the active route', 'Review security posture', 'Ask about quantum strategy'],
  };
}

export default {
  buildDeliahResponse,
};
