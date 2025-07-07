import Image from "next/image";

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20.5A8.5 8.5 0 103.5 12a8.5 8.5 0 008.5 8.5z" /></svg>
    ),
    title: "Modern UI",
    desc: "Beautiful, glassmorphic design with smooth animations."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    title: "Lightning Fast",
    desc: "Optimized for speed and performance with Next.js."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" /></svg>
    ),
    title: "Secure",
    desc: "Best practices for authentication and data protection."
  }
];

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-x-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse -translate-x-1/2" />
        <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
      </div>
      {/* Hero Card */}
      <section className="relative z-10 flex flex-col items-center gap-8 px-4 pt-24 sm:pt-32">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col items-center gap-6 max-w-2xl w-full animate-fade-in-up">
          <Image
            className="dark:invert drop-shadow-lg"
            src="/next.svg"
            alt="App logo"
            width={80}
            height={18}
            priority
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center drop-shadow-xl">
            Elevate Your Web Experience
          </h1>
          <p className="text-lg sm:text-2xl text-white/90 text-center max-w-xl">
            A stunning, modern starter built with Next.js, Tailwind CSS, and glassmorphism. Not your average template—crafted for impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full justify-center">
            <a
              href="/about"
              className="px-8 py-3 rounded-full bg-white/90 text-blue-700 font-bold text-lg shadow-lg transition border-2 border-white/80 hover:scale-105 active:scale-95 duration-150 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Learn More
            </a>
            <a
              href="/contact-us"
              className="px-8 py-3 rounded-full bg-white/20 text-white font-bold text-lg shadow-lg transition border-2 border-white/20 hover:scale-105 active:scale-95 duration-150 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="relative z-10 w-full max-w-4xl mx-auto mt-16 px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-3 bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30 animate-fade-in-up" style={{animationDelay: `${0.1 + i * 0.1}s`}}>
              <div className="mb-2">{f.icon}</div>
              <h3 className="text-xl font-bold text-white text-center">{f.title}</h3>
              <p className="text-white/90 text-center text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="relative z-10 w-full text-center text-white/70 py-6 text-sm border-t border-white/20 bg-gradient-to-t from-black/10 to-transparent">
        &copy; {new Date().getFullYear()} My Next.js App. Crafted with passion.
      </footer>
      {/* Animations */}
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
