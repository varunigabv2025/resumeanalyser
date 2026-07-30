import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, History, Sparkles, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-neon-cyan transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-space-950 rounded-[11px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  SkillHive<span className="text-cyan-400">.AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide hidden sm:block">
                Developer Intelligence Engine
              </p>
            </div>
          </Link>

          {/* System Status Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full glass-pill border border-emerald-500/30 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-medium tracking-wide">SYSTEM ONLINE</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Trust Core Active
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === '/'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Command Center</span>
            </Link>

            <Link
              to="/history"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === '/history'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <History className="w-4 h-4 text-purple-400" />
              <span>Analysis Logs</span>
            </Link>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
