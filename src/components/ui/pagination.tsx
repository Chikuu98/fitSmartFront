import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  itemsPerPageOptions?: number[];
  showItemsPerPage?: boolean;
  showResultsInfo?: boolean;
  maxPageNumbers?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  hasNext,
  hasPrev,
  onPageChange,
  onItemsPerPageChange,
  onPrevPage,
  onNextPage,
  itemsPerPageOptions = [5, 10, 20, 50],
  showItemsPerPage = true,
  showResultsInfo = true,
  maxPageNumbers = 5,
  className = "",
}) => {
  if (totalItems === 0) return null;

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxPages = Math.min(maxPageNumbers, totalPages);
    
    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= Math.ceil(maxPages / 2)) {
      for (let i = 1; i <= maxPages; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
      for (let i = totalPages - maxPages + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = currentPage - Math.floor(maxPages / 2);
      for (let i = start; i < start + maxPages; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {showResultsInfo && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startItem} to {endItem} of {totalItems} results
          </div>
        )}

        <div className="flex items-center gap-2">
          {showItemsPerPage && (
            <div className="flex items-center gap-2 mr-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center">
            <button
              onClick={onPrevPage}
              disabled={!hasPrev}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium border-t border-b border-r border-gray-300 dark:border-gray-600 transition-colors ${
                  currentPage === pageNum
                    ? 'bg-orange-50 border-orange-500 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                    : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={onNextPage}
              disabled={!hasNext}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;