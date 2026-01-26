import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Tag,
  X,
  Plus,
  AlertCircle,
  Search,
} from "lucide-react";
import { Button, FormInput, TextAreaInput, CustomSelect } from "../../components/ui";
import { createForumThread } from "../../api/endpoints/threads";
import { getForumTags, searchForumTags } from "../../api/endpoints/forumTags";
import { getForumTypes } from "../../api/endpoints/forumTypes";
import type { 
  ForumTag, 
  ForumType, 
  CreateForumThreadDto 
} from "../../interfaces";
import type { RootState } from "../../store/store";

const CreateNewThread: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedForumType, setSelectedForumType] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tags, setTags] = useState<ForumTag[]>([]);
  const [availableTags, setAvailableTags] = useState<ForumTag[]>([]);
  const [forumTypes, setForumTypes] = useState<ForumType[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [tagSearchLoading, setTagSearchLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchInitialData();
  }, [user, navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tagSearchTerm.trim()) {
        searchTagsFromServer(tagSearchTerm.trim());
      } else {
        setAvailableTags(tags);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [tagSearchTerm, tags]);

  useEffect(() => {
    setAvailableTags(tags);
  }, [tags]);

  const fetchInitialData = async () => {
    try {
      const [tagsData, typesData] = await Promise.all([
        getForumTags(1, 6),
        getForumTypes(),
      ]);
      setTags(tagsData.data);
      setForumTypes(typesData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const searchTagsFromServer = async (searchTerm: string) => {
    setTagSearchLoading(true);
    try {
      const searchResults = await searchForumTags(searchTerm, 100);
      setAvailableTags(searchResults.data);
    } catch (error) {
      console.error("Error searching tags:", error);
      const filteredTags = tags.filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAvailableTags(filteredTags);
    } finally {
      setTagSearchLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    } else if (title.length > 255) {
      newErrors.title = "Title must be less than 255 characters";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
    }

    if (selectedTags.length > 5) {
      newErrors.tags = "You can select up to 5 tags maximum";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const threadData: CreateForumThreadDto = {
        title: title.trim(),
        content: content.trim(),
        forum_id: selectedForumType,
        tag_ids: selectedTags.length > 0 ? selectedTags : undefined,
      };

      const newThread = await createForumThread(threadData);
      
      if (newThread && newThread.id) {
        navigate(`/community-forum/thread/${newThread.id}`, {
          state: { message: "Thread created successfully!" }
        });
      } else {
        console.warn("Thread created but no ID returned, navigating to news feed");
        navigate("/community-forum", {
          state: { message: "Thread created successfully!" }
        });
      }
    } catch (error: any) {
      console.error("Error creating thread:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      if (error.response?.data?.message) {
        if (typeof error.response.data.message === 'object') {
          setErrors(error.response.data.message);
        } else {
          setErrors({ general: error.response.data.message });
        }
      } else {
        setErrors({ general: "Failed to create thread. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else if (prev.length < 5) {
        return [...prev, tagId];
      }
      return prev;
    });
  };

  const removeTag = (tagId: number) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const getSelectedTagNames = (): string[] => {
    return selectedTags
      .map(tagId => tags.find(tag => tag.id === tagId)?.name)
      .filter(Boolean) as string[];
  };

  return (
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/community-forum")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Thread
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Share your thoughts with the community
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <p className="text-red-700 dark:text-red-300">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <FormInput
                label="Thread Title *"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title for your thread..."
                error={errors.title}
                size="md"
                rounded="lg"
                className="mb-1"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {title.length}/255 characters
              </p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <TextAreaInput
                label="Content *"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                rows={8}
                size="md"
                error={errors.content}
              />
            </div>

            {/* Forum Type */}
            <div className="mb-6">
              <CustomSelect
                label="Forum Category"
                name="forumType"
                value={selectedForumType?.toString() || ""}
                onChange={(option) => setSelectedForumType(option?.value ? Number(option.value) : undefined)}
                options={[
                  { value: "", label: "Select a category (optional)" },
                  ...forumTypes.map(type => ({
                    value: type.id.toString(),
                    label: type.description ? `${type.title} - ${type.description}` : type.title
                  }))
                ]}
                height="3rem"
                fontSize="0.875rem"
              />
            </div>

            {/* Tags Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags (optional) - {selectedTags.length}/5
              </label>
              
              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {getSelectedTagNames().map((tagName, index) => {
                      const tagId = selectedTags[index];
                      return (
                        <span
                          key={tagId}
                          className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full"
                        >
                          {tagName}
                          <button
                            type="button"
                            onClick={() => removeTag(tagId)}
                            className="ml-2 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tag Search */}
              <div className="mb-3">
                <FormInput
                  label=""
                  name="tagSearch"
                  type="text"
                  value={tagSearchTerm}
                  onChange={(e) => setTagSearchTerm(e.target.value)}
                  placeholder="Search tags..."
                  icon={<Search className="w-4 h-4" />}
                  size="sm"
                  className="mb-0"
                />
              </div>

              {/* Available Tags */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-48 overflow-y-auto">
                {tagSearchLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Searching tags...</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => {
                      const isSelected = selectedTags.includes(tag.id);
                      const canSelect = selectedTags.length < 5;
                      
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.id)}
                          disabled={!isSelected && !canSelect}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-orange-500 text-white'
                              : canSelect
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <X className="w-3 h-3 inline mr-1" />
                              {tag.name}
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 inline mr-1" />
                              {tag.name}
                            </>
                          )}
                        </button>
                      );
                    })}
                    {availableTags.length === 0 && tagSearchTerm && !tagSearchLoading && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No tags found matching "{tagSearchTerm}"
                      </p>
                    )}
                    {availableTags.length === 0 && !tagSearchTerm && !tagSearchLoading && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No tags available
                      </p>
                    )}
                  </div>
                )}
              </div>
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tags}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button" 
              variant="outline"
              onClick={() => navigate("/community-forum")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="orange"
              disabled={loading || !title.trim() || !content.trim()}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  Create Thread
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewThread;
