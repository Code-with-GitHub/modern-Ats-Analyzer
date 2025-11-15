import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, GoogleIcon, GithubIcon, MicrosoftIcon } from './icons';
import { AuthIllustration } from './Illustrations';

interface SignupPageProps {
  onSignup: (name: string) => void;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          username, 
          email, 
          password 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        onSignup(data.user.firstName || data.user.email);
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Google signup button onClick
  const handleGoogleSignup = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  window.location.href = `${apiUrl}/api/auth/google`;
};

  // GitHub signup button onClick
  const handleGithubSignup = () => {
     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/api/auth/github`;
  };

  const inputClass = "appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100";

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-900 lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-slate-100">Create your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
              Welcome! Please fill in the details to get started.
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
                  onClick={handleGithubSignup}
                  aria-label="Sign up with GitHub" 
                  className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <GithubIcon className="w-6 h-6 text-gray-800 dark:text-slate-200" />
                </button>
                <button 
                  onClick={handleGoogleSignup}
                  aria-label="Sign up with Google" 
                  className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <GoogleIcon className="w-6 h-6" />
                </button>
                 <button 
                  aria-label="Sign up with Microsoft" 
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="flex justify-between text-sm font-medium text-gray-700 dark:text-slate-300">
                    <span>First name</span>
                    <span className="text-gray-400">Optional</span>
                  </label>
                  <div className="mt-1">
                    <input 
                      id="first-name" 
                      name="first-name" 
                      type="text" 
                      autoComplete="given-name" 
                      className={inputClass} 
                      placeholder="First name" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="flex justify-between text-sm font-medium text-gray-700 dark:text-slate-300">
                    <span>Last name</span>
                    <span className="text-gray-400">Optional</span>
                  </label>
                  <div className="mt-1">
                    <input 
                      id="last-name" 
                      name="last-name" 
                      type="text" 
                      autoComplete="family-name" 
                      className={inputClass} 
                      placeholder="Last name" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Username
                </label>
                <div className="mt-1">
                  <input 
                    id="username" 
                    name="username" 
                    type="text" 
                    autoComplete="username" 
                    required 
                    className={inputClass} 
                    placeholder="Your username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
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
                    className={inputClass} 
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
                    autoComplete="new-password" 
                    required 
                    className={inputClass} 
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
                  {loading ? 'Creating account...' : 'Continue ▸'}
                </button>
              </div>
            </form>
            
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Sign in
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

export default SignupPage;
