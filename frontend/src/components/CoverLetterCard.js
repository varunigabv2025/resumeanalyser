import React, { useState } from 'react';
import { Copy, Download, Check, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CoverLetterCard = ({ coverLetter }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter.cover_letter || '');
    setCopied(true);
    toast.success('Cover letter copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = `Subject: ${coverLetter.subject_line || 'Application'}\n\n${coverLetter.cover_letter || ''}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover_letter.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Cover letter downloaded!');
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="font-heading font-bold text-xl text-white">AI-Generated Cover Letter</h3>
          </div>
          <p className="text-xs font-mono text-cyan-300/80">
            Subject: <span className="text-slate-200">{coverLetter.subject_line || 'Application for Position'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all font-mono text-xs shadow-neon-cyan"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Letter'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-all font-mono text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Tone & Highlights Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Tone: {coverLetter.tone || 'Professional'}</span>
        </span>

        {coverLetter.highlights_used?.map((highlight, index) => (
          <span key={index} className="px-3 py-1 rounded-full text-xs font-mono bg-space-950 text-slate-300 border border-white/10">
            ★ {highlight}
          </span>
        ))}
      </div>

      {/* Main Cover Letter Document */}
      <div className="p-6 rounded-2xl bg-space-950/90 border border-white/10 text-slate-200 font-sans text-sm sm:text-base leading-relaxed whitespace-pre-wrap select-text shadow-inner">
        {coverLetter.cover_letter || 'Generating tailored cover letter...'}
      </div>
    </div>
  );
};

export default CoverLetterCard;
