import React from 'react';

// Last-resort net: without this, an uncaught render error anywhere in the
// tree unmounts the whole app and leaves a blank white page with nothing
// but a console trace to explain it.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Uncaught render error:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-background text-foreground">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Something broke</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">This page hit a snag.</h1>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
            className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
          >
            Back to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
