import React, { useState } from 'react';
import { GoogleIcon, GithubIcon, EyeIcon, EyeOffIcon, MicrosoftIcon } from './icons';
import { AuthIllustration } from './Illustrations';

interface LoginPageProps {
  onLogin: (name: string) => void;
  onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    // ✅ FIXED - Change to login endpoint
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      onLogin(data.user.firstName || data.user.email);
    } else {
      setError(data.error || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    setError('Network error. Please check your connection.');
  } finally {
    setLoading(false);
  }
};
  // Google login button onClick
  const handleGoogleLogin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  window.location.href = `${apiUrl}/api/auth/google`;
  };

  // GitHub login button onClick
  const handleGithubLogin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  window.location.href = `${apiUrl}/api/auth/github`;
  };
  
  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-900 lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
           <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-slate-100">Sign in to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
              Welcome back! Please enter your details.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="mt-8">
            <div className="flex justify-center gap-4">
                <button 
                  onClick={handleGithubLogin}
                  aria-label="Sign in with GitHub" 
                  className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <GithubIcon className="w-6 h-6 text-gray-800 dark:text-slate-200" />
                </button>
                <button 
                  onClick={handleGoogleLogin}
                  aria-label="Sign in with Google" 
                  className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <GoogleIcon className="w-6 h-6" />
                </button>
                 <button 
                  aria-label="Sign in with Microsoft" 
                  className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors opacity-50 cursor-not-allowed"
                  disabled
                >
                    <MicrosoftIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-slate-900 px-2 text-gray-500 dark:text-slate-400">or</span>
                </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button 
                      type="button" 
                      onClick={() => setPasswordVisible(!passwordVisible)} 
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                      {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Continue ▸'}
                </button>
              </div>
            </form>
            
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
              Don't have an account?{' '}
              <button onClick={onSwitchToSignup} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 p-8">
        <AuthIllustration />
      </div>
    </div>
  );
};

export default LoginPage;