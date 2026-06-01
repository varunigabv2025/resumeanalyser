import React from 'react';
import { ExternalLink } from 'lucide-react';

const RoadmapItem = ({ gap }) => {
  const priorityColors = {
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div className="bg-navy-800 rounded-lg p-4 border border-navy-700 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-lg">{gap.skill}</h4>
        <span className={`px-3 py-1 rounded-full text-xs border ${
  priorityColors[gap.priority] || priorityColors.Medium
}`}>
          {gap.priority} Priority
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-3">Estimated time: {gap.estimated_time}</p>
      <div className="space-y-2">
        <p className="text-gray-500 text-xs uppercase font-medium">Free Resources:</p>
        {gap.resources?.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>{resource.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RoadmapItem;
