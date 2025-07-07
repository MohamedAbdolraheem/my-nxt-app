"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Example: After successful login, navigate to home
    router.push("/");
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-12 animate-fade-in-up flex flex-col items-center gap-8">
        {/* Logo/Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20.5A8.5 8.5 0 103.5 12a8.5 8.5 0 008.5 8.5z" /></svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-white text-center drop-shadow-xl">Login to Your Account</h1>
        <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="login-email"
              className="peer w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-transparent text-lg"
              placeholder="Email"
              required
            />
            <label htmlFor="login-email" className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-base">
              Email
            </label>
          </div>
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="login-password"
              className="peer w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-transparent text-lg"
              placeholder="Password"
              required
            />
            <label htmlFor="login-password" className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-base">
              Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.875-4.575A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.575-1.125" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.021 2.021A9.956 9.956 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 1.657.403 3.22 1.125 4.575M9.879 9.879A3 3 0 0115 12m-6 0a3 3 0 016 0m-6 0a3 3 0 006 0" /></svg>
              )}
            </button>
          </div>
          {/* Forgot password */}
          <div className="flex justify-end">
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a>
          </div>
          {/* Submit */}
          <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400">
            Login
          </button>
        </form>
      </div>
    </div>
  );
} 