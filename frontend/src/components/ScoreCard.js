import React from 'react';

const ScoreCard = ({ title, score, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className="bg-navy-800 rounded-lg p-6 border border-navy-700">
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-center space-x-3">
        <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <span className="text-2xl font-bold">{Math.round(score)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
