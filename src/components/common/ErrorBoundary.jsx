import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('StudyFlow Uncaught Error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-base-200">
          <div className="card w-full max-w-lg bg-base-100 shadow-2xl border border-error/20 p-8 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Something unexpected happened</h2>
            <p className="text-base-content/70 mb-6 text-sm">
              We ran into an issue rendering this screen. Your study sessions and tasks are safe in your storage.
            </p>
            {this.state.error?.message && (
              <div className="bg-base-200 p-3 rounded-lg text-xs font-mono text-left mb-6 text-error overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={this.handleReload} className="btn btn-primary gap-2">
                <FiRefreshCw /> Reload Page
              </button>
              <a href="/dashboard" className="btn btn-ghost gap-2">
                <FiHome /> Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
