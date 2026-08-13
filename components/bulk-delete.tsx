"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type BulkDeleteProps = {
  selectedIds: string[];
  onDeleteItem: (id: string) => Promise<void>;
  onClearSelection: () => void;
  itemLabel?: string;
};

export function BulkDelete({
  selectedIds,
  onDeleteItem,
  onClearSelection,
  itemLabel = "item",
}: BulkDeleteProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);

  const handleDelete = async () => {
    setShowDialog(false);
    setIsDeleting(true);

    let removed: string[] = [];
    let failed = 0;

    try {
      for (const id of selectedIds) {
        try {
          await onDeleteItem(id);
          removed.push(id);
        } catch (err) {
          console.error(`Failed to delete ${itemLabel} ${id}:`, err);
          failed += 1;
        }
      }

      if (removed.length > 0) {
        toast.success(`Removed ${removed.length} ${itemLabel}(s).`);
      }
      if (failed > 0) {
        toast.error(`${failed} ${itemLabel}(s) failed to remove.`);
      }

      onClearSelection();
    } catch (err) {
      console.error("Bulk remove error:", err);
      toast.error(`Failed to remove selected ${itemLabel}(s). Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowDialog(true)}
        disabled={isDeleting}
      >
        {isDeleting ? "Removing..." : `Remove (${selectedIds.length})`}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove selected {itemLabel}(s)</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedIds.length} selected {itemLabel}(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}