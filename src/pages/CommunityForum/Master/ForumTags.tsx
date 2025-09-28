

import React, { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import { DataTable, type Column } from "../../../components/ui/dataTable";
import FormModal from "../../../components/ui/formModal";
import FormInput from "../../../components/ui/formInput";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import Pagination from "../../../components/ui/pagination";
import { usePagination } from "../../../hooks/usePagination";
import type { ForumTag } from "../../../interfaces";
import {
  getForumTags,
  createForumTag,
  updateForumTag,
  deleteForumTag,
} from "../../../api/endpoints/forumTags";

interface FormData {
  name: string;
}

const ForumTags: React.FC = () => {
  const [forumTags, setForumTags] = useState<ForumTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTag, setEditingTag] = useState<ForumTag | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: "" });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  
  // Pagination hook
  const {
    currentPage,
    itemsPerPage,
    pagination,
    setPagination,
    handlePageChange,
    handleItemsPerPageChange,
    handlePrevPage,
    handleNextPage,
    resetToFirstPage,
  } = usePagination({
    initialPage: 1,
    initialItemsPerPage: 6,
  });

  const { openDialog, ConfirmDialog } = useConfirmationDialog();

  useEffect(() => {
    fetchForumTags(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const fetchForumTags = async (page: number = currentPage, limit: number = itemsPerPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getForumTags(page, limit);
      setForumTags(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching forum tags:", err);
      setError("Failed to load forum tags");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTag(null);
    setFormData({ name: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (tag: ForumTag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (tag: ForumTag) => {
    openDialog({
      title: "Delete Forum Tag",
      message: `Are you sure you want to delete "${tag.name}"? This action cannot be undone and may affect existing forum threads.`,
      confirmText: "Delete Tag",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async (close) => {
        close();
        try {
          await deleteForumTag(tag.id);
          // If we're on the last page and delete the last item, go back a page
          if (forumTags.length === 1 && currentPage > 1) {
            resetToFirstPage();
          } else {
            fetchForumTags(currentPage, itemsPerPage);
          }
        } catch (err) {
          console.error("Error deleting forum tag:", err);
        }
      },
    });
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      errors.name = "Tag name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Tag name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      errors.name = "Tag name must be less than 50 characters";
    }

    // Check for duplicate names (case-insensitive)
    const existingTag = forumTags.find(
      (tag) => 
        tag.name.toLowerCase() === formData.name.trim().toLowerCase() &&
        tag.id !== editingTag?.id
    );
    
    if (existingTag) {
      errors.name = "A tag with this name already exists";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const tagData = {
        name: formData.name.trim(),
      };

      if (editingTag) {
        await updateForumTag(editingTag.id, tagData);
      } else {
        await createForumTag(tagData);
      }

      setIsModalOpen(false);
      fetchForumTags(currentPage, itemsPerPage);
    } catch (err: any) {
      console.error("Error saving forum tag:", err);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof FormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const columns: Column<ForumTag>[] = [
    {
      key: "name",
      header: "Tag Name",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-orange-100 dark:bg-orange-900">
            <Tag className="w-3 h-3 text-orange-600 dark:text-orange-400" />
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (value: string) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "Last Updated",
      render: (value: string) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Forum Tags
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage tags for organizing forum discussions
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {pagination.total}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Total Tags
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {forumTags.length > 0 
                    ? formatDate(
                        new Date(
                          Math.max(
                            ...forumTags.map((tag) => new Date(tag.updated_at).getTime())
                          )
                        ).toISOString()
                      )
                    : "Never"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={forumTags}
          columns={columns}
          loading={loading}
          error={error}
          title="Forum Tags"
          description="Create and manage tags for categorizing forum discussions"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={() => fetchForumTags(currentPage, itemsPerPage)}
          addButtonText="Add Tag"
          emptyStateText="No Forum Tags"
          emptyStateDescription="Create your first tag to start organizing forum discussions."
          keyField="id"
        />

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={itemsPerPage}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          className="mt-4"
        />

        {/* Form Modal */}
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingTag ? "Edit Forum Tag" : "Create New Forum Tag"}
          loading={isSubmitting}
          isEdit={!!editingTag}
        >
          <FormInput
            label="Tag Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter tag name (e.g., Fitness, Nutrition, Training)"
            required
            error={formErrors.name}
            disabled={isSubmitting}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tag names should be concise and descriptive (2-50 characters)
          </div>
        </FormModal>

        {/* Confirmation Dialog */}
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default ForumTags;
