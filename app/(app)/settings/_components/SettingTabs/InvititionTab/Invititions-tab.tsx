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
import { InvitationList } from "./invitation-list";


const Invitations = ({ invitations }: { invitations: any }) => {
  const [selectedMemberIds, setSelectedMemberIds] = React.useState<string[]>(
    [],
  );
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  async function handleDeleteSelected() {
    const removeMember = async (userId: string) =>
      await invitations?.revokeInvitation(userId);
    if (selectedMemberIds.length === 0) return;

    setIsDeleting(true);
    try {
      const results = await Promise.allSettled(
        selectedMemberIds.map((id) => removeMember(id)),
      );

      const succeededIds = results
        .map((r, i) => (r.status === "fulfilled" ? selectedMemberIds[i] : null))
        .filter(Boolean) as string[];

      const failedCount = results.filter((r) => r.status === "rejected").length;

      if (succeededIds.length > 0) {
        toast.success(`Removed ${succeededIds.length} invitation(s).`);
      }

      if (failedCount > 0) {
        toast.error(`${failedCount} invitation(s) failed to remove.`);
      }

      // Clear selection for succeeded ids
      setSelectedMemberIds([]);

      // Refresh invitations list
      if (typeof (invitations as any)?.refetch === "function") {
        (invitations as any).refetch();
      }
    } catch (err) {
      console.error("Bulk remove error:", err);
      toast.error("Failed to remove selected invitations. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start">
        <div>
          {selectedMemberIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
      </div>

      <InvitationList
        invitations={invitations}
      />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove selected members</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedMemberIds.length}{" "}
              selected member(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={async () => {
                setShowDeleteDialog(false);
                await handleDeleteSelected();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invitations;
