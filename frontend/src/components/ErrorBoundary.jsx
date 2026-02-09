import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("UI ErrorBoundary:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="glass rounded-3xl p-6 max-w-xl w-full">
          <div className="text-2xl font-semibold">Something crashed</div>
          <div className="mt-2 text-sm opacity-80">
            A UI error occurred. Refresh the page. If it continues, check console logs.
          </div>
          <pre className="mt-4 text-xs opacity-70 overflow-auto max-h-60">
            {String(this.state.error?.message || this.state.error || "")}
          </pre>
          <button
            className="mt-5 btn-primary rounded-2xl px-4 py-3 font-medium hover:opacity-90"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}
