import React, { Component, ErrorInfo, ReactNode } from 'react';

// OWASP 2026: Mishandling of Exceptional Conditions
// Fail securely - never expose internal details

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  errorId: string;
}

export class SecureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate a unique error ID for tracking without exposing details
    const errorId = `SEC_ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log error securely (never expose to client)
    console.error(`Security Error ID: ${errorId} - Internal error occurred`);

    return { hasError: true, errorId };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Secure logging - never expose stack traces or internal details
    const secureLog = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      componentStack: this.sanitizeStackTrace(errorInfo.componentStack || ''),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In production, this would be sent to a secure logging service
    console.log('Secure Error Log:', JSON.stringify(secureLog, null, 2));
  }

  private sanitizeStackTrace(stackTrace: string): string {
    // Remove sensitive information from stack trace
    return stackTrace
      .replace(/file:\/\/[^\s]*/g, '[FILE_PATH]')
      .replace(/\/Users\/[^\/\s]*/g, '[USER_PATH]')
      .replace(/\/home\/[^\/\s]*/g, '[USER_PATH]')
      .replace(/\d+\.\d+\.\d+\.\d+/g, '[IP_ADDRESS]');
  }

  render() {
    if (this.state.hasError) {
      // Secure fallback UI - never expose error details
      return this.props.fallback || (
        React.createElement('div', { className: 'error-boundary', role: 'alert' },
          React.createElement('div', { className: 'error-container' },
            React.createElement('h2', null, 'Access Error'),
            React.createElement('p', null, 'An unexpected error occurred. Our security team has been notified.'),
            React.createElement('p', { className: 'error-reference' }, `Reference: ${this.state.errorId}`),
            React.createElement('button', {
              onClick: () => window.location.reload(),
              className: 'error-retry-btn'
            }, 'Retry')
          )
        )
      );
    }

    return this.props.children;
  }
}

// Hook for secure error handling
export const useSecureErrorHandler = () => {
  return (error: Error, context?: string) => {
    const errorId = `SEC_ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.error(`Secure Error [${errorId}]:`, context || 'Unknown context');

    // In production, send to secure logging service
    // Never expose error details to user

    return errorId;
  };
};