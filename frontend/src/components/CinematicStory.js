import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, GitBranch, FileText, ShieldCheck, RefreshCw, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';

const CinematicStory = ({ onEnterCommandCenter }) => {
  const [bootStep, setBootStep] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  const bootLogs = [
    "INITIALIZING SKILLHIVE AI ENGINE...",
    "CONNECTING TRUST RADAR & OPENROUTER PIPELINE...",
    "DEVELOPER INTELLIGENCE SYSTEM ONLINE."
  ];

  useEffect(() => {
    if (bootStep < bootLogs.length) {
      const timer = setTimeout(() => {
        setBootStep(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setBootComplete(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [bootStep, bootLogs.length]);

  return (
    <div className="w-full text-scifi-100 font-sans">
      
      {/* SECTION 1: HERO - LIVING HOLOGRAPHIC AI ENGINE */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-pill border border-scifi-600/30 text-xs font-mono shadow-purple-glow animate-float">
            <Sparkles className="w-4 h-4 text-scifi-200 animate-spin-slow" />
            <span className="text-scifi-100 font-semibold tracking-wide">
              SkillBridge AI v2.0 Platform
            </span>
          </div>

          {/* Minimal Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight leading-tight">
            Developer Intelligence. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-scifi-100 via-scifi-200 to-scifi-400 glow-text-purple">
              Verified by AI Core.
            </span>
          </h1>

          {/* Minimal 2-Line Subtitle */}
          <p className="text-base sm:text-xl text-scifi-200 max-w-2xl mx-auto font-sans leading-relaxed">
            Autonomous verification engine cross-checking resumes, GitHub repositories, and developer trust in real time.
          </p>

          {/* Single Primary CTA */}
          <div className="pt-4">
            <button
              onClick={onEnterCommandCenter}
              className="px-10 py-5 rounded-2xl bg-gradient-to-r from-scifi-700 via-scifi-600 to-scifi-800 text-scifi-100 font-heading font-extrabold text-lg shadow-purple-glow hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3"
            >
              <Cpu className="w-6 h-6 text-scifi-200 animate-pulse" />
              <span>Launch Command Center</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>

        </div>

        <div className="absolute bottom-8 flex flex-col items-center text-xs font-mono text-scifi-200/60 animate-bounce">
          <span>SCROLL TO EXPLORE STORIES</span>
          <ChevronDown className="w-4 h-4 mt-1" />
        </div>
      </section>

      {/* SECTION 2: GITHUB REPOSITORY INTELLIGENCE */}
      <section className="min-h-[85vh] py-20 px-4 relative flex items-center justify-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-4 text-left">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest font-bold bg-scifi-600/20 text-scifi-200 border border-scifi-600/40 flex items-center space-x-2 w-fit">
              <GitBranch className="w-3.5 h-3.5 text-scifi-200" />
              <span>01 • REPOSITORY INTELLIGENCE</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-scifi-100 tracking-tight leading-tight">
              Immutable Code Proof.
            </h2>

            <p className="text-base text-scifi-200 font-sans leading-relaxed">
              Analyzes repository trees, commit pulses, and code merges to prove technical execution.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden glass-card border border-scifi-600/40 shadow-purple-glow group">
            <img
              src="/images/git_graph_intelligence.png"
              alt="Git Graph Intelligence"
              className="w-full h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-scifi-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-3 glass-pill rounded-xl border border-scifi-600/30">
              <p className="text-xs font-mono text-scifi-200">REPOSITORY NODE ANALYSIS</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: RESUME SCANNER & OCR */}
      <section className="min-h-[85vh] py-20 px-4 relative flex items-center justify-center bg-scifi-950/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div className="relative rounded-3xl overflow-hidden glass-card border border-scifi-600/40 shadow-purple-glow group order-2 md:order-1">
            <img
              src="/images/resume_scanner_bot.png"
              alt="Resume Scanner Bot"
              className="w-full h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-scifi-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-3 glass-pill rounded-xl border border-scifi-600/30">
              <p className="text-xs font-mono text-scifi-200">LASER RESUME PARSER</p>
            </div>
          </div>

          <div className="space-y-4 text-left order-1 md:order-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest font-bold bg-scifi-600/20 text-scifi-200 border border-scifi-600/40 flex items-center space-x-2 w-fit">
              <FileText className="w-3.5 h-3.5 text-scifi-200" />
              <span>02 • RESUME OCR SCANNING</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-scifi-100 tracking-tight leading-tight">
              Precision Section Extraction.
            </h2>

            <p className="text-base text-scifi-200 font-sans leading-relaxed">
              Extracts matched skills, missing keywords, and ATS density to generate bullet rewrites.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: TRUST ENGINE */}
      <section className="min-h-[85vh] py-20 px-4 relative flex items-center justify-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-4 text-left">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest font-bold bg-scifi-600/20 text-scifi-200 border border-scifi-600/40 flex items-center space-x-2 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-scifi-200" />
              <span>03 • TRUST ENGINE</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-scifi-100 tracking-tight leading-tight">
              Holographic Verification Radar.
            </h2>

            <p className="text-base text-scifi-200 font-sans leading-relaxed">
              Segregates claims into Verified Skills and Unverified Claims to detect overclaiming.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden glass-card border border-scifi-600/40 shadow-purple-glow group">
            <img
              src="/images/trust_engine_sphere.png"
              alt="Trust Engine Sphere"
              className="w-full h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-scifi-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-3 glass-pill rounded-xl border border-scifi-600/30">
              <p className="text-xs font-mono text-scifi-200">TRUST SCORE RADAR</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: SKILLSWAP MATCHING */}
      <section className="min-h-[85vh] py-20 px-4 relative flex items-center justify-center bg-scifi-950/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div className="relative rounded-3xl overflow-hidden glass-card border border-scifi-600/40 shadow-purple-glow group order-2 md:order-1">
            <img
              src="/images/skillswap_network.png"
              alt="SkillSwap Network"
              className="w-full h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-scifi-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-3 glass-pill rounded-xl border border-scifi-600/30">
              <p className="text-xs font-mono text-scifi-200">NEURAL SKILL PAIRING</p>
            </div>
          </div>

          <div className="space-y-4 text-left order-1 md:order-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest font-bold bg-scifi-600/20 text-scifi-200 border border-scifi-600/40 flex items-center space-x-2 w-fit">
              <RefreshCw className="w-3.5 h-3.5 text-scifi-200" />
              <span>04 • SKILLSWAP ENGINE</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-scifi-100 tracking-tight leading-tight">
              Peer Skill Exchange.
            </h2>

            <p className="text-base text-scifi-200 font-sans leading-relaxed">
              Connects complementary developers to exchange strengths and fill technical gaps.
            </p>

            <div className="pt-2">
              <button
                onClick={onEnterCommandCenter}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-scifi-700 via-scifi-600 to-scifi-800 text-scifi-100 font-heading font-extrabold text-base shadow-purple-glow hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3"
              >
                <Cpu className="w-5 h-5 text-scifi-200" />
                <span>Go To Command Center</span>
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default CinematicStory;
