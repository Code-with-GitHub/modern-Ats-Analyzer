import React, { useState, useCallback } from 'react';
import { AuthState } from './types';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import LandingPage from './components/LandingPage';
import ResumeAnalyzerPage from './components/ResumeAnalyzerPage.jsx'

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGGED_OUT);
  const [user, setUser] = useState<{ name: string } | null>(null);

  const handleLogin = useCallback((name: string) => {
    setUser({ name });
    setAuthState(AuthState.LOGGED_IN);
  }, []);

  const handleLogout = useCallback(() => {
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