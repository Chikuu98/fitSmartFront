import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp, Info } from 'lucide-react';

interface InsightCardProps {
  type: 'strength' | 'improvement' | 'info' | 'warning';
  items: string[];
  title?: string;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  type,
  items,
  title,
  className = '',
}) => {
  const config = {
    strength: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      title: title || 'Strengths',
    },
    improvement: {
      icon: TrendingUp,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      title: title || 'Areas for Improvement',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      title: title || 'Information',
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      title: title || 'Notice',
    },
  };

  const { icon: Icon, iconColor, bgColor, borderColor, title: displayTitle } = config[type];

  if (items.length === 0) return null;

  return (
    <div
      className={`rounded-lg border p-3 sm:p-5 ${bgColor} ${borderColor} ${className}`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <Icon className={`${iconColor} flex-shrink-0 mt-0.5 w-5 h-5 sm:w-6 sm:h-6`} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
            {displayTitle}
          </h4>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="text-sm text-gray-700 dark:text-gray-300 flex items-start"
              >
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
