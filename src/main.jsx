import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Google OAuth Client ID
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "904970452532-9crhq195hbo8ei1u39ae0f1jfk0kt83p.apps.googleusercontent.com";

// Error boundary for Google OAuth
class GoogleOAuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Google OAuth Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600">
            There was a problem with Google Sign-In. Please try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthErrorBoundary>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </GoogleOAuthErrorBoundary>
  </React.StrictMode>,
)

