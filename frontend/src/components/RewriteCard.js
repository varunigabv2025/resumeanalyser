import React from 'react';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const RewriteCard = ({ rewrite }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(rewrite.improved);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="bg-navy-800 rounded-lg p-4 border border-navy-700 mb-4">
      <div className="mb-2">
        <p className="text-gray-500 line-through text-sm">{rewrite.original}</p>
      </div>
      <div className="mb-2">
        <p className="text-green-400 font-medium">{rewrite.improved}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-xs italic">{rewrite.reason}</p>
        <button
          onClick={handleCopy}
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RewriteCard;
