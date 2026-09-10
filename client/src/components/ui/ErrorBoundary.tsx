import { Component, type ReactNode } from 'react';

/**
 * Minimal error boundary. Renders `fallback` if a child throws during render,
 * so one heavy/experimental section can never take the page down.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError?: (e: unknown) => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error);

    if (import.meta.env.DEV) console.error('[ErrorBoundary]', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
