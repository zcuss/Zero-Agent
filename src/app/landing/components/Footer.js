"use client";

export default function Footer() {
  return (
    <footer className="border-t border-[#3a2f27] bg-[#120f0d] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative size-6 rounded bg-[#050b14] flex items-center justify-center text-cyan-100 ring-1 ring-cyan-300/35 overflow-hidden">
                <span className="font-black text-[14px] leading-none tracking-[-0.12em] pr-0.5">Z</span>
                <span className="absolute right-1 top-1 h-4 w-[2px] rotate-[28deg] rounded-full bg-cyan-300/85" />
              </div>
              <h3 className="text-white text-lg font-bold">Zero Agent</h3>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              Dark developer control plane for AI infrastructure. Connect, route, and operate providers from one endpoint.
            </p>
            <div className="flex gap-4">
              <a className="text-gray-400 hover:text-white transition-colors" href="https://github.com/decolua/zero-agent" target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined">code</span>
              </a>
            </div>
          </div>
          
          {/* Product */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white">Product</h4>
            <a className="text-gray-400 hover:text-[#f97815] text-sm transition-colors" href="#features">Features</a>
            <a className="text-gray-400 hover:text-[#f97815] text-sm transition-colors" href="/dashboard">Dashboard</a>
            <a className="text-gray-400 hover:text-cyan-300 text-sm transition-colors" href="https://github.com/decolua/zero-agent" target="_blank" rel="noopener noreferrer">Changelog</a>
          </div>
          
          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white">Resources</h4>
            <a className="text-gray-400 hover:text-cyan-300 text-sm transition-colors" href="https://github.com/decolua/zero-agent#readme" target="_blank" rel="noopener noreferrer">Documentation</a>
            <a className="text-gray-400 hover:text-cyan-300 text-sm transition-colors" href="https://github.com/decolua/zero-agent" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-gray-400 hover:text-cyan-300 text-sm transition-colors" href="https://www.npmjs.com/package/zero-agent" target="_blank" rel="noopener noreferrer">NPM</a>
          </div>
          
          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white">Legal</h4>
            <a className="text-gray-400 hover:text-cyan-300 text-sm transition-colors" href="https://github.com/decolua/zero-agent/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-[#3a2f27] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© 2026 Zero Agent. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-gray-600 hover:text-white text-sm transition-colors" href="https://github.com/decolua/zero-agent" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-gray-600 hover:text-white text-sm transition-colors" href="https://www.npmjs.com/package/zero-agent" target="_blank" rel="noopener noreferrer">NPM</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

