import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, Dialog } from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../../_hooks/useTask";


export function DeleteTaskDialog({ taskId, orgId }: { taskId: Id<"tasks"> | undefined;  orgId: Id<"organizations"> }) {
    const { execute: deleteTask } = useDeleteTask();
  const [open, setOpen] = React.useState(false);

  async function handleDelete() {
    if (!taskId) return;
    try {
      window.history.back();
      await deleteTask({ taskId, orgId });
      toast.success("Task deleted");
      // close dialog then go back to previous page
      setOpen(false);
    } catch (err) {
      console.error("Failed to delete task", err);
      toast.error("Failed to delete task");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className='text-destructive '>Delete Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
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