import React, { useState } from 'react';
import { Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RewriteCard = ({ rewrite }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrite.improved);
    setCopied(true);
    toast.success('Improved bullet copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 transition-all duration-300 hover:border-cyan-500/40">

      {/* Original Bullet */}
      <div className="p-3 rounded-xl bg-space-950/70 border border-white/5 text-slate-400 text-sm font-sans flex items-start space-x-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase shrink-0 mt-0.5">
          BEFORE
        </span>
        <p className="line-through decoration-rose-500/60 leading-relaxed">{rewrite.original}</p>
      </div>

      {/* Improved AI Bullet */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/30 text-slate-100 font-medium text-sm flex items-start justify-between space-x-3 shadow-neon-emerald">
        <div className="flex items-start space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase shrink-0 mt-0.5 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>AI REWRITE</span>
          </span>
          <p className="leading-relaxed text-emerald-100">{rewrite.improved}</p>
        </div>

        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-all border border-emerald-500/40 shrink-0"
          title="Copy bullet"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* AI Reasoning */}
      {rewrite.reason && (
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400/80 pt-1">
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          <span>Rationale: {rewrite.reason}</span>
        </div>
      )}
    </div>
  );
};

export default RewriteCard;
