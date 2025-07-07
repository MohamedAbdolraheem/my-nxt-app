"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Example: After successful sign in, navigate to home
    router.push("/");
  };

  return (
    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="relative">
        <input
          type="email"
          id="signin-email"
          className="peer w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-transparent"
          placeholder="Email"
          required
        />
        <label htmlFor="signin-email" className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
          Email
        </label>
      </div>
      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="signin-password"
          className="peer w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-transparent"
          placeholder="Password"
          required
        />
        <label htmlFor="signin-password" className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
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
      {/* Submit */}
      <button type="submit" className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400">
        Sign In
      </button>
    </form>
  );
} 