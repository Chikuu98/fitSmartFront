import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  loading?: boolean;
  isEdit?: boolean;
  children: React.ReactNode;
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  loading = false,
  isEdit = false,
  children,
}: FormModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white dark:bg-[#18181c] border border-gray-200 dark:border-orange-800 shadow-2xl rounded-lg sm:rounded-2xl w-full max-w-md mx-2 sm:mx-4 transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-orange-100 truncate">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 sm:p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {children}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="orange"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEdit ? "Update" : "Create"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormModal;