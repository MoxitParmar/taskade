'use client';

import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Check, X } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';

interface ChatMessageProps {
  id: Id<"taskComments">;
  text: string;
  timestamp: string;
  isOwn: boolean;
  avatar: string;
  initials: string;
  onEdit: (id: Id<"taskComments">, newText: string) => void;
  onDeleteConfirm: (id: Id<"taskComments">) => void;
  name: string;
}

export function ChatMessage({
  id,
  text,
  timestamp,
  isOwn,
  avatar,
  initials,
  onEdit,
  onDeleteConfirm,
  name
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(id, editText);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    onDeleteConfirm(id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className={`flex gap-3  items-center ${isOwn ? 'flex-row-reverse' : ''}`}>

        {/* Avatar */}
        <Avatar className="h-8 w-8 mt-1 shrink-0">
          <AvatarImage src={avatar} alt={initials} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        {/* Message with Menu Button */}
        <div className={`flex gap-1 items-center ${isOwn ? 'flex-row-reverse' : ''}`}>
          {/* Menu Button - Next to Bubble */}


          {/* Message Container */}
          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
            <div className="text-muted-foreground px-1">{name}</div>
            {/* Message Bubble with fixed width container */}
            <div className="w-80">
              <div
                className={`px-4 py-2 rounded-2xl ${isOwn
                  ? 'bg-primary/60 text-primary-foreground'
                  : 'bg-background text-muted-foreground'
                  }`}
              >
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={`w-full p-2 rounded border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring ${isOwn
                        ? 'bg-primary/10 text-primary-foreground border-primary-foreground/30'
                        : 'bg-muted/50 text-muted-foreground border-muted-foreground/30'
                        }`}
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="h-7 w-7 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="h-7 px-2"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed wrap-break-word">{text}</p>
                )}
              </div>

            </div>

            {/* Timestamp */}
            <p className="text-xs px-1 text-muted-foreground mt-1">{timestamp}</p>
          </div>
          {isOwn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 hover:bg-muted rounded transition-colors shrink-0 mt-0.5"
                  aria-label="Message options"
                >
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? 'end' : 'start'}>
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer"
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="cursor-pointer text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-sm border border-border">
            <h2 className="text-lg font-semibold mb-2">Delete message?</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
