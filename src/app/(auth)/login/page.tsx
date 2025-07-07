import type { Metadata } from "next";
import React from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | My Next.js App",
  description: "Login to access your account in My Next.js App.",
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-x-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl animate-pulse -translate-x-1/2" />
        <div className="absolute right-0 bottom-0 w-[200px] h-[200px] bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
      </div>
      <section className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 min-h-screen w-full">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col items-center gap-6 max-w-md w-full animate-fade-in-up">
          <LoginForm />
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