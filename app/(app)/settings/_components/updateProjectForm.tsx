"use client";

import * as React from "react";
import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OrganizationForm1 from "@/components/auth/organization-form-1";


export function UpdateOrganizationForm({ organization }: { organization: any }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={next => setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          Edit organization
        </Button>
      </DialogTrigger>

      <DialogContent className="m-0 sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>Update your organization details.</DialogDescription>
        </DialogHeader>

            <OrganizationForm1 organization={organization} />


            <DialogFooter >
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

            </DialogFooter>
        
      </DialogContent>
    </Dialog>
  );
}


