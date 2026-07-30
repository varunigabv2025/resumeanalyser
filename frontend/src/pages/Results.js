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

  const unifiedProfile = mergeProfile ? mergeProfile(result, {
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
      .map(r => r.improved)
      .join('\n');
    navigator.clipboard.writeText(allRewrites);
    toast.success('All improved bullet rewrites copied to clipboard!');
  };

  const renderOverview = () => (
    <div className="space-y-8 fade-in">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard title="Skills Match" score={coreMatch?.section_scores?.skills || 0} color="cyan" />
        <ScoreCard title="Experience Match" score={coreMatch?.section_scores?.experience || 0} color="green" />
        <ScoreCard title="Education Score" score={coreMatch?.section_scores?.education || 0} color="yellow" />
        <ScoreCard title="Keywords Alignment" score={coreMatch?.section_scores?.keywords || 0} color="indigo" />
      </div>
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
        <h3 className="text-lg font-heading font-bold text-white mb-3 flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <span>AI Evaluation Summary</span>
        </h3>
        <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">{coreMatch?.summary || "No summary available."}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/20">
          <h3 className="text-base font-heading font-bold mb-4 text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Matched Resume Skills ({coreMatch?.matched_skills?.length || 0})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {coreMatch?.matched_skills?.map((skill, index) => <SkillBadge key={index} skill={skill} type="matched" />)}
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-rose-500/20">
          <h3 className="text-base font-heading font-bold mb-4 text-rose-400 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Missing Target Skills ({coreMatch?.missing_skills?.length || 0})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {coreMatch?.missing_skills?.map((skill, index) => <SkillBadge key={index} skill={skill} type="missing" />)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUnified = () => (
    <div className="space-y-6 fade-in">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-xl font-heading font-bold text-white">Unified Profile Layer</h2>
            <p className="text-xs font-mono text-cyan-300/80">Aggregated resume analysis & GitHub code evidence</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-mono uppercase text-emerald-400 font-bold mb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Skills</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {unifiedProfile.verifiedSkills?.length > 0 ? (
              unifiedProfile.verifiedSkills.map((v, i) => <SkillBadge key={i} skill={v.skill} type="verified" evidence={v.evidence} />)
            ) : <p className="text-xs font-mono text-slate-400">No verified code claims found.</p>}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-mono uppercase text-amber-400 font-bold mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Unverified Resume Claims</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {unifiedProfile.unverifiedClaims?.map((claim, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">⚠️ {claim}</span>
            ))}
          </div>
        </div>
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
          <span className={`px-4 py-2 rounded-full font-mono text-xs font-bold border shrink-0 ${ats.ats_verdict?.includes('Pass') ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'}`}>
            {ats.ats_verdict}
          </span>
        </div>
        <div className="space-y-2 mb-8">
          <div className="w-full h-4 bg-space-950 rounded-full p-0.5 border border-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-700 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]" style={{ width: `${ats.ats_score}%` }} />
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>ATS Compatibility Index</span>
            <span className="text-cyan-400 font-bold">{Math.round(ats.ats_score)}%</span>
          </div>
        </div>
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
        </div>
      </div>
    </div>
  );

  const renderRewrites = () => (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-white">AI-Optimized Bullet Rewrites</h2>
        </div>
        <button onClick={handleCopyAllRewrites} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] transition-all">
          <Copy className="w-4 h-4" />
          <span>Copy All Rewrites</span>
        </button>
      </div>
      <div className="space-y-4">
        {rewrites.rewrites?.map((rewrite, index) => <RewriteCard key={index} rewrite={rewrite} />)}
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-6 fade-in">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 text-center">
        <h2 className="text-xl font-heading font-bold text-white mb-2">Job Readiness Index</h2>
        <div className="text-6xl font-heading font-extrabold text-cyan-400 mb-2 glow-text-cyan">{Math.round(gaps.readiness_percentage)}%</div>
      </div>
      <div>
        <h3 className="font-heading font-bold text-white text-lg mb-4">Skill Gap Analysis</h3>
        {gaps.skill_gaps?.map((gap, index) => <RoadmapItem key={index} gap={gap} />)}
      </div>
    </div>
  );

  const renderCoverLetter = () => <div className="fade-in"><CoverLetterCard coverLetter={coverLetter} /></div>;

  return (
    <div className="min-h-screen bg-space-950 pt-8 pb-20 px-4 relative overflow-hidden">
      {BackgroundEffects && <BackgroundEffects />}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2 px-4 py-2 rounded-xl glass-pill text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all font-mono text-xs">
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Return to Command Center</span>
          </button>
        </div>
        <div className="flex space-x-2 glass-card rounded-2xl p-1.5 mb-8 overflow-x-auto border border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'unified' && renderUnified()}
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-heading font-bold ml-4">Analysis Results</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-navy-800 rounded-lg p-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
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
