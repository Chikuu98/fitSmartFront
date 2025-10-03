import React, { useState } from "react";
import { Send, X } from "lucide-react";
import { Button, TextAreaInput } from "../../components/ui";
import { createForumReply } from "../../api/endpoints/forumReplies";
import type { ForumReply, CreateForumReplyDto } from "../../interfaces";

interface ReplyFormProps {
  threadId: number;
  parentReply?: ForumReply;
  onReplyCreated: (reply: ForumReply) => void;
  onCancel?: () => void;
  placeholder?: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  threadId,
  parentReply,
  onReplyCreated,
  onCancel,
  placeholder = "Write your reply...",
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Reply content is required");
      return;
    }

    if (content.length < 3) {
      setError("Reply must be at least 3 characters long");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const replyData: Omit<CreateForumReplyDto, 'thread_id'> = {
        content: content.trim(),
        parent_id: parentReply?.id,
      };

      const newReply = await createForumReply(threadId, replyData);
      
      onReplyCreated(newReply);
      setContent("");
      
      if (onCancel) {
        onCancel();
      }
    } catch (error: any) {
      console.error("Error creating reply:", error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to create reply. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      {parentReply && (
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
          <span className="text-gray-600 dark:text-gray-400">Replying to </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {parentReply.user?.name || 'Anonymous'}
          </span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <TextAreaInput
          label=""
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={3}
          size="sm"
          disabled={loading}
          error={error || undefined}
          className="mb-0"
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {content.length} characters
          </div>
          
          <div className="flex space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="text-sm px-3 py-1 flex items-center"
              >
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="orange"
              disabled={loading || !content.trim()}
              className="text-sm px-3 py-1 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 mr-1" />
                  Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;