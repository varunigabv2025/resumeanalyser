import React from 'react';
import { Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const CoverLetterCard = ({ coverLetter }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter.cover_letter);
    toast.success('Cover letter copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter.cover_letter], { type: 'text/plain' });
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

  const toneColors = {
    Professional: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Conversational: 'bg-green-500/20 text-green-400 border-green-500/30',
    Technical: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <div className="bg-white rounded-lg p-8 text-gray-900 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Subject: {coverLetter.subject_line}</p>
          <span className={`px-3 py-1 rounded-full text-xs border ${toneColors[coverLetter.tone] || toneColors.Professional}`}>
            {coverLetter.tone}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-wrap">{coverLetter.cover_letter}</p>
      </div>
    </div>
  );
};

export default CoverLetterCard;
