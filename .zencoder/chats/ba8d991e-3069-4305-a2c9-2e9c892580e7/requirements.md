# Product Requirements Document (PRD)

## Feature: Deliah AI V2 - Merged LLM Core

### Overview
Genstro Intelligence currently has a virtual AI guide named **Deliah**. The goal is to upgrade Deliah with "superpower" abilities by integrating a multi-LLM orchestration layer (symbolically merging Kimi 2.5, Grok Pro, and Claude 2.6). This will transform Deliah from a static guide into a fully interactive AI agent capable of assisting with cybersecurity operations and building features.

### Objectives
- Upgrade **Deliah** from a static guide with hardcoded tips to a real-time AI assistant.
- Implement a chat interface that allows users to interact with the "merged LLM core".
- Provide advanced cybersecurity insights and automation through the chat.
- Maintain the 3D/2D visual character of Deliah while adding these new capabilities.

### Requirements

#### 1. Real-time Chat Interface
- A text input field should be added to the Deliah component.
- The chat history should be persistent (session-based) or at least maintain context during navigation.
- Deliah should respond using a "merged" personality of the requested models.

#### 2. LLM Orchestration (Proxy Layer)
- A backend or middleware should handle requests to LLM providers.
- If actual API keys are not provided, a robust mock/simulation mode should be implemented for development.
- The system should be designed to switch between models or use an ensemble approach.

#### 3. Cybersecurity Capabilities
- Deliah should have access to site-specific context (Red Team, Blue Team, Quantum security states).
- Deliah should be able to suggest security hardening steps based on `security.config.json`.

#### 4. UI/UX
- Keep the existing 3D avatar and "portal" aesthetic.
- The chat bubble should expand to accommodate a scrollable conversation.
- Typing animations should be preserved and enhanced.

### Success Criteria
- Deliah can respond to arbitrary user queries in real-time.
- The UI remains responsive and follows the existing design language.
- The integration is secure and follows the project's strict security guidelines (OWASP 2026).

### Assumptions & Constraints
- We will use the existing React architecture.
- We will assume a backend service or a secure server-side function will be created to handle LLM calls.
- The "merge" of models is a high-level integration/orchestration concept.
