import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, Target, BookOpen, Mail, Sparkles, Cpu, ShieldCheck, GitBranch, ArrowRight, Zap, Github } from 'lucide-react';
import { useAnalyze } from '../hooks/useAnalyze';
import LoadingScreen from '../components/LoadingScreen';
import BackgroundEffects from '../components/BackgroundEffects';
import AiAgentsBar from '../components/AiAgentsBar';
import SharedProfilesExplorer from '../components/SharedProfilesExplorer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [showExplorer, setShowExplorer] = useState(false);

  const { analyze, loading, progress, currentStep } = useAnalyze();
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleAnalyze = () => {
    console.log('[DEBUG Home.js] "Analyze Resume & Verify Profile" button clicked!');
    if (!file) {
      console.warn('[DEBUG Home.js] Validation failed: No file uploaded.');
      alert('Please upload a resume (PDF or DOCX)');
      return;
    }

    if (!jobDescription.trim()) {
      console.warn('[DEBUG Home.js] Validation failed: Job description empty.');
      alert('Please enter a job description');
      return;
    }

    console.log('[DEBUG Home.js] Validation passed. Calling analyze() hook with githubUrl:', githubUrl);
    analyze(file, jobDescription, githubUrl);
  };

  const handleSelectMockProfile = (mockAnalysis) => {
    sessionStorage.setItem('analysisResult', JSON.stringify(mockAnalysis));
    navigate('/results');
  };

  if (loading) {
    return (
      <LoadingScreen
        progress={progress}
        currentStep={currentStep}
      />
    );
  }

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 relative overflow-hidden">
      {/* Dynamic Canvas Background & Lighting Orbs */}
      {BackgroundEffects && <BackgroundEffects />}

      {/* Hero Section with Cinematic AI Core */}
      <div className="relative z-10 pt-12 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">

          {/* Top Announcement Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-pill border border-cyan-500/30 text-xs font-mono mb-8 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] animate-float">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-cyan-300 font-semibold tracking-wide">
              SkillBridge AI v2.0 Platform Live
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Autonomous Resume & GitHub Verification</span>
          </div>

          {/* Main Cinematic Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight mb-6 leading-none">
            Developer Intelligence. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 glow-text-cyan">
              Verified by AI.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-sans leading-relaxed">
            Upload your resume, verify your GitHub repositories with real-time AI code analysis, calculate your Trust Score, and unlock targeted SkillSwap opportunities.
          </p>

          {/* Cinematic Floating AI Core Node Graphic */}
          <div className="relative max-w-3xl mx-auto my-12 py-8 flex items-center justify-center">

            {/* Pulsing Neural Rings */}
            <div className="absolute w-[340px] h-[340px] rounded-full border border-cyan-500/20 animate-ping opacity-30" />
            <div className="absolute w-[440px] h-[440px] rounded-full border border-purple-500/20 animate-pulse" />

            {/* Central Holographic AI Orb */}
            <div className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-purple-600/30 p-[2px] shadow-[0_0_25px_-5px_rgba(6,182,212,0.5)] animate-float">
              <div className="w-full h-full bg-space-950 rounded-full flex flex-col items-center justify-center p-4 backdrop-blur-xl border border-cyan-500/40">
                <Cpu className="w-12 h-12 text-cyan-400 mb-2 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest">
                  AI CORE v2.0
                </span>
                <span className="text-[9px] font-mono text-emerald-400 mt-0.5">
                  100% OPERATIONAL
                </span>
              </div>
            </div>

            {/* Floating Orbit Node 1: Resume Hologram */}
            <div className="absolute top-0 -left-4 sm:left-6 glass-card p-3 rounded-2xl border border-cyan-500/30 flex items-center space-x-3 shadow-lg animate-float">
              <FileText className="w-5 h-5 text-cyan-400" />
              <div className="text-left text-xs font-mono">
                <p className="font-bold text-white">Resume Parser</p>
                <p className="text-slate-400 text-[10px]">Text & Metadata Extracted</p>
              </div>
            </div>

            {/* Floating Orbit Node 2: GitHub Repository Node */}
            <div className="absolute bottom-0 -right-4 sm:right-6 glass-card p-3 rounded-2xl border border-purple-500/30 flex items-center space-x-3 shadow-lg animate-float-reverse">
              <GitBranch className="w-5 h-5 text-purple-400" />
              <div className="text-left text-xs font-mono">
                <p className="font-bold text-white">GitHub Analyzer</p>
                <p className="text-slate-400 text-[10px]">Code Evidence Verified</p>
              </div>
            </div>

            {/* Floating Orbit Node 3: Trust Score Ring */}
            <div className="absolute top-2 -right-4 sm:right-10 glass-card p-3 rounded-2xl border border-emerald-500/30 flex items-center space-x-3 shadow-lg animate-float">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div className="text-left text-xs font-mono">
                <p className="font-bold text-white">Trust Engine</p>
                <p className="text-emerald-400 text-[10px]">Score: 94.8% High</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* AI Agents Live Status Bar */}
      {AiAgentsBar && <AiAgentsBar />}

      {/* Main Input Command Center */}
      <div className="max-w-6xl mx-auto px-4 pb-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Futuristic Resume Upload Dropzone */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">

            <h2 className="text-xl font-heading font-bold mb-4 flex items-center text-white">
              <Upload className="w-5 h-5 mr-3 text-cyan-400" />
              1. Upload Developer Resume
            </h2>

            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
                isDragActive
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] scale-[1.01]'
                  : 'border-white/15 bg-space-950/60 hover:border-cyan-500/50 hover:bg-space-900/60'
              }`}
            >
              <input {...getInputProps()} />

              {file ? (
                <div className="flex flex-col items-center justify-center space-y-3 py-4">
                  <div className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]">
                    <FileText className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-base">{file.name}</p>
                    <p className="text-xs font-mono text-cyan-400 mt-1">
                      {(file.size / 1024).toFixed(1)} KB • Ready for Parsing
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ✓ File Validated
                  </span>
                </div>
              ) : (
                <div className="py-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>

                  <div>
                    <p className="text-slate-200 font-medium text-base">
                      {isDragActive
                        ? 'Drop your resume file here now...'
                        : 'Drag & drop your resume or click to browse'}
                    </p>
                    <p className="text-slate-400 text-xs font-mono mt-2">
                      Supports PDF or DOCX formats (Up to 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Text Area */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative">
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center text-white">
              <FileText className="w-5 h-5 mr-3 text-purple-400" />
              2. Target Job Description
            </h2>

            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here (e.g. Senior Full Stack Engineer requiring React, Node.js, Docker, PostgreSQL)..."
                className="w-full h-48 glass-input rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none resize-none font-sans text-sm leading-relaxed"
              />

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-2 px-1">
                <span>Auto-Keyword Visualizer Active</span>
                <span className="text-cyan-400">{jobDescription.length} characters</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. GitHub Profile URL Card */}
        <div className="mt-8 glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative">
          <h2 className="text-xl font-heading font-bold mb-2 flex items-center text-white">
            <Github className="w-5 h-5 mr-3 text-cyan-400" />
            3. GitHub Profile URL
          </h2>
          <p className="text-xs font-mono text-slate-400 mb-4">
            Paste your public GitHub profile URL.
          </p>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Github className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full glass-input rounded-2xl py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-sm border border-white/10 focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Big Glow Analyze Action Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleAnalyze}
            disabled={!file || !jobDescription.trim()}
            className="group relative inline-flex items-center justify-center px-10 py-5 rounded-2xl font-heading font-extrabold text-lg text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.03] shadow-[0_0_25px_-5px_rgba(6,182,212,0.5)] overflow-hidden"
          >
            <Zap className="w-6 h-6 mr-3 text-cyan-300 group-hover:animate-bounce" />
            <span>Analyze Resume & Verify Profile</span>
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Quick Dataset Explorer Trigger Button */}
          {SharedProfilesExplorer && (
            <div className="mt-6">
              <button
                onClick={() => setShowExplorer(!showExplorer)}
                className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
              >
                <Cpu className="w-4 h-4" />
                <span>{showExplorer ? 'Hide Shared Mock Dataset Explorer' : 'Explore 20 Shared Developer Mock Profiles & SkillSwap Pairs'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Shared Mock Profiles Explorer Component */}
        {showExplorer && SharedProfilesExplorer && (
          <SharedProfilesExplorer onSelectProfile={handleSelectMockProfile} />
        )}
      </div>

      {/* AI Platform Capabilities Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
            SkillBridge AI Platform Modules
          </h2>
          <p className="text-slate-400 text-sm font-mono">
            Autonomous verification and intelligence capabilities
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="glass-card-hover p-6 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-2">ATS Verification</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Evaluates resume formatting, section detection, and keyword match percentages.
            </p>
          </div>

          <div className="glass-card-hover p-6 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-4 text-purple-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-2">Skill Verification</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Cross-checks claimed resume skills against real GitHub repositories and code commits.
            </p>
          </div>

          <div className="glass-card-hover p-6 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 text-blue-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-2">Gap Roadmap</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Generates customized learning milestones and curated resources for missing skills.
            </p>
          </div>

          <div className="glass-card-hover p-6 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-2">Cover Letter AI</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Generates tailored, high-converting cover letters matching target job descriptions.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;