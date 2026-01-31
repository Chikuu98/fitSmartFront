
import React, { useState, useEffect } from "react";
import { Grid3X3, FileText } from "lucide-react";
import { DataTable, type Column } from "../../../components/ui/dataTable";
import FormModal from "../../../components/ui/formModal";
import FormInput from "../../../components/ui/formInput";
import TextAreaInput from "../../../components/ui/textAreaInput";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import { Pagination } from "../../../components/ui/pagination";
import { usePagination } from "../../../hooks/usePagination";
import type { ForumType } from "../../../interfaces/forumType";
import {
  getForumTypes,
  createForumType,
  updateForumType,
  deleteForumType,
} from "../../../api/endpoints/forumTypes";

interface FormData {
  title: string;
  description: string;
}

const ForumTypes: React.FC = () => {
  const [forumTypes, setForumTypes] = useState<ForumType[]>([]);
  const [totalForumTypes, setTotalForumTypes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingType, setEditingType] = useState<ForumType | null>(null);
  const [formData, setFormData] = useState<FormData>({ title: "", description: "" });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const { openDialog, ConfirmDialog } = useConfirmationDialog();
  const {
    currentPage,
    itemsPerPage,
    pagination,
    setCurrentPage,
    setItemsPerPage,
    setPagination,
  } = usePagination();

  useEffect(() => {
    fetchForumTypes();
  }, [currentPage, itemsPerPage]);

  const fetchForumTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getForumTypes(currentPage, itemsPerPage);
      setForumTypes(response.data);
      setTotalForumTypes(response.pagination?.total || 0);
      if (response.pagination) {
        setPagination({
          total: response.pagination.total,
          page: response.pagination.page,
          limit: response.pagination.limit,
          totalPages: response.pagination.totalPages,
          hasNext: response.pagination.hasNext,
          hasPrev: response.pagination.hasPrev,
        });
      }
    } catch (err) {
      console.error("Error fetching forum types:", err);
      setError("Failed to load forum types");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingType(null);
    setFormData({ title: "", description: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (type: ForumType) => {
    setEditingType(type);
    setFormData({ title: type.title, description: type.description });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (type: ForumType) => {
    openDialog({
      title: "Delete Forum Type",
      message: `Are you sure you want to delete "${type.title}"? This action cannot be undone and may affect existing forum threads.`,
      confirmText: "Delete Type",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async (close) => {
        close();
        try {
          await deleteForumType(type.id);
          fetchForumTypes();
        } catch (err) {
          console.error("Error deleting forum type:", err);
        }
      },
    });
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    } else if (formData.title.trim().length > 100) {
      errors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    const existingType = forumTypes.find(
      (type) => 
        type.title.toLowerCase() === formData.title.trim().toLowerCase() &&
        type.id !== editingType?.id
    );
    
    if (existingType) {
      errors.title = "A forum type with this title already exists";
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
      const typeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      if (editingType) {
        await updateForumType(editingType.id, typeData);
      } else {
        await createForumType(typeData);
      }

      setIsModalOpen(false);
      fetchForumTypes();
    } catch (err: any) {
      console.error("Error saving forum type:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const columns: Column<ForumType>[] = [
    {
      key: "title",
      header: "Type Title",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900">
            <Grid3X3 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (value: string) => (
        <div className="max-w-xs">
          <p className="text-gray-600 dark:text-gray-400 text-sm" title={value}>
            {truncateText(value)}
          </p>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (value: string) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "Last Updated",
      render: (value: string) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
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
                Forum Types
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage discussion categories and forum organization
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {totalForumTypes}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Total Types
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {forumTypes.length > 0 
                    ? formatDate(
                        new Date(
                          Math.max(
                            ...forumTypes.map((type) => new Date(type.updated_at).getTime())
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

        <DataTable
          data={forumTypes}
          columns={columns}
          loading={loading}
          error={error}
          title="Forum Types"
          description="Create and manage forum categories for organizing discussions"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={fetchForumTypes}
          addButtonText="Add Type"
          emptyStateText="No Forum Types"
          emptyStateDescription="Create your first forum type to start organizing discussions by category."
          keyField="id"
        />

        {pagination.total > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={pagination.total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}

        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingType ? "Edit Forum Type" : "Create New Forum Type"}
          loading={isSubmitting}
          isEdit={!!editingType}
        >
          <FormInput
            label="Type Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter forum type title (e.g., General Discussion, Q&A)"
            required
            error={formErrors.title}
            disabled={isSubmitting}
          />
          
          <TextAreaInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the purpose and content guidelines for this forum type..."
            required
            error={formErrors.description}
            disabled={isSubmitting}
            rows={4}
          />
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <p>• Title: 3-100 characters, must be unique</p>
            <p>• Description: 10-500 characters, explain the forum type's purpose</p>
          </div>
        </FormModal>

        <ConfirmDialog />
      </div>
    </div>
  );
};

export default ForumTypes;
