"use client";
import { useRouter } from "next/navigation";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import FlowAnimation from "./components/FlowAnimation";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import GetStarted from "./components/GetStarted";
import Footer from "./components/Footer";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="relative text-white font-sans overflow-x-hidden antialiased selection:bg-cyan-400/30 selection:text-cyan-50">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: `linear-gradient(to right, rgba(34,211,238,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,.35) 1px, transparent 1px)`,
          backgroundSize: '42px 42px'
        }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,.18),transparent_34%),radial-gradient(circle_at_80%_35%,rgba(59,130,246,.16),transparent_38%),linear-gradient(180deg,rgba(2,6,23,.2),#020617)]" />
        <div className="absolute top-[-160px] left-1/4 w-[760px] h-[760px] bg-cyan-400/12 rounded-full blur-[150px] animate-blob"></div>
        <div className="absolute bottom-[-180px] right-1/4 w-[680px] h-[680px] bg-blue-500/12 rounded-full blur-[150px] animate-blob" style={{ animationDelay: '3s', animationDuration: '24s' }}></div>
      </div>

      <div className="relative z-10">
        <Navigation />
        
        <main>
          <div className="relative">
            <HeroSection />
            <div className="flex justify-center pb-20">
              <FlowAnimation />
            </div>
          </div>
        
          <GetStarted />
          <HowItWorks />
          <Features />
        
          <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-t from-cyan-400/10 to-transparent pointer-events-none"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Run Your AI Infrastructure Like a Pro?</h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Zero Agent gives developers a dark command center for providers, endpoints, usage, quotas, proxy pools, and CLI integrations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto h-14 px-10 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-lg font-bold transition-all shadow-[0_0_28px_rgba(34,211,238,0.45)]"
                >
                  Open Console
                </button>
                <button 
                  onClick={() => router.push("/dashboard/providers")}
                  className="w-full sm:w-auto h-14 px-10 rounded-xl border border-cyan-300/25 hover:bg-cyan-300/10 text-cyan-50 text-lg font-bold transition-all"
                >
                  Configure Providers
                </button>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
      
      {/* Global styles for keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        @keyframes blob {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
          }
          33% { 
            transform: translate(30px, -50px) scale(1.1);
          }
          66% { 
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

