import {
  askQminds,
  detectSkill,
  localReply,
  moveForRoute,
  suggestionsFor,
  tipsForRoute,
} from './qmindsBrain';

describe('Qminds chat skills', () => {
  it('navigates to a category on request and points the way', () => {
    const answer = detectSkill('Take me to quantum', '/blueteam');
    expect(answer.navigate).toBe('/quantum');
    expect(answer.move).toBe('point');
  });

  it('sends product requests to the Products page', () => {
    expect(detectSkill('show me shieldwall', '/about').navigate).toBe('/products');
  });

  it('does not navigate to the page you are already on', () => {
    const answer = detectSkill('open red team', '/redteam');
    expect(answer.navigate).toBeUndefined();
    expect(answer.text).toMatch(/already on Red Team/);
  });

  it('performs moves on request', () => {
    expect(detectSkill('do a spin', '/quantum').move).toBe('spin');
    expect(detectSkill('wave', '/quantum').move).toBe('wave');
    expect(detectSkill('can you levitate?', '/quantum').move).toBe('levitate');
    expect(detectSkill('show me your moves', '/quantum').move).toBe('spin');
  });

  it('greets and introduces himself as Qminds', () => {
    expect(detectSkill('hello there', '/ai').text).toMatch(/Qminds/);
    expect(detectSkill('who are you?', '/ai').move).toBe('wave');
  });

  it('leaves knowledge questions to the answerer', () => {
    expect(detectSkill('what is red team?', '/blueteam')).toBeNull();
    expect(detectSkill('how do I get to contact', '/blueteam')).toBeNull();
  });
});

describe('Qminds local knowledge', () => {
  it('answers category questions and offers to go there', () => {
    const answer = localReply('What does Red Team do?', '/blueteam');
    expect(answer.text).toMatch(/offensive security/i);
    expect(answer.suggestions[0]).toBe('Take me to Red Team');
  });

  it('answers product questions', () => {
    expect(localReply('tell me about shieldwall', '/products').text).toMatch(/zero-day/);
    expect(localReply('what is quantum vault?', '/quantum').text).toMatch(/post-quantum cryptography/);
  });

  it('matches whole words only', () => {
    // "said" must not match the AI page, "bored" must not match Red Team
    expect(localReply('she said she was bored', '/about').text).toMatch(/don't have a confident answer/);
  });

  it('asks for a question when the message is empty', () => {
    expect(localReply('   ', '/quantum').text).toMatch(/Ask me/);
  });
});

describe('Qminds page knowledge', () => {
  it('maps categories to moves', () => {
    expect(moveForRoute('/redteam')).toBe('strike');
    expect(moveForRoute('/blueteam')).toBe('guard');
    expect(moveForRoute('/quantum')).toBe('levitate');
    expect(moveForRoute('/research')).toBe('scan');
    expect(moveForRoute('/unknown')).toBe('wave');
  });

  it('has tips and suggestions for every page', () => {
    expect(tipsForRoute('/quantum')[0]).toMatch(/Quantum/);
    expect(tipsForRoute('/contact').length).toBeGreaterThan(1);
    expect(suggestionsFor('/redteam')).toEqual(['What does Red Team do?', 'Take me to Blue Team', 'Show me your moves']);
  });
});

describe('askQminds', () => {
  const ok = body => Promise.resolve({ ok: true, json: () => Promise.resolve(body) });

  it('uses a live AI answer when the backend has one', async () => {
    const fetchImpl = jest.fn(() => ok({ text: 'Live answer about SOC metrics.', status: 'live' }));
    const answer = await askQminds({ message: 'How should a SOC measure success?', route: '/blueteam' }, { apiUrl: 'http://api.test/chat', fetchImpl });
    expect(answer.text).toBe('Live answer about SOC metrics.');
    expect(answer.source).toBe('live');
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toEqual({ message: 'How should a SOC measure success?', route: '/blueteam' });
  });

  it('answers locally when the backend is only a mock', async () => {
    const fetchImpl = jest.fn(() => ok({ text: 'mock', status: 'mock' }));
    const answer = await askQminds({ message: 'what is purple team', route: '/' }, { apiUrl: 'http://api.test/chat', fetchImpl });
    expect(answer.source).toBe('local');
    expect(answer.text).toMatch(/offense proves defense/);
  });

  it('answers locally when the backend is unreachable', async () => {
    const fetchImpl = jest.fn(() => Promise.reject(new Error('offline')));
    const answer = await askQminds({ message: 'what is quantum vault', route: '/' }, { apiUrl: 'http://api.test/chat', fetchImpl });
    expect(answer.text).toMatch(/post-quantum/);
  });

  it('handles skills without calling the backend', async () => {
    const fetchImpl = jest.fn();
    const answer = await askQminds({ message: 'take me to pricing', route: '/' }, { apiUrl: 'http://api.test/chat', fetchImpl });
    expect(answer.navigate).toBe('/pricing');
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
