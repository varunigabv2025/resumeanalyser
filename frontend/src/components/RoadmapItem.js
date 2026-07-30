import React from 'react';
import { ExternalLink, Clock, Target } from 'lucide-react';

const RoadmapItem = ({ gap }) => {
  const priorityStyles = {
    High: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]',
    Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]',
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]',
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-white/10 mb-4 transition-all duration-300 hover:border-purple-500/40">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-purple-400" />
          <h4 className="font-heading font-bold text-lg text-white">{gap.skill}</h4>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${priorityStyles[gap.priority] || priorityStyles.Medium
          }`}>
          {gap.priority} Priority
        </span>
      </div>

      <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-4">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span>Estimated Mastery Time: {gap.estimated_time || '1-2 weeks'}</span>
      </div>

      {gap.resources && gap.resources.length > 0 && (
        <div className="pt-3 border-t border-white/10 space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Curated Learning Resources:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {gap.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-space-950/80 border border-white/10 flex items-center justify-between text-xs text-cyan-300 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group"
              >
                <span className="truncate">{resource.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapItem;
