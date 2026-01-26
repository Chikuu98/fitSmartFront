import { useState, useCallback } from "react";
import type { PaginationMeta } from "../interfaces";

export interface UsePaginationOptions {
  initialPage?: number;
  initialItemsPerPage?: number;
  onPageChange?: (page: number, itemsPerPage: number) => void;
}

export interface UsePaginationReturn {
  currentPage: number;
  itemsPerPage: number;
  pagination: PaginationMeta;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setPagination: (pagination: PaginationMeta) => void;
  handlePageChange: (newPage: number) => void;
  handleItemsPerPageChange: (newLimit: number) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  resetToFirstPage: () => void;
}

export const usePagination = (options: UsePaginationOptions = {}): UsePaginationReturn => {
  const {
    initialPage = 1,
    initialItemsPerPage = 10,
    onPageChange,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: initialPage,
    limit: initialItemsPerPage,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    onPageChange?.(newPage, itemsPerPage);
  }, [itemsPerPage, onPageChange]);

  const handleItemsPerPageChange = useCallback((newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    onPageChange?.(1, newLimit);
  }, [onPageChange]);

  const handlePrevPage = useCallback(() => {
    if (pagination.hasPrev) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage, itemsPerPage);
    }
  }, [currentPage, itemsPerPage, pagination.hasPrev, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (pagination.hasNext) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage, itemsPerPage);
    }
  }, [currentPage, itemsPerPage, pagination.hasNext, onPageChange]);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
    onPageChange?.(1, itemsPerPage);
  }, [itemsPerPage, onPageChange]);

  return {
    currentPage,
    itemsPerPage,
    pagination,
    setCurrentPage,
    setItemsPerPage,
    setPagination,
    handlePageChange,
    handleItemsPerPageChange,
    handlePrevPage,
    handleNextPage,
    resetToFirstPage,
  };
};

export default usePagination;