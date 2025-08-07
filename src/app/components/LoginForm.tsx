"use client";
import React, { useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
      });

      if (error) {
        console.error('Login error:', error);
        setError(error.message);
        return;
      }

      if (data.user) {
        console.log('Login successful - User:', data.user.email, 'Session:', !!data.session);
        // Use router.push for client-side navigation
        router.push('/dashboard');
        router.refresh(); // Refresh to ensure server components get updated session
      } else {
        setError('Login failed - no user data received');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center drop-shadow-xl mb-6">Welcome Back</h1>
      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="login-email"
            className="peer w-full px-4 pt-6 pb-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-transparent text-lg"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <label htmlFor="login-email" className="absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-base">
            Email
          </label>
        </div>
        
        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="login-password"
            className="peer w-full px-4 pt-6 pb-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-transparent text-lg"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <label htmlFor="login-password" className="absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-base">
            Password
          </label>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 focus:outline-none transition-colors"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={loading}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.875-4.575A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.575-1.125" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.021 2.021A9.956 9.956 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 1.657.403 3.22 1.125 4.575M9.879 9.879A3 3 0 0115 12m-6 0a3 3 0 016 0m-6 0a3 3 0 006 0" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Forgot password */}
        <div className="flex justify-end">
          <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors">
            Forgot password?
          </a>
        </div>
        
        {/* Error */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}
        
        {/* Submit */}
        <button 
          type="submit" 
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
        
        {/* Sign up link */}
        <div className="text-center mt-4">
          <span className="text-slate-600 dark:text-slate-400">Don&apos;t have an account? </span>
          <a href="/sigin" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium hover:underline transition-colors">
            Sign up
          </a>
        </div>
      </form>
    </>
  );
} 