
"use client";

import * as React from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MultiInput from "./multi-input";



export function InviteDialog({organization }: any) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          <Plus />
          Invite Members
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite Members to this Organization</DialogTitle>
        </DialogHeader>
        <MultiInput organization={organization} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

