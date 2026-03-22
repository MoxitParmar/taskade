"use client";

import * as React from "react";
import {  Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ProjectForm } from "./proejct-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"


export function ProjectDialog() {
  const [open, setOpen] = React.useState(false);


  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          <Plus />
          New Project
        </Button>
      </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg p-0">
          <VisuallyHidden>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
          </VisuallyHidden>
        <ProjectForm type="create" />
      </DialogContent>
    </Dialog>
  );
}
