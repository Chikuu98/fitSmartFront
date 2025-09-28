import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Plus,
  Edit3,
  Trash2,
  Heart,
  MessageCircle,
  Clock,
  Tag,
  AlertCircle,
  Eye,
  MoreVertical,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { getMyForumThreads, deleteForumThread } from "../../api/endpoints/threads";
import type { ForumThread } from "../../interfaces";
import type { RootState } from "../../store/store";
import { usePagination } from "../../hooks/usePagination";
import { formatRelativeTime } from "../../utils";

const MyThreads: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const {
    currentPage,
    pagination,
    handleNextPage,
    handlePrevPage,
  } = usePagination();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyThreads();
  }, [user, navigate, currentPage]);

  const fetchMyThreads = async () => {
    setLoading(true);
    try {
      const response = await getMyForumThreads(currentPage, 10);
      // Handle the nested response structure from backend
      if (response && response.data && Array.isArray(response.data.data)) {
        setThreads(response.data.data);
      } else {
        console.error("Invalid response format - expected nested array in data.data field:", response);
        setThreads([]);
      }
      // Update pagination with response meta if available
      // Note: pagination state is managed by the usePagination hook
    } catch (error) {
      console.error("Error fetching my threads:", error);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteThread = async (threadId: number) => {
    setDeleting(threadId);
    try {
      await deleteForumThread(threadId);
      setThreads(prev => prev.filter(thread => thread.id !== threadId));
      setDeleteConfirm(null);
      // Show success message
    } catch (error) {
      console.error("Error deleting thread:", error);
      // Show error message
    } finally {
      setDeleting(null);
    }
  };



  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  const getThreadStats = (thread: ForumThread) => {
    return {
      likes: thread.likeCount || 0,
      replies: thread.replyCount || 0,
      views: 0 // This would need to be implemented in the backend
    };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Threads
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your community discussions
            </p>
          </div>
          <Button
            variant="orange"
            className="mt-4 sm:mt-0"
            onClick={() => navigate("/community-forum/create-thread")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Thread
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Threads</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{threads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Likes</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {threads.reduce((sum, thread) => sum + (thread.likeCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Replies</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {threads.reduce((sum, thread) => sum + (thread.replyCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Threads</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {threads.filter(thread => (thread.replyCount || 0) > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thread List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : !Array.isArray(threads) || threads.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No threads yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start engaging with the community by creating your first thread!
            </p>
            <Button
              variant="orange"
              onClick={() => navigate("/community-forum/create-thread")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Thread
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(threads) && threads.map(thread => {
              const stats = getThreadStats(thread);
              const isDeleting = deleting === thread.id;
              
              return (
                <div
                  key={thread.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  {/* Thread Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {thread.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatRelativeTime(thread.created_at)}
                            </span>
                            {thread.updated_at !== thread.created_at && (
                              <span className="flex items-center">
                                <Edit3 className="w-4 h-4 mr-1" />
                                Updated {formatRelativeTime(thread.updated_at)}
                              </span>
                            )}
                            {thread.forumType && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                {thread.forumType.title}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Thread Actions Dropdown */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === thread.id ? null : thread.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            disabled={isDeleting}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeDropdown === thread.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    navigate(`/community-forum/thread/${thread.id}`);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Thread
                                </button>
                                <button
                                  onClick={() => {
                                    navigate(`/community-forum/edit-thread/${thread.id}`);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit Thread
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirm(thread.id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Thread
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thread Content Preview */}
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {truncateContent(thread.content)}
                    </p>
                  </div>

                  {/* Tags */}
                  {thread.tags && thread.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {thread.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Thread Stats */}
                  <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{stats.likes} likes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{stats.replies} replies</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/community-forum/thread/${thread.id}`)}
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === thread.id && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                            Delete Thread
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                            Are you sure you want to delete this thread? This action cannot be undone.
                          </p>
                          <div className="flex space-x-3">
                            <Button
                              variant="red"
                              onClick={() => handleDeleteThread(thread.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                              disabled={isDeleting}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && threads.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyThreads;
