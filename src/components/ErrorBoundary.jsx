import { Component } from 'react';
import warningIcon from '../assets/icons/warning.svg';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
            <div className="mb-4 flex justify-center">
              <img src={warningIcon} alt="Warning" className="w-16 h-16" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-4">
              An unexpected error occurred. This has been logged to the console.
            </p>

            {this.state.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-left break-all">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}