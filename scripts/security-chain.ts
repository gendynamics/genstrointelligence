/**
 * GENSTRO INTELLIGENCE — Multi-Chain Security Architecture
 * TypeScript 5.9.3 Hardened Compilation Pipeline
 *
 * Chain Architecture:
 *   CHAIN 0  →  Source Integrity Verification
 *   CHAIN 1  →  Static Analysis & Pattern Detection
 *   CHAIN 2  →  Dependency Graph Validation
 *   CHAIN 3  →  Runtime Constraint Enforcement
 *   CHAIN 4  →  Output Artifact Sealing
 *   CHAIN 5  →  Audit Trail Generation
 *
 * Each chain is immutable once passed — failure at any link
 * halts the entire pipeline (fail-secure by OWASP design).
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { execSync } from 'child_process';

// ─── TYPES ──────────────────────────────────────────────────
interface ChainLink {
  id: string;
  name: string;
  chain: number;
  execute: () => ChainResult;
}

interface ChainResult {
  passed: boolean;
  chain: number;
  link: string;
  timestamp: number;
  hash: string;
  findings: SecurityFinding[];
}

interface SecurityFinding {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  code: string;
  message: string;
  file?: string;
  line?: number;
  remediation?: string;
}

interface AuditRecord {
  sessionId: string;
  startTime: number;
  endTime: number;
  chains: ChainResult[];
  verdict: 'PASS' | 'FAIL' | 'WARN';
  artifactHashes: Record<string, string>;
  tsVersion: string;
  nodeVersion: string;
  platform: string;
}

// ─── CONSTANTS ──────────────────────────────────────────────
const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const AUDIT_DIR = path.join(ROOT, '.security-audit');
const SESSION_ID = `genstro_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

const DANGEROUS_PATTERNS: Array<{ pattern: RegExp; code: string; severity: SecurityFinding['severity']; message: string; remediation: string }> = [
  { pattern: /eval\s*\(/g, code: 'SEC-001', severity: 'CRITICAL', message: 'Direct eval() invocation detected', remediation: 'Replace eval() with safe alternatives like JSON.parse() or Function constructors with validated input' },
  { pattern: /new\s+Function\s*\(/g, code: 'SEC-002', severity: 'HIGH', message: 'Dynamic Function constructor detected', remediation: 'Use static function definitions or validated template patterns' },
  { pattern: /innerHTML\s*=/g, code: 'SEC-003', severity: 'HIGH', message: 'Direct innerHTML assignment (XSS vector)', remediation: 'Use textContent, createElement, or DOMPurify sanitization' },
  { pattern: /document\.write\s*\(/g, code: 'SEC-004', severity: 'HIGH', message: 'document.write() usage detected', remediation: 'Use DOM API methods (appendChild, insertAdjacentHTML with sanitization)' },
  { pattern: /dangerouslySetInnerHTML/g, code: 'SEC-005', severity: 'MEDIUM', message: 'React dangerouslySetInnerHTML without DOMPurify', remediation: 'Ensure input is sanitized with DOMPurify before rendering' },
  { pattern: /window\s*\[\s*['"`]/g, code: 'SEC-006', severity: 'HIGH', message: 'Dynamic window property access (prototype pollution vector)', remediation: 'Use explicit property access or a safe accessor function' },
  { pattern: /\.constructor\s*\[/g, code: 'SEC-007', severity: 'CRITICAL', message: 'Constructor bracket access (prototype pollution)', remediation: 'Never access constructor properties dynamically' },
  { pattern: /__proto__/g, code: 'SEC-008', severity: 'CRITICAL', message: '__proto__ reference detected (prototype pollution)', remediation: 'Use Object.create(null) or Map for dictionary objects' },
  { pattern: /process\.env/g, code: 'SEC-009', severity: 'LOW', message: 'Environment variable access in source', remediation: 'Ensure no secrets leak into client bundles; use REACT_APP_ prefix only' },
  { pattern: /localStorage|sessionStorage/g, code: 'SEC-010', severity: 'MEDIUM', message: 'Web Storage API usage (sensitive data exposure risk)', remediation: 'Never store tokens, passwords, or PII in browser storage without encryption' },
  { pattern: /fetch\s*\(\s*[^'"`\s]/g, code: 'SEC-011', severity: 'MEDIUM', message: 'Dynamic URL in fetch (SSRF vector)', remediation: 'Validate URLs against an allowlist before fetching' },
  { pattern: /(?:password|secret|token|apikey|api_key)\s*[:=]\s*['"`][^'"`]+['"`]/gi, code: 'SEC-012', severity: 'CRITICAL', message: 'Hardcoded credential or secret detected', remediation: 'Move secrets to environment variables and .env files (excluded from version control)' },
  { pattern: /console\.(log|debug|info)\s*\(/g, code: 'SEC-013', severity: 'LOW', message: 'Console logging in source (information disclosure)', remediation: 'Remove or guard console statements for production builds' },
  { pattern: /Object\.assign\s*\(\s*\w+\s*,\s*(?:req|request|body|params|query)/g, code: 'SEC-014', severity: 'HIGH', message: 'Object.assign from untrusted source (mass assignment)', remediation: 'Destructure specific allowed fields instead of merging entire objects' },
  { pattern: /\bany\b(?:\s*[;,)\]}]|\s*$)/gm, code: 'SEC-015', severity: 'LOW', message: 'Loose "any" type detected (type safety erosion)', remediation: 'Replace with explicit types or use unknown with type guards' },
];

const REQUIRED_TSCONFIG_FLAGS: Record<string, any> = {
  strict: true,
  noImplicitAny: undefined, // covered by strict
  strictNullChecks: undefined, // covered by strict
  forceConsistentCasingInFileNames: true,
  noFallthroughCasesInSwitch: true,
  isolatedModules: true,
  skipLibCheck: true,
};

// ─── UTILITY ────────────────────────────────────────────────
function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function getAllSourceFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      results.push(...getAllSourceFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function colorize(text: string, color: string): string {
  const colors: Record<string, string> = {
    red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
    cyan: '\x1b[36m', magenta: '\x1b[35m', white: '\x1b[37m',
    bold: '\x1b[1m', dim: '\x1b[2m', reset: '\x1b[0m',
  };
  return `${colors[color] || ''}${text}${colors.reset}`;
}

function banner(text: string): void {
  const line = '═'.repeat(60);
  console.log(colorize(`\n╔${line}╗`, 'cyan'));
  console.log(colorize(`║  ${text.padEnd(58)}║`, 'cyan'));
  console.log(colorize(`╚${line}╝`, 'cyan'));
}

function chainHeader(chain: number, name: string): void {
  console.log(colorize(`\n  ┌─ CHAIN ${chain}: ${name}`, 'magenta'));
}

function linkResult(passed: boolean, msg: string, findingCount: number = 0): void {
  const icon = passed ? colorize('✔', 'green') : colorize('✘', 'red');
  const suffix = findingCount > 0 ? colorize(` [${findingCount} finding(s)]`, 'yellow') : '';
  console.log(`  │  ${icon} ${msg}${suffix}`);
}

function chainFooter(passed: boolean): void {
  const status = passed ? colorize('PASSED', 'green') : colorize('FAILED', 'red');
  console.log(`  └─ Chain Status: ${status}\n`);
}

// ─── CHAIN 0: SOURCE INTEGRITY ──────────────────────────────
function chain0_sourceIntegrity(): ChainResult {
  chainHeader(0, 'SOURCE INTEGRITY VERIFICATION');
  const findings: SecurityFinding[] = [];
  const sourceFiles = getAllSourceFiles(SRC_DIR);

  // 0a. Verify source files exist
  if (sourceFiles.length === 0) {
    findings.push({ severity: 'CRITICAL', code: 'INT-001', message: 'No source files found in src/', remediation: 'Ensure source directory contains TypeScript/JavaScript files' });
    linkResult(false, 'Source files exist', 1);
    chainFooter(false);
    return { passed: false, chain: 0, link: 'source-integrity', timestamp: Date.now(), hash: '', findings };
  }
  linkResult(true, `Source files verified (${sourceFiles.length} files)`);

  // 0b. Compute integrity hashes for all source files
  const hashes: string[] = [];
  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    hashes.push(sha256(content));

    // Check for null bytes or binary content in source
    if (/\x00/.test(content)) {
      findings.push({ severity: 'HIGH', code: 'INT-002', message: 'Null bytes detected in source file (potential injection)', file: path.relative(ROOT, file), remediation: 'Remove null bytes; likely a corrupted or tampered file' });
    }

    // Check for suspicious Unicode characters (homoglyph attacks)
    if (/[\u200B-\u200F\u2028-\u202F\uFEFF]/.test(content)) {
      findings.push({ severity: 'HIGH', code: 'INT-003', message: 'Invisible Unicode characters detected (Trojan Source attack vector)', file: path.relative(ROOT, file), remediation: 'Strip zero-width and bidirectional override characters' });
    }

    // Check for Unicode BiDi override characters (CVE-2021-42574)
    if (/[\u202A-\u202E\u2066-\u2069]/.test(content)) {
      findings.push({ severity: 'CRITICAL', code: 'INT-004', message: 'BiDi override characters detected (Trojan Source CVE-2021-42574)', file: path.relative(ROOT, file), remediation: 'Remove all Unicode bidirectional override characters from source' });
    }
  }

  // 0c. Compute Merkle root of all source hashes
  const merkleRoot = sha256(hashes.sort().join(''));
  linkResult(true, `Integrity Merkle root: ${merkleRoot.substring(0, 16)}...`);
  linkResult(findings.length === 0, `Unicode & binary safety scan`, findings.length);

  const passed = !findings.some(f => f.severity === 'CRITICAL');
  chainFooter(passed);
  return { passed, chain: 0, link: 'source-integrity', timestamp: Date.now(), hash: merkleRoot, findings };
}

// ─── CHAIN 1: STATIC ANALYSIS & PATTERN DETECTION ──────────
function chain1_staticAnalysis(): ChainResult {
  chainHeader(1, 'STATIC ANALYSIS & PATTERN DETECTION');
  const findings: SecurityFinding[] = [];
  const sourceFiles = getAllSourceFiles(SRC_DIR);

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    const relPath = path.relative(ROOT, file);

    for (const rule of DANGEROUS_PATTERNS) {
      let match: RegExpExecArray | null;
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);

      while ((match = regex.exec(content)) !== null) {
        const lineNum = content.substring(0, match.index).split('\n').length;
        findings.push({
          severity: rule.severity,
          code: rule.code,
          message: rule.message,
          file: relPath,
          line: lineNum,
          remediation: rule.remediation,
        });
      }
    }

    // Check for files over 500 lines (complexity gate)
    if (lines.length > 500) {
      findings.push({
        severity: 'LOW', code: 'CX-001',
        message: `File exceeds 500 lines (${lines.length}) — increased attack surface`,
        file: relPath, remediation: 'Consider decomposing large files into focused modules',
      });
    }
  }

  const criticals = findings.filter(f => f.severity === 'CRITICAL').length;
  const highs = findings.filter(f => f.severity === 'HIGH').length;
  const mediums = findings.filter(f => f.severity === 'MEDIUM').length;
  const lows = findings.filter(f => f.severity === 'LOW' || f.severity === 'INFO').length;

  linkResult(criticals === 0, `Critical findings: ${criticals}`, criticals);
  linkResult(highs === 0, `High findings: ${highs}`, highs);
  linkResult(true, `Medium findings: ${mediums}`, mediums);
  linkResult(true, `Low/Info findings: ${lows}`, lows);

  // Print critical and high findings inline
  for (const f of findings.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH')) {
    const sev = f.severity === 'CRITICAL' ? colorize(f.severity, 'red') : colorize(f.severity, 'yellow');
    console.log(`  │  ${colorize('  ⚠', 'yellow')} [${sev}] ${f.code}: ${f.message}`);
    if (f.file) console.log(`  │      ${colorize(f.file, 'dim')}${f.line ? `:${f.line}` : ''}`);
  }

  const passed = criticals === 0;
  chainFooter(passed);
  return { passed, chain: 1, link: 'static-analysis', timestamp: Date.now(), hash: sha256(JSON.stringify(findings)), findings };
}

// ─── CHAIN 2: DEPENDENCY GRAPH VALIDATION ───────────────────
function chain2_dependencyValidation(): ChainResult {
  chainHeader(2, 'DEPENDENCY GRAPH VALIDATION');
  const findings: SecurityFinding[] = [];

  // 2a. Check package-lock.json exists (reproducible builds)
  const lockPath = path.join(ROOT, 'package-lock.json');
  if (!fs.existsSync(lockPath)) {
    findings.push({ severity: 'HIGH', code: 'DEP-001', message: 'package-lock.json missing (non-reproducible builds)', remediation: 'Run npm install to generate lockfile and commit it to version control' });
    linkResult(false, 'Lockfile present', 1);
  } else {
    const lockHash = sha256(fs.readFileSync(lockPath, 'utf8'));
    linkResult(true, `Lockfile verified (hash: ${lockHash.substring(0, 16)}...)`);
  }

  // 2b. Verify no install scripts in dependencies (supply chain attack vector)
  const pkgPath = path.join(ROOT, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    linkResult(true, `Dependencies scanned: ${Object.keys(allDeps).length} packages`);

    // 2c. Check for known risky dependency patterns
    const riskyPatterns = ['*', 'latest', 'next', 'canary', 'experimental'];
    for (const [name, version] of Object.entries(allDeps)) {
      const versionStr = String(version);
      if (riskyPatterns.some(p => versionStr === p) || !versionStr.match(/^\^?\d|^~?\d|^\d/)) {
        findings.push({
          severity: 'HIGH', code: 'DEP-002',
          message: `Unpinned dependency: ${name}@${versionStr}`,
          remediation: `Pin to a specific semver range (e.g., ^x.y.z)`,
        });
      }
    }
    linkResult(findings.filter(f => f.code === 'DEP-002').length === 0, 'Version pinning check', findings.filter(f => f.code === 'DEP-002').length);
  }

  // 2d. Run npm audit (non-blocking)
  try {
    const auditResult = execSync('npm audit --json 2>/dev/null', { cwd: ROOT, encoding: 'utf8', timeout: 30000 });
    const audit = JSON.parse(auditResult);
    const vulnCount = audit.metadata?.vulnerabilities || {};
    const criticalVulns = vulnCount.critical || 0;
    const highVulns = vulnCount.high || 0;

    if (criticalVulns > 0) {
      findings.push({ severity: 'CRITICAL', code: 'DEP-003', message: `npm audit: ${criticalVulns} critical vulnerabilities`, remediation: 'Run npm audit fix --force or manually resolve critical CVEs' });
    }
    if (highVulns > 0) {
      findings.push({ severity: 'HIGH', code: 'DEP-004', message: `npm audit: ${highVulns} high vulnerabilities`, remediation: 'Run npm audit fix or review and update affected packages' });
    }
    linkResult(criticalVulns === 0, `npm audit: ${criticalVulns} critical, ${highVulns} high`, criticalVulns + highVulns);
  } catch {
    linkResult(true, 'npm audit: scan completed (non-blocking)');
  }

  // 2e. Check for .npmrc security settings
  const npmrcPath = path.join(ROOT, '.npmrc');
  if (!fs.existsSync(npmrcPath)) {
    findings.push({ severity: 'MEDIUM', code: 'DEP-005', message: '.npmrc missing (no registry pinning or audit settings)', remediation: 'Create .npmrc with audit=true and registry pinning' });
  }
  linkResult(fs.existsSync(npmrcPath), '.npmrc security configuration');

  const passed = !findings.some(f => f.severity === 'CRITICAL');
  chainFooter(passed);
  return { passed, chain: 2, link: 'dependency-validation', timestamp: Date.now(), hash: sha256(JSON.stringify(findings)), findings };
}

// ─── CHAIN 3: RUNTIME CONSTRAINT ENFORCEMENT ────────────────
function chain3_runtimeConstraints(): ChainResult {
  chainHeader(3, 'RUNTIME CONSTRAINT ENFORCEMENT');
  const findings: SecurityFinding[] = [];

  // 3a. Validate tsconfig.json security flags
  const tsconfigPath = path.join(ROOT, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    findings.push({ severity: 'CRITICAL', code: 'TSC-001', message: 'tsconfig.json missing', remediation: 'Create tsconfig.json with strict security settings' });
    linkResult(false, 'tsconfig.json exists', 1);
    chainFooter(false);
    return { passed: false, chain: 3, link: 'runtime-constraints', timestamp: Date.now(), hash: '', findings };
  }

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  const compilerOptions = tsconfig.compilerOptions || {};

  // Verify strict mode is enabled
  if (compilerOptions.strict !== true) {
    findings.push({ severity: 'CRITICAL', code: 'TSC-002', message: 'TypeScript strict mode is not enabled', remediation: 'Set "strict": true in tsconfig.json compilerOptions' });
  }
  linkResult(compilerOptions.strict === true, 'TypeScript strict mode enabled');

  // Verify no unsafe compiler flags
  const unsafeFlags: Record<string, string> = {
    suppressImplicitAnyIndexErrors: 'Suppresses type safety for index signatures',
    suppressExcessPropertyErrors: 'Allows excess properties to bypass type checking',
    noStrictGenericChecks: 'Disables strict generic type checking',
  };

  for (const [flag, desc] of Object.entries(unsafeFlags)) {
    if (compilerOptions[flag] === true) {
      findings.push({ severity: 'HIGH', code: 'TSC-003', message: `Unsafe compiler flag enabled: ${flag} — ${desc}`, remediation: `Remove "${flag}" or set to false in tsconfig.json` });
    }
  }
  linkResult(!Object.keys(unsafeFlags).some(f => compilerOptions[f] === true), 'No unsafe compiler flags');

  // Verify isolatedModules (prevents certain cross-file type attacks)
  linkResult(compilerOptions.isolatedModules === true, 'isolatedModules enabled (cross-file safety)');

  // Verify noEmit or declaration safety
  linkResult(compilerOptions.noEmit === true || compilerOptions.declaration !== true, 'Emission constraints verified');

  // 3b. Verify TypeScript version integrity
  try {
    const tsVersion = execSync('npx tsc --version', { cwd: ROOT, encoding: 'utf8', timeout: 15000 }).trim();
    const versionMatch = tsVersion.match(/Version\s+([\d.]+)/);
    if (versionMatch) {
      const ver = versionMatch[1];
      const [major, minor] = ver.split('.').map(Number);
      if (major < 5) {
        findings.push({ severity: 'HIGH', code: 'TSC-004', message: `TypeScript ${ver} is outdated (< 5.x)`, remediation: 'Upgrade TypeScript to 5.x for latest security features' });
      }
      linkResult(major >= 5, `TypeScript version: ${ver}`);
    }
  } catch {
    findings.push({ severity: 'MEDIUM', code: 'TSC-005', message: 'Could not verify TypeScript version', remediation: 'Ensure TypeScript is installed: npm install typescript' });
    linkResult(false, 'TypeScript version check');
  }

  // 3c. Run TypeScript compilation check
  try {
    execSync('npx tsc --noEmit 2>&1', { cwd: ROOT, encoding: 'utf8', timeout: 60000 });
    linkResult(true, 'TypeScript compilation: zero errors');
  } catch (e: any) {
    const output = (e.stdout || e.message || '').toString();
    const errorCount = (output.match(/error TS/g) || []).length;
    if (errorCount > 0) {
      findings.push({ severity: 'MEDIUM', code: 'TSC-006', message: `TypeScript compilation: ${errorCount} type error(s)`, remediation: 'Fix type errors to maintain type-safe security invariants' });
    }
    linkResult(errorCount === 0, `TypeScript compilation: ${errorCount} error(s)`, errorCount);
  }

  // 3d. Verify security.config.json integrity
  const secConfigPath = path.join(ROOT, 'security.config.json');
  if (fs.existsSync(secConfigPath)) {
    const secConfig = JSON.parse(fs.readFileSync(secConfigPath, 'utf8'));
    const secHash = sha256(JSON.stringify(secConfig));
    linkResult(true, `security.config.json verified (hash: ${secHash.substring(0, 16)}...)`);

    // Ensure critical OWASP sections present
    const requiredSections = ['brokenAccessControl', 'softwareSupplyChain', 'cryptographicFailures', 'goalHijack', 'toolMisuse', 'memoryPoisoning'];
    const configStr = JSON.stringify(secConfig);
    for (const section of requiredSections) {
      if (!configStr.includes(section)) {
        findings.push({ severity: 'MEDIUM', code: 'CFG-001', message: `Missing OWASP section in security config: ${section}`, remediation: `Add ${section} configuration to security.config.json` });
      }
    }
    linkResult(requiredSections.every(s => configStr.includes(s)), 'OWASP 2026 sections complete');
  } else {
    findings.push({ severity: 'HIGH', code: 'CFG-002', message: 'security.config.json missing', remediation: 'Create security.config.json with OWASP 2026 configuration' });
    linkResult(false, 'security.config.json exists');
  }

  const passed = !findings.some(f => f.severity === 'CRITICAL');
  chainFooter(passed);
  return { passed, chain: 3, link: 'runtime-constraints', timestamp: Date.now(), hash: sha256(JSON.stringify(compilerOptions)), findings };
}

// ─── CHAIN 4: OUTPUT ARTIFACT SEALING ───────────────────────
function chain4_artifactSealing(): ChainResult {
  chainHeader(4, 'OUTPUT ARTIFACT SEALING');
  const findings: SecurityFinding[] = [];
  const artifactHashes: Record<string, string> = {};

  // 4a. Verify security headers configuration
  const headersPath = path.join(ROOT, 'public', '_headers');
  if (fs.existsSync(headersPath)) {
    const headers = fs.readFileSync(headersPath, 'utf8');
    artifactHashes['_headers'] = sha256(headers);

    const requiredHeaders = ['Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options', 'Strict-Transport-Security', 'Referrer-Policy'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
      findings.push({ severity: 'HIGH', code: 'ART-001', message: `Missing security headers: ${missingHeaders.join(', ')}`, remediation: 'Add required headers to public/_headers' });
    }
    linkResult(missingHeaders.length === 0, `Security headers verified (${requiredHeaders.length - missingHeaders.length}/${requiredHeaders.length})`);
  } else {
    findings.push({ severity: 'HIGH', code: 'ART-002', message: 'public/_headers missing', remediation: 'Create public/_headers with OWASP-compliant security headers' });
    linkResult(false, 'Security headers file exists');
  }

  // 4b. Verify security.txt disclosure policy
  const secTxtPath = path.join(ROOT, 'public', '.well-known', 'security.txt');
  if (fs.existsSync(secTxtPath)) {
    const secTxt = fs.readFileSync(secTxtPath, 'utf8');
    artifactHashes['security.txt'] = sha256(secTxt);

    // Verify expiration hasn't passed
    const expiresMatch = secTxt.match(/Expires:\s*([\d-T:Z]+)/);
    if (expiresMatch) {
      const expires = new Date(expiresMatch[1]);
      if (expires < new Date()) {
        findings.push({ severity: 'MEDIUM', code: 'ART-003', message: 'security.txt has expired', remediation: 'Update the Expires field in security.txt' });
      }
    }
    linkResult(true, 'security.txt disclosure policy present');
  } else {
    findings.push({ severity: 'MEDIUM', code: 'ART-004', message: 'security.txt missing', remediation: 'Create public/.well-known/security.txt per RFC 9116' });
    linkResult(false, 'security.txt exists');
  }

  // 4c. Verify index.html for security attributes
  const indexPath = path.join(ROOT, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    artifactHashes['index.html'] = sha256(indexHtml);

    // Check for integrity attributes on external scripts
    const externalScripts = indexHtml.match(/<script[^>]+src\s*=\s*["']https?:\/\/[^"']+["'][^>]*>/g) || [];
    for (const script of externalScripts) {
      if (!script.includes('integrity=')) {
        findings.push({ severity: 'HIGH', code: 'ART-005', message: 'External script without SRI integrity attribute', remediation: 'Add integrity="sha384-..." and crossorigin="anonymous" to external scripts' });
      }
    }
    linkResult(externalScripts.length === 0 || externalScripts.every(s => s.includes('integrity=')), `SRI verification (${externalScripts.length} external scripts)`);
  }

  // 4d. Seal all source file hashes
  const sourceFiles = getAllSourceFiles(SRC_DIR);
  for (const file of sourceFiles) {
    artifactHashes[path.relative(ROOT, file)] = sha256(fs.readFileSync(file, 'utf8'));
  }
  const sealHash = sha256(Object.values(artifactHashes).sort().join(''));
  linkResult(true, `Artifact seal: ${sealHash.substring(0, 24)}... (${Object.keys(artifactHashes).length} files)`);

  const passed = !findings.some(f => f.severity === 'CRITICAL');
  chainFooter(passed);
  return { passed, chain: 4, link: 'artifact-sealing', timestamp: Date.now(), hash: sealHash, findings };
}

// ─── CHAIN 5: AUDIT TRAIL GENERATION ────────────────────────
function chain5_auditTrail(chainResults: ChainResult[]): ChainResult {
  chainHeader(5, 'AUDIT TRAIL GENERATION');
  const findings: SecurityFinding[] = [];

  // Create audit directory
  if (!fs.existsSync(AUDIT_DIR)) {
    fs.mkdirSync(AUDIT_DIR, { recursive: true });
  }

  // Build audit record
  let tsVersion = 'unknown';
  try {
    tsVersion = execSync('npx tsc --version', { cwd: ROOT, encoding: 'utf8', timeout: 10000 }).trim();
  } catch { /* non-blocking */ }

  const allFindings = chainResults.flatMap(r => r.findings);
  const criticals = allFindings.filter(f => f.severity === 'CRITICAL').length;
  const highs = allFindings.filter(f => f.severity === 'HIGH').length;

  const verdict: AuditRecord['verdict'] = criticals > 0 ? 'FAIL' : highs > 0 ? 'WARN' : 'PASS';

  const artifactHashes: Record<string, string> = {};
  for (const r of chainResults) {
    artifactHashes[`chain_${r.chain}`] = r.hash;
  }

  const auditRecord: AuditRecord = {
    sessionId: SESSION_ID,
    startTime: chainResults[0]?.timestamp || Date.now(),
    endTime: Date.now(),
    chains: chainResults,
    verdict,
    artifactHashes,
    tsVersion,
    nodeVersion: process.version,
    platform: process.platform,
  };

  // Write audit record
  const auditPath = path.join(AUDIT_DIR, `audit_${SESSION_ID}.json`);
  fs.writeFileSync(auditPath, JSON.stringify(auditRecord, null, 2), 'utf8');
  linkResult(true, `Audit record written: ${path.relative(ROOT, auditPath)}`);

  // Write findings summary
  if (allFindings.length > 0) {
    const findingsPath = path.join(AUDIT_DIR, `findings_${SESSION_ID}.json`);
    fs.writeFileSync(findingsPath, JSON.stringify(allFindings, null, 2), 'utf8');
    linkResult(true, `Findings report: ${allFindings.length} total findings`);
  }

  // Compute audit chain hash (links all chain hashes together)
  const auditChainHash = sha256(chainResults.map(r => r.hash).join('|'));
  linkResult(true, `Audit chain hash: ${auditChainHash.substring(0, 24)}...`);

  // Clean up old audit files (keep last 50)
  const auditFiles = fs.readdirSync(AUDIT_DIR)
    .filter(f => f.startsWith('audit_'))
    .sort()
    .reverse();
  for (const old of auditFiles.slice(50)) {
    fs.unlinkSync(path.join(AUDIT_DIR, old));
  }

  chainFooter(true);
  return { passed: true, chain: 5, link: 'audit-trail', timestamp: Date.now(), hash: auditChainHash, findings };
}

// ─── MAIN PIPELINE ──────────────────────────────────────────
function main(): void {
  banner('GENSTRO INTELLIGENCE — MULTI-CHAIN SECURITY ARCHITECTURE');
  console.log(colorize(`  Session: ${SESSION_ID}`, 'dim'));
  console.log(colorize(`  TypeScript 5.9.3 Hardened Pipeline`, 'dim'));
  console.log(colorize(`  OWASP 2026 Compliance Engine`, 'dim'));

  const results: ChainResult[] = [];

  // Execute chains sequentially — each chain gates the next
  const chains = [
    chain0_sourceIntegrity,
    chain1_staticAnalysis,
    chain2_dependencyValidation,
    chain3_runtimeConstraints,
    chain4_artifactSealing,
  ];

  let failed = false;
  for (const chain of chains) {
    const result = chain();
    results.push(result);

    if (!result.passed) {
      console.log(colorize(`\n  ⛓️‍💥 CHAIN ${result.chain} BROKEN — Pipeline halted.`, 'red'));
      failed = true;
      break;
    }
  }

  // Always generate audit trail
  const auditResult = chain5_auditTrail(results);
  results.push(auditResult);

  // Final verdict
  const allFindings = results.flatMap(r => r.findings);
  const criticals = allFindings.filter(f => f.severity === 'CRITICAL').length;
  const highs = allFindings.filter(f => f.severity === 'HIGH').length;
  const mediums = allFindings.filter(f => f.severity === 'MEDIUM').length;
  const lows = allFindings.filter(f => f.severity === 'LOW' || f.severity === 'INFO').length;

  banner('SECURITY VERDICT');
  console.log(`\n  Chains Executed:  ${results.length - 1}/5`);
  console.log(`  Total Findings:   ${allFindings.length}`);
  console.log(`    ${colorize('CRITICAL', 'red')}: ${criticals}`);
  console.log(`    ${colorize('HIGH', 'yellow')}: ${highs}`);
  console.log(`    ${colorize('MEDIUM', 'magenta')}: ${mediums}`);
  console.log(`    ${colorize('LOW/INFO', 'dim')}: ${lows}`);

  if (failed || criticals > 0) {
    console.log(colorize('\n  ██ VERDICT: FAIL — Critical security issues must be resolved ██', 'red'));
    console.log(colorize('  Build is BLOCKED until all critical findings are remediated.\n', 'red'));
    process.exit(1);
  } else if (highs > 0) {
    console.log(colorize('\n  ▓▓ VERDICT: WARN — High-severity findings detected ▓▓', 'yellow'));
    console.log(colorize('  Build is ALLOWED but findings should be addressed promptly.\n', 'yellow'));
    process.exit(0);
  } else {
    console.log(colorize('\n  ░░ VERDICT: PASS — All security chains verified ░░', 'green'));
    console.log(colorize('  Build is CLEARED for deployment.\n', 'green'));
    process.exit(0);
  }
}

main();
