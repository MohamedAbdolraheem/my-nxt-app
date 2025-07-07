import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Contact Us | My Next.js App",
  description: "Contact us for more information about My Next.js App.",
};

export default function ContactUs() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-x-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl animate-pulse -translate-x-1/2" />
        <div className="absolute right-0 bottom-0 w-[200px] h-[200px] bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
      </div>
      <section className="relative z-10 flex flex-col items-center gap-8 px-4 pt-24 sm:pt-32">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col items-center gap-6 max-w-xl w-full animate-fade-in-up">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900 mb-2">
            <svg className="w-8 h-8 text-pink-600 dark:text-pink-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.34V6.5A2.5 2.5 0 0018.5 4h-13A2.5 2.5 0 003 6.5v11A2.5 2.5 0 005.5 20h13a2.5 2.5 0 002.5-2.5v-3.84l-4.12-2.35a2.5 2.5 0 00-2.38 0L12 13.5l-1.5-.84a2.5 2.5 0 00-2.38 0L4 15.66" /></svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-xl">Contact Us</h1>
          <p className="text-lg sm:text-xl text-white/90 text-center max-w-lg">
  Have questions or want to work with us? Reach out and we&apos;ll get back to you as soon as possible.
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
