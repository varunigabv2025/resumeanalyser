import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const SkillBadge = ({ skill, type = 'matched', evidence }) => {
  const isMatched = type === 'matched';
  const isVerified = type === 'verified';

  if (isVerified) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] transition-transform hover:scale-105">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>{skill}</span>
        {evidence && <span className="text-[10px] text-cyan-400/70 font-normal">({evidence})</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200 hover:scale-105 ${
        isMatched
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
          : 'bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]'
      }`}
    >
      {isMatched ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
      )}
      <span>{skill}</span>
    </span>
  );
};

export default SkillBadge;
