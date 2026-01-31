import React, { useState } from "react";
import { Heart, MessageSquare, User, Clock, MoreVertical, Edit3, Trash2, X, Check, Flag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { TextAreaInput } from "../../components/ui";
import { ReportModal } from "../../components/ui/ReportModal";
import { toggleForumLike } from "../../api/endpoints/forumLikes";
import { deleteForumReply, updateForumReply } from "../../api/endpoints/forumReplies";
import type { ForumReply, User as UserType } from "../../interfaces";
import { formatRelativeTime } from "../../utils";

interface ReplyItemProps {
  reply: ForumReply;
  currentUser?: UserType;
  onReplyUpdate: (updatedReply: ForumReply) => void;
  onReplyDelete: (replyId: number) => void;
  onReplyToReply: (parentReply: ForumReply) => void;
  level?: number;
}

const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  currentUser,
  onReplyUpdate,
  onReplyDelete,
  onReplyToReply,
  level = 0,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const isOwner = currentUser?.id === reply.user_id;
  const maxNestingLevel = 3;

  const handleLikeToggle = async () => {
    if (!currentUser || likeLoading) return;

    setLikeLoading(true);
    try {
      const response = await toggleForumLike({ reply_id: reply.id });
      
      const updatedReply: ForumReply = {
        ...reply,
        likeCount: response.data.likeCount,
        isLikedByCurrentUser: response.data.liked,
      };
      
      onReplyUpdate(updatedReply);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || deleting) return;

    setDeleting(true);
    try {
      await deleteForumReply(reply.id);
      onReplyDelete(reply.id);
    } catch (error) {
      console.error("Error deleting reply:", error);
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const handleEditClick = () => {
    setEditContent(reply.content);
    setIsEditing(true);
    setShowDropdown(false);
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      setEditError("Content is required");
      return;
    }
    if (editContent.length < 3) {
      setEditError("Content must be at least 3 characters long");
      return;
    }

    setEditLoading(true);
    setEditError(null);
    try {
      const updatedReply = await updateForumReply(reply.id, {
        content: editContent.trim(),
      });
      
      onReplyUpdate(updatedReply);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating reply:", error);
      setEditError(error.response?.data?.message || "Failed to update reply");
    } finally {
      setEditLoading(false);
    }
  };



  return (
    <div className={`${level > 0 ? 'ml-3 sm:ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-2 sm:pl-4' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {reply.user?.profile_pic ? (
                <img
                  src={reply.user.profile_pic}
                  alt={reply.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {reply.user?.name || 'Anonymous'}
                </span>
                {reply.parent_id && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    · Replying
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {formatRelativeTime(reply.created_at)}
                {reply.updated_at !== reply.created_at && (
                  <span className="ml-2">· edited</span>
                )}
              </div>
            </div>
          </div>

          {(isOwner || currentUser) && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                disabled={deleting}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                  <div className="py-1">
                    {level < maxNestingLevel && (
                      <button
                        onClick={() => {
                          onReplyToReply(reply);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <MessageSquare className="w-3 h-3 mr-2" />
                        Reply
                      </button>
                    )}
                    {isOwner && (
                      <>
                        <button
                          onClick={handleEditClick}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        >
                          <Edit3 className="w-3 h-3 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirm(true);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </button>
                      </>
                    )}
                    {!isOwner && currentUser && (
                      <button
                        onClick={() => {
                          setShowReportModal(true);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center"
                      >
                        <Flag className="w-3 h-3 mr-2" />
                        Report
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mb-3 space-y-2">
            {editError && (
              <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-xs text-red-700 dark:text-red-300">{editError}</p>
              </div>
            )}
            <TextAreaInput
              label=""
              name="editContent"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Reply content..."
              rows={3}
              size="sm"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={editLoading}
                className="text-xs px-2 py-1 flex items-center"
              >
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
              <Button
                variant="orange"
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="text-xs px-2 py-1 flex items-center"
              >
                {editLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words overflow-wrap-anywhere">
              {reply.content}
            </p>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            onClick={handleLikeToggle}
            disabled={!currentUser || likeLoading}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              reply.isLikedByCurrentUser
                ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Heart className={`w-3 h-3 ${reply.isLikedByCurrentUser ? 'fill-current' : ''}`} />
            <span>{reply.likeCount || 0}</span>
          </button>
          
          {reply.children && reply.children.length > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
              <MessageSquare className="w-3 h-3" />
              <span>{reply.children.length}</span>
            </div>
          )}
          
          {level < maxNestingLevel && currentUser && (
            <button
              onClick={() => onReplyToReply(reply)}
              className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Reply</span>
            </button>
          )}
        </div>

        {deleteConfirm && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
              Delete this reply? This action cannot be undone.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="red"
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs px-3 py-1"
              >
                {deleting ? "Deleting..." : "Delete"}
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
        )}
      </div>

      {reply.children && reply.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {reply.children.map(childReply => (
            <ReplyItem
              key={childReply.id}
              reply={childReply}
              currentUser={currentUser}
              onReplyUpdate={onReplyUpdate}
              onReplyDelete={onReplyDelete}
              onReplyToReply={onReplyToReply}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          contentType={'forum_reply'}
          contentId={reply.id}
          contentAuthor={reply.user?.name || 'Anonymous'}
        />
      )}
    </div>
  );
};

export default ReplyItem;