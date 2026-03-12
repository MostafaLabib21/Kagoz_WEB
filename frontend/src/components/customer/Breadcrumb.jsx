import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-gray-400 mx-1" />
            )}
            
            {!isLast && item.href ? (
              <Link
                to={item.href}
                className="text-gray-500 hover:text-gray-700 hover:underline transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900 truncate max-w-xs" title={item.label}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
