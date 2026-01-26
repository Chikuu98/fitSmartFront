import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  User,
  Clock,
  Tag,
  Trash2,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import ReplyItem from "../../components/ui/ReplyItem";
import ReplyForm from "../../components/ui/ReplyForm";
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

const ThreadDetails: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
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
    if (threadId) {
      fetchThreadAndReplies();
    }
  }, [threadId]);

  const fetchThreadAndReplies = async () => {
    if (!threadId) return;

    setLoading(true);
    try {
      const [threadData, repliesData] = await Promise.all([
        getForumThreadById(Number(threadId)),
        getForumRepliesByThreadId(Number(threadId))
      ]);
      setThread(threadData);
      
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
      navigate("/community-forum");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!user || !thread || likeLoading) return;

    setLikeLoading(true);
    try {
      const response = await toggleForumLike({ thread_id: thread.id });
      
      setThread(prev => prev ? {
        ...prev,
        likeCount: response.data.likeCount,
        isLikedByCurrentUser: response.data.liked,
      } : null);
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
      navigate("/community-forum", {
        state: { message: "Thread deleted successfully" }
      });
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
        const repliesData = await getForumRepliesByThreadId(Number(threadId));
        
        if (repliesData && Array.isArray(repliesData.data)) {
          setReplies(repliesData.data);
        } else if (repliesData && repliesData.data && Array.isArray(repliesData.data.data)) {
          setReplies(repliesData.data.data);
        }
      } catch (error) {
        console.error("Error refetching replies:", error);
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
      setReplies(prev => [newReply, ...prev]);
    }
    
    setReplyingTo(null);
    
    setThread(prev => prev ? {
      ...prev,
      replyCount: (prev.replyCount || 0) + 1
    } : null);
  };

  const handleReplyUpdate = (updatedReply: ForumReply) => {
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
    
    setThread(prev => prev ? {
      ...prev,
      replyCount: Math.max((prev.replyCount || 1) - 1, 0)
    } : null);
  };

  const processNestedReplies = (replies: ForumReply[]): ForumReply[] => {
    
    if (!Array.isArray(replies)) {
      console.error("processNestedReplies: replies is not an array:", replies);
      return [];
    }
    
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Thread not found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The thread you're looking for doesn't exist or has been deleted.
          </p>
          <Button variant="orange" onClick={() => navigate("/community-forum")}>
            Back to Forum
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/community-forum")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={deleting}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                  <div className="py-1">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          {/* Thread Header */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              {thread.user?.profile_pic ? (
                <img
                  src={thread.user.profile_pic}
                  alt={thread.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {thread.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {thread.user?.name || 'Anonymous'}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatRelativeTime(thread.created_at)}
                </span>
                {thread.forumType && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    {thread.forumType.title}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Thread Content */}
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {thread.content}
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

          {/* Thread Actions */}
          <div className="flex items-center space-x-4 pt-4 border-t dark:border-gray-700">
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
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Delete Thread
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    Are you sure you want to delete this thread? This action cannot be undone and will also delete all replies.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      variant="red"
                      onClick={handleDeleteThread}
                      disabled={deleting}
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
          <div className="mb-6">
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Replies ({replies.length})
          </h3>
          
          {nestedReplies.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                No replies yet. Be the first to join the discussion!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
    </div>
  );
};

export default ThreadDetails;