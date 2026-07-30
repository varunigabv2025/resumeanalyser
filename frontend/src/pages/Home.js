import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, Target, BookOpen, Mail, Sparkles, Cpu, ShieldCheck, GitBranch, ArrowRight, Zap, Github } from 'lucide-react';
import { useAnalyze } from '../hooks/useAnalyze';
import LoadingScreen from '../components/LoadingScreen';
import BackgroundEffects from '../components/BackgroundEffects';
import AiAgentsBar from '../components/AiAgentsBar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

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

  if (loading) {
    return (
      <LoadingScreen
        currentStep={currentStep}
        progress={progress}
      />
    );
  }

  return (
    <div className="min-h-screen bg-space-950 pt-6 pb-20 px-4 relative overflow-hidden">
      {BackgroundEffects && <BackgroundEffects />}

      <div className="max-w-4xl mx-auto relative z-10">

        {/* AI Autonomous Agents Bar */}
        <div className="mb-8">
          {AiAgentsBar && <AiAgentsBar />}
        </div>

        {/* Hero Banner Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-pill text-cyan-300 text-xs font-mono mb-2 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>GEMMA 4 AUTONOMOUS RESUME & CODE VERIFICATION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white tracking-tight leading-tight">
            SkillBridge <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent glow-text-cyan">AI</span>
          </h1>
          <p className="text-slate-300 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Verify real resume claims against public GitHub code repositories, simulate ATS filters, and generate personalized career roadmaps.
          </p>
        </div>

        {/* Command Center Card */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Autonomous Analysis Command Center</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Input 1: Resume Upload Dropzone */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                1. Upload Resume (PDF or DOCX) *
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-white/15 hover:border-cyan-500/40 bg-space-950/60'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className={`p-3 rounded-xl ${file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                    {file ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                  </div>
                  <div>
                    {file ? (
                      <div>
                        <p className="font-mono text-xs font-bold text-emerald-300">{file.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{(file.size / 1024).toFixed(1)} KB • Ready for analysis</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-slate-200">Drag & drop resume file</p>
                        <p className="text-xs text-slate-400 mt-1 font-mono">PDF or DOCX up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Input 2: Job Description Input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                2. Target Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description or key requirements..."
                className="w-full h-[155px] glass-input rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-xs border border-white/10 focus:border-cyan-500/50 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Input 3: GitHub Profile URL Field */}
          <div className="mt-6 space-y-2">
            <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Github className="w-4 h-4 text-cyan-400" />
                <span>3. GitHub Profile URL (Optional)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Paste public GitHub profile URL</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Github className="w-4 h-4" />
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
          </div>
        </div>

        {/* AI Platform Capabilities Section */}
        <div className="max-w-6xl mx-auto px-4 pb-20 pt-16 relative z-10">
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
    </div>
  );
};

export default Home;