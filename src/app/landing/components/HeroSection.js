"use client";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-400/12 rounded-full blur-[130px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center gap-8">
        {/* Version badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1 text-xs font-medium text-cyan-200">
          <span className="flex h-2 w-2 rounded-full bg-cyan-300 animate-pulse"></span>
          Zero Agent Console
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
          Dark Control Plane <br/>
          <span className="text-cyan-300">for AI Infrastructure</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
          One endpoint, one dashboard. Route requests, manage providers, monitor usage, quotas, and proxy pools — built for CLI-first developer workflows.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <a
            href="/dashboard"
            className="h-12 px-8 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-base font-bold transition-all shadow-[0_0_22px_rgba(34,211,238,0.35)] flex items-center gap-2"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            Open Console
          </a>
          <a 
            href="https://github.com/decolua/zero-agent" 
            target="_blank" 
            rel="noopener noreferrer"
            className="h-12 px-8 rounded-xl border border-cyan-300/25 bg-transparent hover:bg-cyan-300/10 text-white text-base font-bold transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">code</span>
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

