import React, { useState } from 'react';
import { sharedMockProfiles } from '../data/sharedMockProfiles';
import { mergeProfile } from '../utils/profileMerger';
import { Cpu, ArrowRight } from 'lucide-react';
import SkillBadge from './SkillBadge';

const SharedProfilesExplorer = ({ onSelectProfile }) => {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Process profiles through profileMerger
  const processedProfiles = sharedMockProfiles.map((item, index) => {
    const merged = mergeProfile(item.resumeAnalysis, item.githubAnalysis);

    // Calculate expected trust category based on verification ratio
    const verifiedCount = merged.verifiedSkills.length;
    const totalClaims = (item.resumeAnalysis.core_match?.matched_skills || []).length;
    const ratio = totalClaims > 0 ? (verifiedCount / totalClaims) : 0;

    let trustCategory = 'High';
    let trustColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (ratio < 0.4) {
      trustCategory = 'Low';
      trustColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    } else if (ratio < 0.65) {
      trustCategory = 'Borderline';
      trustColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else if (ratio < 0.85) {
      trustCategory = 'Medium';
      trustColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }

    return {
      index,
      raw: item,
      unified: merged,
      trustCategory,
      trustColor,
      verificationRatio: Math.round(ratio * 100)
    };
  });

  const filtered = processedProfiles.filter(p => {
    const matchesSearch = p.unified.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.unified.user.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'ALL' || p.trustCategory.toUpperCase() === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-12">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-heading font-extrabold text-white">
                SkillBridge AI Unified Profile Explorer
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Interactive team dataset containing pre-configured developer profiles & SkillSwap pairs
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['ALL', 'HIGH', 'MEDIUM', 'BORDERLINE', 'LOW'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${filterCategory === cat
                  ? 'bg-cyan-500 text-space-950 shadow-neon-cyan'
                  : 'bg-space-950 text-slate-400 hover:text-white border border-white/10'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search developer by name or role (e.g. Full Stack, AI, DevOps)..."
            className="w-full px-4 py-3 rounded-xl bg-space-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono text-sm"
          />
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => {
            const { unified, trustCategory, trustColor, raw } = item;
            return (
              <div
                key={item.index}
                className="glass-card-hover p-5 rounded-2xl border border-white/10 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading font-bold text-base text-white">{unified.user.name}</h3>
                      <p className="text-xs font-mono text-cyan-400">{unified.user.title}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border ${trustColor}`}>
                      {trustCategory} Trust
                    </span>
                  </div>

                  {/* Skills Highlights */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                        Verified Skills ({unified.verifiedSkills.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {unified.verifiedSkills.slice(0, 3).map((v, i) => (
                          <SkillBadge key={i} skill={v.skill} type="verified" />
                        ))}
                        {unified.verifiedSkills.length > 3 && (
                          <span className="text-[10px] font-mono text-cyan-400/80 self-center">
                            +{unified.verifiedSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {unified.unverifiedClaims.length > 0 && (
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                          Unverified Claims ({unified.unverifiedClaims.length}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {unified.unverifiedClaims.slice(0, 2).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inspect Profile CTA */}
                <button
                  onClick={() => onSelectProfile && onSelectProfile(raw.resumeAnalysis)}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold flex items-center justify-center space-x-2 transition-all group mt-2 shadow-neon-cyan"
                >
                  <span>Load Full Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default SharedProfilesExplorer;
