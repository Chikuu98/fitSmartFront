import React from "react";
import { Edit2, Trash2, RefreshCw } from "lucide-react";
import { Button } from "./button";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  title: string;
  description?: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRefresh?: () => void;
  addButtonText?: string;
  emptyStateText?: string;
  emptyStateDescription?: string;
  actions?: boolean;
  keyField?: keyof T;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  title,
  description,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  addButtonText = "Add New",
  emptyStateText = "No Data Available",
  emptyStateDescription = "Get started by creating your first item.",
  actions = true,
  keyField = "id" as keyof T,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              {description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              {description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
              {title} ({data.length})
            </h2>
            {description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {onRefresh && (
              <Button variant="outline" onClick={onRefresh} className="p-2 sm:px-4 sm:py-2">
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            {onAdd && (
              <Button variant="orange" onClick={onAdd} className="text-sm sm:text-base">
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">{addButtonText}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table Content */}
      {data.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2zm2 0h8v12H6V4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
            {emptyStateText}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 max-w-sm mx-auto">
            {emptyStateDescription}
          </p>
          {onAdd && (
            <Button variant="orange" onClick={onAdd} className="text-sm sm:text-base">
              {addButtonText}
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                      column.width || ""
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
                {actions && (onEdit || onDelete) && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item, index) => (
                <tr
                  key={item[keyField] || index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || "")}
                    </td>
                  ))}
                  {actions && (onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 p-1 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item, index) => (
            <div
              key={item[keyField] || index}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="space-y-3">
                {columns.map((column) => (
                  <div key={String(column.key)} className="flex justify-between items-start">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-0 mr-3">
                      {column.header}:
                    </div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 text-right flex-1 min-w-0">
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || "")}
                    </div>
                  </div>
                ))}
                {actions && (onEdit || onDelete) && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 p-2 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}

export default DataTable;