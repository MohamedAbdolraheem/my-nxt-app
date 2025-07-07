import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About | My Next.js App",
  description: "Learn more about My Next.js App.",
};

export default function About() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-x-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl animate-pulse -translate-x-1/2" />
        <div className="absolute right-0 bottom-0 w-[200px] h-[200px] bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
      </div>
      <section className="relative z-10 flex flex-col items-center gap-8 px-4 pt-24 sm:pt-32">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col items-center gap-6 max-w-xl w-full animate-fade-in-up">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20.5A8.5 8.5 0 103.5 12a8.5 8.5 0 008.5 8.5z" /></svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-xl">About Us</h1>
          <p className="text-lg sm:text-xl text-white/90 text-center max-w-lg">
            We are passionate about building beautiful, performant web apps. This project showcases a modern stack and design system, crafted for developers who want more than the default.
          </p>
        </div>
      </section>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </main>
  );
} 