import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import StarRating from './starRating';
import TextAreaInput from './textAreaInput';
import type { CreateRatingDto, Rating } from '../../interfaces/rating';

interface RatingFormProps {
  bookingId: number;
  mentorName: string;
  onSubmit: (data: CreateRatingDto) => Promise<void>;
  onCancel: () => void;
  initialRating?: Rating | null;
}

const RatingForm: React.FC<RatingFormProps> = ({
  bookingId,
  mentorName,
  onSubmit,
  onCancel,
  initialRating = null,
}) => {
  const [rating, setRating] = useState(initialRating?.rating || 0);
  const [review, setReview] = useState(initialRating?.review || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRating(initialRating?.rating || 0);
    setReview(initialRating?.review || '');
  }, [initialRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await onSubmit({
        bookingId,
        rating,
        review: review.trim() || undefined,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const isEditMode = !!initialRating;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Your Rating' : 'Rate Your Session'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isEditMode ? 'Update your rating for' : 'How was your session with'} <span className="font-semibold text-gray-900 dark:text-white">{mentorName}</span>?
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Your Rating *
              </label>
              <div className="flex justify-center">
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size="lg"
                />
              </div>
              {error && rating === 0 && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review (Optional)
              </label>
              <TextAreaInput
                name="review"
                label=""
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this mentor..."
                rows={4}
              />
            </div>

            {error && rating > 0 && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="orange"
                disabled={submitting || rating === 0}
                className="flex-1"
              >
                {submitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Rating' : 'Submit Rating')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingForm;
