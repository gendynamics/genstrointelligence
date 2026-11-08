import { buildDeliahResponse } from './deliahOrchestrator';

describe('Deliah orchestrator', () => {
  it('returns a quantum-aware response for route-specific questions', () => {
    const response = buildDeliahResponse({
      message: 'How do we protect quantum systems?',
      route: '/quantum',
    });

    expect(response.status).toBe('mock');
    expect(response.text.toLowerCase()).toContain('quantum');
  });

  it('returns a safe fallback for empty input', () => {
    const response = buildDeliahResponse({
      message: '',
      route: '/redteam',
    });

    expect(response.status).toBe('error');
    expect(response.text.toLowerCase()).toContain('ask');
  });
});
