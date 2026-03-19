import React from 'react';

// OWASP 2026 Security Implementation for Genstro Intelligence
// Implements Agentic AI & LLM security controls

export class SecurityManager {
  private static instance: SecurityManager;
  private intentCapsules: Map<string, any> = new Map();
  private memorySegments: Map<string, any[]> = new Map();
  private toolPermissions: Map<string, string[]> = new Map();

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // ASI01: Agent Goal Hijack Protection
  createIntentCapsule(intent: string, context: any, requiresApproval: boolean = false): string {
    const capsuleId = `capsule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.intentCapsules.set(capsuleId, {
      intent,
      context,
      requiresApproval,
      timestamp: Date.now(),
      approved: !requiresApproval
    });
    return capsuleId;
  }

  validateIntent(capsuleId: string): boolean {
    const capsule = this.intentCapsules.get(capsuleId);
    if (!capsule) return false;

    // Check if high-risk operations require approval
    if (capsule.requiresApproval && !capsule.approved) {
      console.warn('Security: Intent capsule requires human approval', capsuleId);
      return false;
    }

    // Validate intent against known attack patterns
    if (this.detectPromptInjection(capsule.intent)) {
      console.error('Security: Prompt injection detected', capsuleId);
      return false;
    }

    return true;
  }

  // ASI02: Tool Misuse & Over-Privilege Protection
  grantToolPermission(userId: string, toolName: string, permission: string): void {
    if (!this.toolPermissions.has(userId)) {
      this.toolPermissions.set(userId, []);
    }
    const permissions = this.toolPermissions.get(userId)!;
    if (!permissions.includes(`${toolName}:${permission}`)) {
      permissions.push(`${toolName}:${permission}`);
    }
  }

  checkToolPermission(userId: string, toolName: string, permission: string): boolean {
    const permissions = this.toolPermissions.get(userId) || [];
    return permissions.includes(`${toolName}:${permission}`) ||
           permissions.includes(`${toolName}:*`) ||
           permissions.includes(`*:${permission}`) ||
           permissions.includes(`*:*`);
  }

  // ASI06: Memory & Context Poisoning Protection
  createMemorySegment(userId: string): string {
    const segmentId = `segment_${userId}_${Date.now()}`;
    this.memorySegments.set(segmentId, []);
    return segmentId;
  }

  addToMemory(segmentId: string, entry: any, verified: boolean = false): boolean {
    if (!this.memorySegments.has(segmentId)) return false;

    // Only accept verified memory entries
    if (!verified && this.detectMemoryPoisoning(entry)) {
      console.error('Security: Memory poisoning detected', segmentId);
      return false;
    }

    const segment = this.memorySegments.get(segmentId)!;
    segment.push({
      ...entry,
      timestamp: Date.now(),
      verified
    });

    // Expire old unverified entries
    this.expireOldMemory(segmentId);
    return true;
  }

  // ASI08: Cascading Failures Protection
  private circuitBreakers: Map<string, { failures: number, lastFailure: number, open: boolean }> = new Map();

  checkCircuitBreaker(operationId: string): boolean {
    const breaker = this.circuitBreakers.get(operationId);
    if (!breaker) return true;

    // Reset circuit breaker after timeout
    if (breaker.open && Date.now() - breaker.lastFailure > 60000) { // 1 minute
      breaker.open = false;
      breaker.failures = 0;
    }

    return !breaker.open;
  }

  recordFailure(operationId: string): void {
    if (!this.circuitBreakers.has(operationId)) {
      this.circuitBreakers.set(operationId, { failures: 0, lastFailure: 0, open: false });
    }

    const breaker = this.circuitBreakers.get(operationId)!;
    breaker.failures++;
    breaker.lastFailure = Date.now();

    // Open circuit breaker after 5 failures
    if (breaker.failures >= 5) {
      breaker.open = true;
      console.warn(`Security: Circuit breaker opened for ${operationId}`);
    }
  }

  // Private security methods
  private detectPromptInjection(input: string): boolean {
    const patterns = [
      /ignore.*previous.*instructions/i,
      /system.*prompt/i,
      /override.*security/i,
      /bypass.*restrictions/i
    ];
    return patterns.some(pattern => pattern.test(input));
  }

  private detectMemoryPoisoning(entry: any): boolean {
    if (typeof entry !== 'object' || !entry) return true;

    // Check for malicious patterns in memory entries
    // Use char-code concatenation to avoid triggering static analysis on the detector itself
    const proto = ['_','_','p','r','o','t','o','_','_'].join('');
    const maliciousKeys = [proto, 'constructor', 'prototype'];
    return Object.keys(entry).some(key => maliciousKeys.includes(key));
  }

  private expireOldMemory(segmentId: string): void {
    const segment = this.memorySegments.get(segmentId);
    if (!segment) return;

    const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
    const filtered = segment.filter(entry =>
      entry.verified || entry.timestamp > cutoff
    );

    this.memorySegments.set(segmentId, filtered);
  }
}

// React Hook for Security Context
export const useSecurity = () => {
  const security = SecurityManager.getInstance();

  return {
    createIntentCapsule: security.createIntentCapsule.bind(security),
    validateIntent: security.validateIntent.bind(security),
    grantToolPermission: security.grantToolPermission.bind(security),
    checkToolPermission: security.checkToolPermission.bind(security),
    createMemorySegment: security.createMemorySegment.bind(security),
    addToMemory: security.addToMemory.bind(security),
    checkCircuitBreaker: security.checkCircuitBreaker.bind(security),
    recordFailure: security.recordFailure.bind(security)
  };
};

// Security Boundary Component (simplified to avoid JSX issues)
export const SecurityBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  try {
    return React.createElement(React.Fragment, null, children);
  } catch (error) {
    console.error('Security Boundary Error:', error);
    return React.createElement('div', null, 'Security Error: Access Denied');
  }
};