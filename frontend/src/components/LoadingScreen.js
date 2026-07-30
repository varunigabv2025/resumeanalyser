import React from 'react';
import { Cpu, ShieldCheck, Terminal, Sparkles } from 'lucide-react';

const LoadingScreen = ({ progress, currentStep }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-space-950 px-4 relative overflow-hidden">
      {/* Ambient Radial Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-white/10 shadow-2xl text-center relative z-10">

        {/* Holographic Radar Sweep Animation */}
        <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping opacity-25" />
          <div className="absolute inset-2 rounded-full border border-purple-500/20" />

          {/* Rotating Radar Line */}
          <div className="absolute inset-0 rounded-full overflow-hidden border border-cyan-500/40">
            <div className="w-full h-full bg-gradient-to-tr from-cyan-500/20 via-transparent to-transparent animate-radar-sweep origin-center" />
          </div>

          {/* Central AI Core Icon */}
          <div className="relative z-10 p-4 rounded-2xl bg-space-950 border border-cyan-500/50 shadow-neon-cyan">
            <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Status Header */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <h2 className="text-xl font-heading font-extrabold text-white tracking-tight">
            SkillHive AI Core Executing
          </h2>
        </div>

        {/* Current Step Description */}
        <p className="text-cyan-400 font-mono text-sm mb-6 flex items-center justify-center space-x-2">
          <Terminal className="w-4 h-4" />
          <span>{currentStep || 'Initializing Neural Pipeline...'}</span>
        </p>

        {/* Progress Bar Container */}
        <div className="space-y-2 mb-6">
          <div className="w-full h-3 bg-space-900 rounded-full p-0.5 border border-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-neon-cyan relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 bottom-0 right-0 w-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>PIPELINE_STATUS: RUNNING</span>
            <span className="text-cyan-400 font-bold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Live Processing Badges */}
        <div className="grid grid-cols-2 gap-2 text-left pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ATS Filters Checking</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Skills Extracting</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;
