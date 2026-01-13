import React from 'react';
import { Star, User, Edit2 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';
import type { Rating } from '../../interfaces/rating';

interface RatingCardProps {
  rating: Rating;
  showMentorName?: boolean;
  onEdit?: () => void;
}

const RatingCard: React.FC<RatingCardProps> = ({
  rating,
  showMentorName = false,
  onEdit,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {showMentorName ? rating.mentor.name : rating.member.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatRelativeTime(rating.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= rating.rating
                    ? 'fill-orange-500 text-orange-500'
                    : 'fill-none text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
              title="Edit rating"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Review Text */}
      {rating.review && (
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {rating.review}
        </p>
      )}
    </div>
  );
};

export default RatingCard;
