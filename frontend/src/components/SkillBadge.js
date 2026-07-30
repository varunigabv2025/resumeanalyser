import React from 'react';

const SkillBadge = ({ skill, type = 'matched' }) => {
  const typeClasses = {
    matched: 'bg-green-500/20 text-green-400 border-green-500/30',
    missing: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm border ${typeClasses[type]}`}>
      {skill}
    </span>
  );
};

export default SkillBadge;
