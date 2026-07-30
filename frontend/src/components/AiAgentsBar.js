import React from 'react';
import { FileText, GitBranch, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

const AiAgentsBar = () => {
  const agents = [
    {
      name: 'Resume Agent',
      icon: FileText,
      status: 'ACTIVE SCANNING',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
      indicatorBg: 'bg-cyan-400'
    },
    {
      name: 'GitHub Agent',
      icon: GitBranch,
      status: 'SYNCHRONIZING',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/30',
      indicatorBg: 'bg-blue-400'
    },
    {
      name: 'Verification Engine',
      icon: ShieldCheck,
      status: 'ONLINE',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      indicatorBg: 'bg-emerald-400'
    },
    {
      name: 'Trust Engine',
      icon: Cpu,
      status: 'READY',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30',
      indicatorBg: 'bg-purple-400'
    },
    {
      name: 'SkillSwap Engine',
      icon: RefreshCw,
      status: 'ACTIVE PAIRING',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      indicatorBg: 'bg-amber-400'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-8">
      <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <h3 className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
              Autonomous AI Agent Grid
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/80">
            5 / 5 AGENTS OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <div
                key={index}
                className={`p-3 rounded-xl border ${agent.bg} flex items-center space-x-3 transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className={`p-2 rounded-lg bg-space-950/80 border border-white/10 ${agent.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-heading font-semibold text-slate-200 truncate">
                    {agent.name}
                  </p>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${agent.indicatorBg} animate-pulse`} />
                    <span className={`text-[10px] font-mono font-medium tracking-tight ${agent.color}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AiAgentsBar;
