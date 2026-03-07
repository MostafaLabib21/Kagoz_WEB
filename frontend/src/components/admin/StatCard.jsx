import React from 'react';

const StatCard = ({ title, value, icon: Icon, accentColor = 'indigo' }) => {
  const colors = {
    green: 'border-green-500 bg-green-50 text-green-600',
    blue: 'border-blue-500 bg-blue-50 text-blue-600',
    purple: 'border-purple-500 bg-purple-50 text-purple-600',
    orange: 'border-orange-500 bg-orange-50 text-orange-600',
    indigo: 'border-indigo-500 bg-indigo-50 text-indigo-600',
  };
  const c = colors[accentColor] || colors.indigo;
  const [borderC, bgC, textC] = c.split(' ');

  return (
    <div className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${borderC} flex items-center justify-between`}>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-lg ${bgC} flex items-center justify-center`}>
          <Icon size={24} className={textC} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
