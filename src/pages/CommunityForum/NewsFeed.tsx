
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  Heart,
  MessageCircle,
  User,
  Tag,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";
import { Button, FormInput, CustomSelect, Modal, CreateThreadModalContent, ThreadDetailsModalContent } from "../../components/ui";
import { getForumThreads } from "../../api/endpoints/threads";
import { getForumTags, searchForumTags } from "../../api/endpoints/forumTags";
import { getForumTypes } from "../../api/endpoints/forumTypes";
import { toggleForumLike } from "../../api/endpoints/forumLikes";
import type { 
  ForumThread, 
  ForumTag, 
  ForumType, 
  ForumSearchFilters
} from "../../interfaces";
import type { RootState } from "../../store/store";
import { usePagination } from "../../hooks/usePagination";
import { formatRelativeTime } from "../../utils";

const NewsFeed: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [tags, setTags] = useState<ForumTag[]>([]);
  const [availableTags, setAvailableTags] = useState<ForumTag[]>([]);
  const [forumTypes, setForumTypes] = useState<ForumType[]>([]);
  const [tagSearchLoading, setTagSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForumType, setSelectedForumType] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedThread, setExpandedThread] = useState<number | null>(null);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showThreadModal, setShowThreadModal] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);

  const {
    currentPage,
    pagination,
    handleNextPage,
    handlePrevPage,
    setPagination,
  } = usePagination();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [currentPage, selectedForumType, selectedTags, searchTerm]);

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

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const filters: ForumSearchFilters = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        forumId: selectedForumType,
        tagId: selectedTags.length === 1 ? selectedTags[0] : undefined,
      };

      const response = await getForumThreads(filters);
      
      if (response && response.data && Array.isArray(response.data.data)) {
        setThreads(response.data.data);
        
        const paginationData = {
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: Math.ceil(response.data.total / response.data.limit),
          hasNext: response.data.page * response.data.limit < response.data.total,
          hasPrev: response.data.page > 1
        };
        setPagination(paginationData);
      } else {
        console.error("Invalid response format - expected nested array in data.data field:", response);
        setThreads([]);
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (threadId: number) => {
    if (!user) return;

    try {
      const response = await toggleForumLike({ thread_id: threadId });
      
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId
            ? {
                ...thread,
                likeCount: response.data.likeCount,
                isLikedByCurrentUser: response.data.liked,
              }
            : thread
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchThreads();
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedForumType(undefined);
    setSelectedTags([]);
  };



  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Community Forum
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Connect, share, and learn from the fitness community
            </p>
          </div>
          <div className="flex flex-row w-full sm:w-auto gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/community-forum/my-threads")}
              className="flex-1 sm:flex-none text-sm sm:text-base"
            >
              My Threads
            </Button>
            <Button
              variant="orange"
              onClick={() => setShowCreateModal(true)}
              className="flex-1 sm:flex-none text-sm sm:text-base"
            >
              New Thread
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
            <div className="flex-1">
              <FormInput
                label=""
                name="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search threads..."
                icon={<Search className="w-4 h-4" />}
                size="md"
                className="mb-0"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="orange" className="flex-1 sm:flex-none text-sm sm:text-base">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none flex items-center justify-center text-sm sm:text-base"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t dark:border-gray-700 pt-4 space-y-4">
              {/* Forum Type Filter */}
              <div>
                <CustomSelect
                  label="Forum Type"
                  name="forumType"
                  value={selectedForumType?.toString() || ""}
                  onChange={(option) => setSelectedForumType(option?.value ? Number(option.value) : undefined)}
                  options={[
                    { value: "", label: "All Types" },
                    ...forumTypes.map(type => ({
                      value: type.id.toString(),
                      label: type.title
                    }))
                  ]}
                  height="2.5rem"
                  fontSize="0.875rem"
                />
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                
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
                
                <div className="max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  {tagSearchLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedTags.includes(tag.id)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))}
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
                
                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Selected tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <span
                            key={tagId}
                            className="inline-flex items-center px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded-full"
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => handleTagToggle(tagId)}
                              className="ml-1 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedForumType || selectedTags.length > 0) && (
                <div className="flex justify-end">
                  <Button className="flex items-center" variant="ghost" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Thread List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : !Array.isArray(threads) || threads.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No threads found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Be the first to start a discussion in the community!
              </p>
              <Button
                variant="orange"
                onClick={() => setShowCreateModal(true)}
              >
                Create First Thread
              </Button>
            </div>
          ) : (
            Array.isArray(threads) && threads.map(thread => (
              <div
                key={thread.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                {/* Thread Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-start space-x-2 sm:space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      {thread.user?.profile_pic ? (
                        <img
                          src={thread.user.profile_pic}
                          alt={thread.user.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 
                          className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors break-words"
                          onClick={() => {
                            setSelectedThreadId(thread.id);
                            setShowThreadModal(true);
                          }}
                        >
                          {thread.title}
                        </h3>
                        {thread.forumType && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full inline-block w-fit">
                            {thread.forumType.title}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{thread.user?.name || 'Anonymous'}</span>
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {formatRelativeTime(thread.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thread Content */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                    {expandedThread === thread.id
                      ? thread.content
                      : truncateContent(thread.content)
                    }
                  </p>
                  {thread.content.length > 200 && (
                    <button
                      onClick={() => setExpandedThread(
                        expandedThread === thread.id ? null : thread.id
                      )}
                      className="mt-2 text-orange-600 dark:text-orange-400 text-xs sm:text-sm hover:underline"
                    >
                      {expandedThread === thread.id ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>

                {/* Tags */}
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
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

                {/* Thread Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => handleLikeToggle(thread.id)}
                      className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                        thread.isLikedByCurrentUser
                          ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${thread.isLikedByCurrentUser ? 'fill-current' : ''}`} />
                      <span>{thread.likeCount || 0}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedThreadId(thread.id);
                        setShowThreadModal(true);
                      }}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{thread.replyCount || 0}</span>
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedThreadId(thread.id);
                      setShowThreadModal(true);
                    }}
                    className="w-full sm:w-auto text-sm"
                  >
                    View Thread
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && threads.length > 0 && (
          <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={!pagination.hasPrev}
              className="text-sm px-3 sm:px-4"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!pagination.hasNext}
              className="text-sm px-3 sm:px-4"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Create Thread Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Thread"
        size="lg"
      >
        <CreateThreadModalContent
          onClose={() => setShowCreateModal(false)}
          onThreadCreated={(newThread) => {
            setThreads(prev => [newThread, ...prev]);
            setPagination({
              ...pagination,
              total: pagination.total + 1
            });
          }}
        />
      </Modal>

      {/* Thread Details Modal */}
      <Modal
        isOpen={showThreadModal}
        onClose={() => {
          setShowThreadModal(false);
          setSelectedThreadId(null);
          fetchThreads();
        }}
        size="xl"
      >
        {selectedThreadId && (
          <ThreadDetailsModalContent
            threadId={selectedThreadId}
            onClose={() => {
              setShowThreadModal(false);
              setSelectedThreadId(null);
              fetchThreads();
            }}
            onThreadDeleted={(deletedThreadId) => {
              setThreads(prev => prev.filter(t => t.id !== deletedThreadId));
              setPagination({
                ...pagination,
                total: Math.max(pagination.total - 1, 0)
              });
            }}
            onThreadUpdated={(updatedThread) => {
              setThreads(prev => prev.map(t => 
                t.id === updatedThread.id ? updatedThread : t
              ));
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default NewsFeed;