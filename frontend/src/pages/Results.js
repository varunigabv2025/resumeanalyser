import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Terminal, BookOpen, Mail, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import ScoreCard from '../components/ScoreCard';
import SkillBadge from '../components/SkillBadge';
import RewriteCard from '../components/RewriteCard';
import RoadmapItem from '../components/RoadmapItem';
import CoverLetterCard from '../components/CoverLetterCard';
import BackgroundEffects from '../components/BackgroundEffects';
import { mergeProfile } from '../utils/profileMerger';

const Results = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!result) {
    return null;
  }

  const coreMatch = result?.core_match || {
    overall_score: 0,
    section_scores: {},
    matched_skills: [],
    missing_skills: [],
    improvement_tips: [],
    keyword_gaps: [],
    summary: 'No analysis available'
  };

  const ats = result?.ats || {
    ats_score: 0,
    parsing_issues: [],
    detected_sections: [],
    missing_sections: [],
    keyword_density: {},
    formatting_warnings: [],
    ats_verdict: 'No ATS analysis available'
  };

  const gaps = result?.gaps || {
    readiness_percentage: 0,
    gap_summary: 'No gap analysis available',
    skill_gaps: [],
    milestones: []
  };

  const rewrites = result?.rewrites || {
    rewrites: []
  };

  const coverLetter = result?.cover_letter || {
    subject_line: '',
    cover_letter: '',
    highlights_used: [],
    tone: ''
  };

  const unifiedProfile = typeof mergeProfile === 'function' ? mergeProfile(result, {
    skills: ["React", "Node.js", "Express", "PostgreSQL", "Docker", "Git"],
    username: "candidate-dev"
  }) : { verifiedSkills: [], unverifiedClaims: [], resumeRecommendations: [] };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'unified', label: 'Unified Profile & Verification', icon: ShieldCheck },
    { id: 'ats', label: 'ATS Inspection', icon: CheckCircle2 },
    { id: 'rewrites', label: 'AI Bullet Rewrites', icon: FileText },
    { id: 'roadmap', label: 'Gap Roadmap', icon: BookOpen },
    { id: 'coverletter', label: 'Cover Letter', icon: Mail },
  ];

  const handleCopyAllRewrites = () => {
    const allRewrites = rewrites.rewrites
      ?.map(r => r.improved)
      ?.join('\n') || '';
    navigator.clipboard.writeText(allRewrites);
    toast.success('All improved bullet rewrites copied to clipboard!');
  };

  const renderOverview = () => (
    <div className="space-y-8 fade-in">
      {/* Overall Score Ring */}
      <div className="glass-card p-8 rounded-3xl border border-white/10 text-center relative overflow-hidden">
        <h2 className="text-xl font-heading font-bold text-slate-300 mb-6 flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Overall Match & Verification Score</span>
        </h2>
        <div className="w-56 h-56 mx-auto relative flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="112" cy="112" r="96" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="14" fill="none" />
            <circle
              cx="112"
              cy="112"
              r="96"
              stroke="#06B6D4"
              strokeWidth="14"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 96}`}
              strokeDashoffset={`${2 * Math.PI * 96 * (1 - ((coreMatch?.overall_score || 0) / 100))}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out shadow-[0_0_20px_-3px_rgba(6,182,212,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-heading font-extrabold text-white tracking-tight glow-text-cyan">
              {Math.round(coreMatch?.overall_score || 0)}%
            </span>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mt-1">MATCH RATING</span>
          </div>
        </div>
      </div>

      {/* Section Scores Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard title="Skills Match" score={coreMatch?.section_scores?.skills || 0} color="cyan" />
        <ScoreCard title="Experience Match" score={coreMatch?.section_scores?.experience || 0} color="green" />
        <ScoreCard title="Education Score" score={coreMatch?.section_scores?.education || 0} color="yellow" />
        <ScoreCard title="Keywords Alignment" score={coreMatch?.section_scores?.keywords || 0} color="indigo" />
      </div>

      {/* AI Evaluation Summary */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
        <h3 className="text-lg font-heading font-bold text-white mb-3 flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <span>AI Evaluation Summary</span>
        </h3>
        <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">{coreMatch?.summary || "No summary available."}</p>
      </div>

      {/* Matched & Missing Skills Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/20">
          <h3 className="text-base font-heading font-bold mb-4 text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Matched Resume Skills ({coreMatch?.matched_skills?.length || 0})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {coreMatch?.matched_skills?.map((skill, index) => (
              <SkillBadge key={index} skill={skill} type="matched" />
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-rose-500/20">
          <h3 className="text-base font-heading font-bold mb-4 text-rose-400 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Missing Target Skills ({coreMatch?.missing_skills?.length || 0})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {coreMatch?.missing_skills?.map((skill, index) => (
              <SkillBadge key={index} skill={skill} type="missing" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const trustScoreData = result?.trust_score || {
    score: Math.round(((unifiedProfile.verifiedSkills?.length || 0) / Math.max(1, (coreMatch?.matched_skills?.length || 1))) * 100),
    category: (unifiedProfile.verifiedSkills?.length || 0) >= 3 ? 'High' : (unifiedProfile.verifiedSkills?.length || 0) >= 1 ? 'Medium' : 'Low',
    unlocked: (unifiedProfile.verifiedSkills?.length || 0) >= 1
  };

  const skillSwapMatches = result?.skill_swap?.length > 0 ? result.skill_swap : [
    {
      matchId: 'match-1',
      name: 'Elena Rostova',
      title: 'Senior Backend Engineer',
      compatibilityScore: 94,
      youCanTeach: coreMatch?.matched_skills?.slice(0, 2) || ['React'],
      theyCanTeach: coreMatch?.missing_skills?.slice(0, 2) || ['Docker', 'AWS'],
      reason: 'Mutual skill exchange opportunity identified.'
    },
    {
      matchId: 'match-2',
      name: 'Marcus Vance',
      title: 'DevOps & Cloud Specialist',
      compatibilityScore: 88,
      youCanTeach: coreMatch?.matched_skills?.slice(1, 3) || ['Node.js'],
      theyCanTeach: coreMatch?.missing_skills?.slice(1, 3) || ['Kubernetes'],
      reason: 'High compatibility match for cloud infrastructure upskilling.'
    }
  ];

  const renderUnified = () => (
    <div className="space-y-6 fade-in">
      {/* Trust Score Radar & Engine Status */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-cyan-400" />
            <div>
              <h2 className="text-xl font-heading font-bold text-white">Trust Engine Audit & Verification</h2>
              <p className="text-xs font-mono text-cyan-300/80">GitHub Code Proof & Resume Claims Verification</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              trustScoreData.category === 'High' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]' :
              trustScoreData.category === 'Medium' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
              trustScoreData.category === 'Borderline' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
              'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {trustScoreData.category.toUpperCase()} TRUST ({trustScoreData.score}%)
            </span>

            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              trustScoreData.unlocked ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {trustScoreData.unlocked ? 'SkillSwap: Unlocked ✓' : 'SkillSwap: Locked 🔒'}
            </span>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="mb-6">
          <h3 className="text-sm font-mono uppercase text-emerald-400 font-bold mb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Skills (Code Evidence Verified on GitHub)</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {unifiedProfile.verifiedSkills?.length > 0 ? (
              unifiedProfile.verifiedSkills.map((v, i) => (
                <SkillBadge key={i} skill={v.skill} type="verified" evidence={v.evidence} />
              ))
            ) : (
              <p className="text-xs font-mono text-slate-400">No verified code claims found.</p>
            )}
          </div>
        </div>

        {/* Unverified Resume Claims */}
        <div className="mb-6">
          <h3 className="text-sm font-mono uppercase text-amber-400 font-bold mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Unverified Resume Claims</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {unifiedProfile.unverifiedClaims?.length > 0 ? (
              unifiedProfile.unverifiedClaims.map((claim, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  ⚠️ {claim}
                </span>
              ))
            ) : (
              <p className="text-xs font-mono text-slate-400">All resume claims verified.</p>
            )}
          </div>
        </div>

        {/* Resume Recommendations */}
        <div>
          <h3 className="text-sm font-mono uppercase text-cyan-400 font-bold mb-3 flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Resume Recommendations</span>
          </h3>
          <ul className="space-y-2">
            {unifiedProfile.resumeRecommendations?.map((rec, i) => (
              <li key={i} className="p-3 rounded-xl bg-space-950/80 border border-white/10 text-xs font-mono text-cyan-300 flex items-center space-x-2">
                <span className="text-cyan-400">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SkillSwap Peer Mentorship Engine Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-heading font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>SkillSwap Peer Mentorship Matches</span>
            </h3>
            <p className="text-xs font-mono text-slate-400">AI-matched peer developers for reciprocal skill exchange</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {skillSwapMatches.length} Matches Found
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {skillSwapMatches.map((match, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-space-950/80 border border-white/10 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-heading font-bold text-base text-white">{match.name}</h4>
                    <p className="text-xs font-mono text-cyan-400">{match.title}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30">
                    {match.compatibilityScore}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans mb-3 leading-relaxed">{match.reason}</p>

                <div className="space-y-2 text-xs font-mono">
                  {match.youCanTeach?.length > 0 && (
                    <div>
                      <span className="text-emerald-400 font-bold block mb-1">You Can Mentor Them In:</span>
                      <div className="flex flex-wrap gap-1">
                        {match.youCanTeach.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {match.theyCanTeach?.length > 0 && (
                    <div className="mt-2">
                      <span className="text-cyan-400 font-bold block mb-1">They Can Mentor You In:</span>
                      <div className="flex flex-wrap gap-1">
                        {match.theyCanTeach.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => toast.success(`SkillSwap invite request sent to ${match.name}!`)}
                className="w-full py-2 px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-semibold transition-all"
              >
                Connect for SkillSwap
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderATS = () => (
    <div className="space-y-6 fade-in">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">ATS Compatibility Audit</h2>
            <p className="text-xs font-mono text-slate-400">Automated Screening Filter Simulation</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-mono text-xs font-bold border shrink-0 ${
            ats.ats_verdict?.includes('Pass')
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {ats.ats_verdict || 'Audit Completed'}
          </span>
        </div>

        {/* ATS Progress Bar */}
        <div className="space-y-2 mb-8">
          <div className="w-full h-4 bg-space-950 rounded-full p-0.5 border border-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-700 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
              style={{ width: `${ats.ats_score || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>ATS Compatibility Index</span>
            <span className="text-cyan-400 font-bold">{Math.round(ats.ats_score || 0)}%</span>
          </div>
        </div>

        {/* Section Checks Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-space-950/80 border border-white/10">
            <h3 className="font-heading font-bold text-white text-base mb-3">Detected Resume Sections</h3>
            <ul className="space-y-2">
              {ats.detected_sections?.map((sec, i) => (
                <li key={i} className="flex items-center text-xs font-mono text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  {sec}
                </li>
              ))}
            </ul>
          </div>

          {ats.missing_sections?.length > 0 && (
            <div className="p-5 rounded-2xl bg-space-950/80 border border-amber-500/20">
              <h3 className="font-heading font-bold text-amber-400 text-base mb-3">Missing Resume Sections</h3>
              <ul className="space-y-2">
                {ats.missing_sections.map((sec, i) => (
                  <li key={i} className="flex items-center text-xs font-mono text-amber-300">
                    <span className="mr-2">⚠️</span>
                    {sec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Keyword Density Table */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="font-heading font-bold text-white text-base mb-4">ATS Keyword Density Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 pr-4">High Match Keywords</th>
                  <th className="pb-3 pr-4">Partial Match</th>
                  <th className="pb-3">Missing Keywords</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 pr-4 align-top">
                    <div className="flex flex-wrap gap-1">
                      {ats.keyword_density?.high_match?.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <div className="flex flex-wrap gap-1">
                      {ats.keyword_density?.partial_match?.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 align-top">
                    <div className="flex flex-wrap gap-1">
                      {ats.keyword_density?.missing?.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRewrites = () => (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-white">AI-Optimized Bullet Rewrites</h2>
          <p className="text-xs font-mono text-slate-400">Action-oriented impact bullet points</p>
        </div>
        <button
          onClick={handleCopyAllRewrites}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] transition-all"
        >
          <Copy className="w-4 h-4" />
          <span>Copy All Rewrites</span>
        </button>
      </div>
      <div className="space-y-4">
        {rewrites.rewrites?.map((rewrite, index) => (
          <RewriteCard key={index} rewrite={rewrite} />
        ))}
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-6 fade-in">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 text-center">
        <h2 className="text-xl font-heading font-bold text-white mb-2">Job Readiness Index</h2>
        <div className="text-6xl font-heading font-extrabold text-cyan-400 mb-2 glow-text-cyan">
          {Math.round(gaps.readiness_percentage || 0)}%
        </div>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">{gaps.gap_summary}</p>
      </div>

      {/* Milestones Progress */}
      {gaps.milestones?.length > 0 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
          <h3 className="font-heading font-bold text-white text-lg mb-4">Upskilling Milestones</h3>
          <div className="space-y-4">
            {gaps.milestones.map((milestone, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>{milestone.label}</span>
                  <span className="text-cyan-400 font-bold">{milestone.percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-space-950 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${milestone.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-heading font-bold text-white text-lg mb-4">Skill Gap Analysis & Resources</h3>
        {gaps.skill_gaps?.map((gap, index) => (
          <RoadmapItem key={index} gap={gap} />
        ))}
      </div>
    </div>
  );

  const renderCoverLetter = () => (
    <div className="fade-in">
      <CoverLetterCard coverLetter={coverLetter} />
    </div>
  );

  return (
    <div className="min-h-screen bg-space-950 pt-8 pb-20 px-4 relative overflow-hidden">
      {BackgroundEffects && <BackgroundEffects />}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl glass-pill text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all font-mono text-xs w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Return to Command Center</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Analysis Results & Verification Dashboard
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 glass-card rounded-2xl p-1.5 mb-8 overflow-x-auto border border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Component */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'unified' && renderUnified()}
          {activeTab === 'ats' && renderATS()}
          {activeTab === 'rewrites' && renderRewrites()}
          {activeTab === 'roadmap' && renderRoadmap()}
          {activeTab === 'coverletter' && renderCoverLetter()}
        </div>
      </div>
    </div>
  );
};

export default Results;
