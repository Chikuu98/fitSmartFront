import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  User,
  Clock,
  Tag,
  Edit3,
  Trash2,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { Button } from "./button";
import ReplyItem from "./ReplyItem";
import ReplyForm from "./ReplyForm";
import { 
  getForumThreadById, 
  deleteForumThread 
} from "../../api/endpoints/threads";
import { getForumRepliesByThreadId } from "../../api/endpoints/forumReplies";
import { toggleForumLike } from "../../api/endpoints/forumLikes";
import type { 
  ForumThread, 
  ForumReply 
} from "../../interfaces";
import type { RootState } from "../../store/store";
import { formatRelativeTime } from "../../utils";

interface ThreadDetailsModalContentProps {
  threadId: number;
  onClose: () => void;
  onThreadDeleted: (threadId: number) => void;
  onThreadUpdated: (thread: ForumThread) => void;
}

const ThreadDetailsModalContent: React.FC<ThreadDetailsModalContentProps> = ({
  threadId,
  onClose,
  onThreadDeleted,
  onThreadUpdated,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ForumReply | null>(null);

  const isOwner = user?.id === thread?.user_id;

  useEffect(() => {
    fetchThreadAndReplies();
  }, [threadId]);

  const fetchThreadAndReplies = async () => {
    setLoading(true);
    try {
      const [threadData, repliesData] = await Promise.all([
        getForumThreadById(threadId),
        getForumRepliesByThreadId(threadId)
      ]);
      setThread(threadData);
      
      // Handle nested response structure
      if (repliesData && Array.isArray(repliesData.data)) {
        setReplies(repliesData.data);
      } else if (repliesData && repliesData.data && Array.isArray(repliesData.data.data)) {
        setReplies(repliesData.data.data);
      } else {
        console.error("Invalid replies format:", repliesData);
        setReplies([]);
      }
    } catch (error) {
      console.error("Error fetching thread details:", error);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!user || !thread || likeLoading) return;

    setLikeLoading(true);
    try {
      const response = await toggleForumLike({ thread_id: thread.id });
      
      const updatedThread = {
        ...thread,
        likeCount: response.data.likeCount,
        isLikedByCurrentUser: response.data.liked,
      };
      
      setThread(updatedThread);
      onThreadUpdated(updatedThread);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDeleteThread = async () => {
    if (!thread || !isOwner || deleting) return;

    setDeleting(true);
    try {
      await deleteForumThread(thread.id);
      onThreadDeleted(thread.id);
      onClose();
    } catch (error) {
      console.error("Error deleting thread:", error);
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const handleReplyCreated = async (newReply: ForumReply) => {
    if (newReply.parent_id) {
      try {
        const repliesData = await getForumRepliesByThreadId(threadId);
        
        // Handle nested response structure
        if (repliesData && Array.isArray(repliesData.data)) {
          setReplies(repliesData.data);
        } else if (repliesData && repliesData.data && Array.isArray(repliesData.data.data)) {
          setReplies(repliesData.data.data);
        }
      } catch (error) {
        console.error("Error refetching replies:", error);
        // Fallback to manual addition if refetch fails
        setReplies(prev => {
          const addToParent = (replies: ForumReply[]): ForumReply[] => {
            return replies.map(reply => {
              if (reply.id === newReply.parent_id) {
                return {
                  ...reply,
                  children: [...(reply.children || []), newReply]
                };
              } else if (reply.children && reply.children.length > 0) {
                return {
                  ...reply,
                  children: addToParent(reply.children)
                };
              }
              return reply;
            });
          };
          return addToParent(prev);
        });
      }
    } else {
      // For top-level replies, just add to the beginning
      setReplies(prev => [newReply, ...prev]);
    }
    
    setReplyingTo(null);
    
    // Update thread reply count
    if (thread) {
      const updatedThread = {
        ...thread,
        replyCount: (thread.replyCount || 0) + 1
      };
      setThread(updatedThread);
      onThreadUpdated(updatedThread);
    }
  };

  const handleReplyUpdate = (updatedReply: ForumReply) => {
    // Function to recursively find and update the reply
    const updateReply = (replies: ForumReply[]): ForumReply[] => {
      return replies.map(reply => {
        if (reply.id === updatedReply.id) {
          return updatedReply;
        } else if (reply.children && reply.children.length > 0) {
          return {
            ...reply,
            children: updateReply(reply.children)
          };
        }
        return reply;
      });
    };
    
    setReplies(prev => updateReply(prev));
  };

  const handleReplyDelete = (replyId: number) => {
    // Function to recursively find and remove the reply
    const removeReply = (replies: ForumReply[]): ForumReply[] => {
      return replies.filter(reply => reply.id !== replyId).map(reply => {
        if (reply.children && reply.children.length > 0) {
          return {
            ...reply,
            children: removeReply(reply.children)
          };
        }
        return reply;
      });
    };
    
    setReplies(prev => removeReply(prev));
    
    // Update thread reply count
    if (thread) {
      const updatedThread = {
        ...thread,
        replyCount: Math.max((thread.replyCount || 1) - 1, 0)
      };
      setThread(updatedThread);
      onThreadUpdated(updatedThread);
    }
  };

  // Process already nested replies from API
  const processNestedReplies = (replies: ForumReply[]): ForumReply[] => {
    // Safety check: ensure replies is an array
    if (!Array.isArray(replies)) {
      console.error("processNestedReplies: replies is not an array:", replies);
      return [];
    }
    
    // Filter out any null/undefined replies and ensure they have required properties
    const validReplies = replies.filter(reply => {
      const isValid = reply && 
        typeof reply === 'object' && 
        reply.id !== undefined && 
        reply.id !== null;
      
      if (!isValid) {
        console.warn("Filtering out invalid reply:", reply);
      }
      
      return isValid;
    });

    if (validReplies.length === 0) {
      return [];
    }
    
    // The replies are already nested with children arrays from the API
    // Just ensure children arrays exist and are properly formatted
    const processReply = (reply: ForumReply): ForumReply => {
      const processedReply = {
        ...reply,
        children: reply.children && Array.isArray(reply.children) 
          ? reply.children.map(processReply) 
          : []
      };
      
      return processedReply;
    };
    
    return validReplies.map(processReply);
  };

  const nestedReplies = processNestedReplies(replies);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Thread not found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The thread you're looking for doesn't exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Thread Content */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        {/* Thread Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0">
              {thread.user?.profile_pic ? (
                <img
                  src={thread.user.profile_pic}
                  alt={thread.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                  {thread.title}
                </h2>
                {thread.forumType && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    {thread.forumType.title}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {thread.user?.name || 'Anonymous'}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatRelativeTime(thread.created_at)}
                </span>
              </div>
            </div>
          </div>
          
          {isOwner && (
            <div className="relative ml-2">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={deleting}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        // TODO: Implement edit functionality in modal
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Thread
                    </button>
                    <button
                      onClick={() => {
                        setDeleteConfirm(true);
                        setShowDropdown(false);
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
          )}
        </div>

        {/* Thread Content */}
        <div className="mb-3">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {thread.content}
          </p>
        </div>

        {/* Tags */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
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
        <div className="flex items-center space-x-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={handleLikeToggle}
            disabled={!user || likeLoading}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
              thread.isLikedByCurrentUser
                ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${thread.isLikedByCurrentUser ? 'fill-current' : ''}`} />
            <span>{thread.likeCount || 0}</span>
          </button>
          
          <div className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span>{replies.length} replies</span>
          </div>
        </div>

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  Delete Thread
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Are you sure you want to delete this thread? This action cannot be undone and will also delete all replies.
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="red"
                    onClick={handleDeleteThread}
                    disabled={deleting}
                    className="text-xs px-3 py-1"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      "Delete Thread"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirm(false)}
                    disabled={deleting}
                    className="text-xs px-3 py-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply Form */}
      {user && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <ReplyForm
            threadId={thread.id}
            parentReply={replyingTo || undefined}
            onReplyCreated={handleReplyCreated}
            onCancel={replyingTo ? () => setReplyingTo(null) : undefined}
            placeholder={replyingTo ? `Reply to ${replyingTo.user?.name || 'Anonymous'}...` : "Write a reply..."}
          />
        </div>
      )}

      {/* Replies Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            Replies ({replies.length})
          </h3>
        </div>
        
        {nestedReplies.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No replies yet. Be the first to join the discussion!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            {nestedReplies.map(reply => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                currentUser={user || undefined}
                onReplyUpdate={handleReplyUpdate}
                onReplyDelete={handleReplyDelete}
                onReplyToReply={setReplyingTo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadDetailsModalContent;