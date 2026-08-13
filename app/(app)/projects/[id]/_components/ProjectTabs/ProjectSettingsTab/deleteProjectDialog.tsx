import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, Dialog } from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDeleteProject } from "../../../_hooks/useProject";

export function DeleteProjectDialog({ projectId, userId, orgId }: { projectId: Id<"projects"> | undefined; userId: Id<"users">; orgId: Id<"organizations"> }) {
    const { execute: deleteProject } = useDeleteProject();
  const [open, setOpen] = React.useState(false);

  async function handleDelete() {
    if (!projectId) return;
    try {
      window.history.back();
      await deleteProject({ projectId, userId, orgId });
      toast.success("Project deleted");
      // close dialog then go back to previous page
      setOpen(false);
    } catch (err) {
      console.error("Failed to delete project", err);
      toast.error("Failed to delete project");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className='text-destructive '>Delete Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this project? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}