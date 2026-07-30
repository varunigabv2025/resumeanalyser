import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ progress, currentStep }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-indigo-500 mx-auto mb-6 spin-slow" />
        <h2 className="text-2xl font-heading font-bold mb-4">Analyzing Your Resume</h2>
        <p className="text-gray-400 mb-6">{currentStep}</p>
        <div className="w-64 h-2 bg-navy-700 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-500 text-sm mt-2">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
