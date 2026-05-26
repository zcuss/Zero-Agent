"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#020617]/75 backdrop-blur-md border-b border-cyan-400/15">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
          onClick={() => router.push("/")}
          aria-label="Navigate to home"
        >
          <div className="relative size-8 rounded-lg bg-[#050b14] flex items-center justify-center text-cyan-100 ring-1 ring-cyan-300/35 shadow-[0_0_20px_-6px_rgba(34,211,238,.8)] overflow-hidden">
            <span className="font-black text-[18px] leading-none tracking-[-0.12em] pr-0.5">Z</span>
            <span className="absolute right-1.5 top-1.5 h-5 w-[3px] rotate-[28deg] rounded-full bg-cyan-300/85" />
          </div>
          <h2 className="text-cyan-50 text-xl font-bold tracking-tight">Zero Agent</h2>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <a className="text-slate-300 hover:text-cyan-50 text-sm font-medium transition-colors" href="#features">Features</a>
          <a className="text-slate-300 hover:text-cyan-50 text-sm font-medium transition-colors" href="#how-it-works">How it Works</a>
          <a className="text-slate-300 hover:text-cyan-50 text-sm font-medium transition-colors" href="https://github.com/decolua/zero-agent#readme" target="_blank" rel="noopener noreferrer">Docs</a>
          <a className="text-slate-300 hover:text-cyan-50 text-sm font-medium transition-colors flex items-center gap-1" href="https://github.com/decolua/zero-agent" target="_blank" rel="noopener noreferrer">
            GitHub <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>

        {/* CTA + Mobile menu */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/dashboard")}
            className="hidden sm:flex h-9 items-center justify-center rounded-lg px-4 bg-cyan-400 hover:bg-cyan-300 transition-all text-slate-950 text-sm font-bold shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:shadow-[0_0_24px_rgba(34,211,238,0.55)]"
          >
            Open Console
          </button>
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3a2f27] bg-[#181411]/95 backdrop-blur-md">
          <div className="flex flex-col gap-4 p-6">
            <a className="text-gray-300 hover:text-white text-sm font-medium transition-colors" href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a className="text-gray-300 hover:text-white text-sm font-medium transition-colors" href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a className="text-gray-300 hover:text-white text-sm font-medium transition-colors" href="https://github.com/decolua/9router#readme" target="_blank" rel="noopener noreferrer">Docs</a>
            <a className="text-gray-300 hover:text-white text-sm font-medium transition-colors" href="https://github.com/decolua/9router" target="_blank" rel="noopener noreferrer">GitHub</a>
            <button 
              onClick={() => router.push("/dashboard")}
              className="h-9 rounded-lg bg-[#f97815] hover:bg-[#e0650a] text-[#181411] text-sm font-bold"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

