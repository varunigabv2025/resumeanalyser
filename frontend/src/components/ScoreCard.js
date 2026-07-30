import React from 'react';

const ScoreCard = ({ title, score, color = 'cyan' }) => {
  const colorStyles = {
    indigo: {
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      glow: 'shadow-[0_0_20px_-3px_rgba(59,130,246,0.4)]',
      stroke: '#3B82F6'
    },
    green: {
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)]',
      stroke: '#10B981'
    },
    yellow: {
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_20px_-3px_rgba(245,158,11,0.4)]',
      stroke: '#F59E0B'
    },
    red: {
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      glow: 'shadow-[0_0_20px_-3px_rgba(244,63,94,0.4)]',
      stroke: '#F43F5E'
    },
    cyan: {
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)]',
      stroke: '#06B6D4'
    }
  };

  const currentStyle = colorStyles[color] || colorStyles.cyan;
  const roundedScore = Math.round(score || 0);

  return (
    <div className={`glass-card p-5 rounded-2xl border ${currentStyle.border} transition-all duration-300 hover:scale-[1.03] flex items-center justify-between`}>
      <div>
        <p className="text-xs font-mono tracking-wider text-slate-400 uppercase mb-1">{title}</p>
        <p className={`text-3xl font-heading font-extrabold ${currentStyle.text}`}>
          {roundedScore}<span className="text-lg text-slate-400 font-normal">%</span>
        </p>
      </div>

      {/* Mini Circular Meter */}
      <div className={`relative w-14 h-14 rounded-full flex items-center justify-center bg-space-950/80 ${currentStyle.glow}`}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r="22"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="28"
            cy="28"
            r="22"
            stroke={currentStyle.stroke}
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - roundedScore / 100)}`}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default ScoreCard;
