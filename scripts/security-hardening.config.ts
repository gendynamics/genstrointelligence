/**
 * GENSTRO INTELLIGENCE — TypeScript 5.9.3 Security Hardening Configuration
 *
 * This module exports the enforced compiler and runtime security constraints
 * that the multi-chain security pipeline validates against.
 *
 * Used by: scripts/security-chain.ts (Chain 3)
 * Reference: OWASP 2026 — Software Supply Chain Failures, Security Misconfiguration
 */

// Compiler flags that MUST be enabled for security compliance
export const ENFORCED_COMPILER_FLAGS = {
  // ── Type Safety (prevents type confusion attacks) ──
  strict: true,                          // Master switch for all strict checks
  noImplicitAny: true,                   // No implicit any — forces explicit typing
  strictNullChecks: true,                // Null/undefined must be handled explicitly
  strictFunctionTypes: true,             // Contravariant function parameter checking
  strictBindCallApply: true,             // Type-safe bind/call/apply
  strictPropertyInitialization: true,    // Class properties must be initialized
  noImplicitThis: true,                  // No implicit any for this
  useUnknownInCatchVariables: true,      // catch(e) → e is unknown, not any

  // ── Code Quality Gates (reduces attack surface) ──
  noUnusedLocals: false,                 // Warn-only in dev (CRA handles this)
  noUnusedParameters: false,             // Warn-only in dev (CRA handles this)
  noImplicitReturns: true,               // All code paths must return
  noFallthroughCasesInSwitch: true,      // switch cases must break or return
  forceConsistentCasingInFileNames: true, // Prevents path confusion on case-insensitive OS
  isolatedModules: true,                 // Safe for bundler-based builds

  // ── Module Safety ──
  esModuleInterop: true,                 // Safe CJS/ESM interop
  allowSyntheticDefaultImports: true,    // Works with esModuleInterop
  resolveJsonModule: true,               // Typed JSON imports
} as const;

// Compiler flags that MUST NOT be enabled (security anti-patterns)
export const FORBIDDEN_COMPILER_FLAGS = [
  'suppressImplicitAnyIndexErrors',      // Bypasses type safety for index signatures
  'suppressExcessPropertyErrors',        // Allows prototype pollution via excess properties
  'noStrictGenericChecks',               // Weakens generic type enforcement
  'keyofStringsOnly',                    // Reduces type precision
] as const;

// TypeScript versions with known security-relevant bugs
export const BLOCKED_TS_VERSIONS = [
  { range: '<4.0.0', reason: 'Missing critical type safety features' },
  { range: '4.1.0-4.1.2', reason: 'Template literal type parsing bugs' },
  { range: '<5.0.0', reason: 'Missing moduleResolution:"bundler" support' },
] as const;

// Minimum TypeScript version for this project
export const MIN_TS_VERSION = '5.6.0';

// Security-relevant file patterns to scan
export const SECURITY_SCAN_PATTERNS = {
  source: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  config: ['tsconfig.json', 'tsconfig.*.json', '.eslintrc*', 'babel.config*'],
  secrets: ['.env', '.env.*', '*.pem', '*.key', '*.cert'],
  artifacts: ['build/**', 'dist/**', 'public/**'],
} as const;

// Content Security Policy directives for the React app
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'"],   // Required for inline styles in React
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': [],
} as const;

// Rate limiting configuration for circuit breakers
export const CIRCUIT_BREAKER_CONFIG = {
  maxFailures: 5,
  resetTimeoutMs: 60_000,         // 1 minute
  halfOpenMaxRequests: 3,
  monitorIntervalMs: 10_000,      // 10 seconds
} as const;

// Memory segmentation constraints
export const MEMORY_CONSTRAINTS = {
  maxSegmentSizeBytes: 10 * 1024 * 1024,   // 10MB per segment
  maxEntriesPerSegment: 10_000,
  entryExpirationDays: 30,
  maxSegmentsPerUser: 50,
  requiredVerificationForSensitive: true,
} as const;

// Intent capsule validation rules
export const INTENT_VALIDATION = {
  maxIntentLengthChars: 4096,
  maxContextSizeBytes: 1 * 1024 * 1024,    // 1MB
  highRiskCategories: ['financial', 'system', 'destructive', 'external-api'],
  approvalTimeoutMs: 300_000,               // 5 minutes
  maxPendingCapsules: 100,
} as const;
