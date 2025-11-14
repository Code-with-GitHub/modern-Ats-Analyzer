import React, { useState, useCallback, useEffect } from 'react';
import { AuthState } from './types';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import LandingPage from './components/LandingPage';
import ResumeAnalyzerPage from './components/ResumeAnalyzerPage.jsx';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGGED_OUT);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW: Check for token in URL (OAuth redirect) or localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check URL for token (from OAuth redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
          console.log('✅ Token found in URL');
          localStorage.setItem('token', tokenFromUrl);
          // Remove token from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Check localStorage for existing token
        const token = localStorage.getItem('token');

        if (token) {
          console.log('✅ Token found, fetching user data...');
          
          // Verify token and get user info
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            console.log('✅ User authenticated:', data.user);
            setUser({ name: data.user.firstName || data.user.email });
            setAuthState(AuthState.LOGGED_IN);
          } else {
            console.log('❌ Token invalid, clearing...');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = useCallback((name: string) => {
    setUser({ name });
    setAuthState(AuthState.LOGGED_IN);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthState(AuthState.LOGGED_OUT);
  }, []);

  const handleGetStarted = useCallback(() => {
    setAuthState(AuthState.SIGNUP);
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setAuthState(AuthState.LOGIN);
  }, []);

  const handleSwitchToSignup = useCallback(() => {
    setAuthState(AuthState.SIGNUP);
  }, []);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (authState === AuthState.LOGGED_IN && user) {
      return <ResumeAnalyzerPage user={user} onLogout={handleLogout} />;
    }
    
    switch (authState) {
      case AuthState.SIGNUP:
        return <SignupPage onSignup={handleLogin} onSwitchToLogin={handleSwitchToLogin} />;
      case AuthState.LOGIN:
        return <LoginPage onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />;
      case AuthState.LOGGED_OUT:
      default:
        return <LandingPage 
          onGetStarted={handleGetStarted}
          onLogin={handleSwitchToLogin}
          onSignup={handleSwitchToSignup}
        />;
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default App;