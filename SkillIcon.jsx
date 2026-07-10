import React from 'react';

const getColorForSkill = (skillName) => {
  const normalized = skillName.trim().toLowerCase();
  
  const colorMap = {
    'crm': 'bg-blue-600',
    'excel': 'bg-green-600',
    'word': 'bg-blue-500',
    'erp': 'bg-orange-500',
    'python': 'bg-yellow-500',
    'javascript': 'bg-yellow-400 text-black',
    'react': 'bg-cyan-500',
    'node': 'bg-green-500',
    'sql': 'bg-indigo-500',
    'aws': 'bg-orange-600',
    'sap': 'bg-red-600',
    'powerbi': 'bg-yellow-600'
  };

  if (colorMap[normalized]) return colorMap[normalized];

  // Generate a deterministic color based on string hash if not in map
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    'bg-rose-500', 'bg-pink-500', 'bg-fuchsia-500', 'bg-purple-500', 
    'bg-violet-500', 'bg-indigo-500', 'bg-blue-500', 'bg-sky-500', 
    'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500', 'bg-green-500'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

const getAbbreviation = (skillName) => {
  const words = skillName.trim().split(/\s+/);
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return skillName.trim().substring(0, 2).toUpperCase();
};

export default function SkillIcon({ skill }) {
  if (!skill || !skill.trim()) return null;
  
  const colorClass = getColorForSkill(skill);
  const abbreviation = getAbbreviation(skill);

  return (
    <div className="flex flex-col items-center gap-1.5 w-16">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ${colorClass}`}>
        {abbreviation}
      </div>
      <span className="text-[10px] text-center font-medium leading-tight text-[hsl(var(--cv-dark-gray))] line-clamp-2">
        {skill.trim()}
      </span>
    </div>
  );
}