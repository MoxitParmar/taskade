"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { ChatMessage } from "./chatmessage";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

import { toast } from "sonner";

import { Id } from "@/convex/_generated/dataModel";
import { Comment } from "@/convex/comments/models";
import { PaginatedResult } from "@/hooks/use-smart-query";
import { useCreateComment, useDeleteComment, useUpdateComment } from "../../_hooks/useTaskComments";
import { useUserContext } from "@/hooks/use-user-context";

type Message = {
  id: Id<"taskComments">;
  text: string;
  timestamp: string;
  isOwn: boolean;
  avatar: string;
  initials: string;
  name: string;
};

export function ChatContainer({
  comments,
  taskId,
}: {
  comments: PaginatedResult<Comment>;
  taskId: Id<"tasks">;
}) {
  const userData = useUserContext()?.data;
  const currentUserName = userData?.user?.name || "";
  const userId = userData?.userId as Id<"users">;
  const orgId = userData?.orgId as Id<"organizations">;

  const { execute: deleteComment } = useDeleteComment();
  const { execute: updateComment } = useUpdateComment();
  const { execute: createComment } = useCreateComment();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // smartQuery already handles fetching — derive messages directly from the comments prop
  const messages = useMemo<Message[]>(
    () =>
      [...(comments?.page ?? [])]
        .reverse()
        .map((c) => ({
          id: c._id,
          text: c.content,
          timestamp: new Date(c.createdAt).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isOwn: Boolean(currentUserName && c.authorName === currentUserName),
          avatar: c.authorAvatar,
          initials: (c.authorName || "")
            .split(" ")
            .map((s) => s[0])
            .join("")
            .slice(0, 2),
          name: c.authorName || "Unknown",
        })),
    [comments, currentUserName]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    try {
      await createComment({ content: inputValue, taskId, userId, orgId });
      setInputValue("");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to create comment");
    }
  };

  const handleEditMessage = async (id: Id<"taskComments">, newText: string) => {
    if (!newText.trim()) return;
    try {
      await updateComment({ commentId: id, content: newText, userId, orgId });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to update comment");
    }
  };

  const handleDeleteConfirm = async (id: Id<"taskComments">) => {
    try {
      await deleteComment({ commentId: id, userId, orgId, taskId });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to delete comment");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col  bg-card h-160">
      <header className="border-b p-2">
        <h2 className="text-xl font-semibold">Task Chat</h2>
      </header>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            id={message.id}
            text={message.text}
            timestamp={message.timestamp}
            isOwn={message.isOwn}
            avatar={message.avatar}
            initials={message.initials}
            onEdit={handleEditMessage}
            onDeleteConfirm={handleDeleteConfirm}
            name={message.name}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-6">
        <div className="flex gap-3 items-center max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-3 rounded-full border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            onClick={handleSendMessage}
            className="h-11 w-11 p-0 rounded-full flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
