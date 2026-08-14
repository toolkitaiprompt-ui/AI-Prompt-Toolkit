import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Catches uncaught render errors so a single broken tool/page can't blank the
 * whole SPA. Wrapped around the routed content in Layout — the header, footer,
 * and navigation stay usable while the content area shows a recovery prompt.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="site-container section-lg">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              An unexpected error occurred while rendering this page. Your other tools and prompts are unaffected.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
