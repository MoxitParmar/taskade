"use client";

import { useSmartForm } from "@/hooks/use-smart-form";
import {
  addMemberFormSchema,
  type FormInput,
  type FormOutput,
} from "./add-member-form-schema";
import { Id } from "@/convex/_generated/dataModel";
import { useAddProjectMember } from "../../_hooks/useDashboard";

export const useAddMemberForm = ({
  projectId,
  orgId,
}: {
  projectId: Id<"projects">;
  orgId: Id<"organizations">;
}) => {
  const { execute: addProjectMember } = useAddProjectMember();

  return useSmartForm<FormInput, FormOutput>({
    schema: addMemberFormSchema,
    defaultValues: {
      members: [],
    },

    onSubmit: async (values) => {
      const membersToAdd = values.members;

      if (membersToAdd.length === 0) {
        throw new Error("Select at least one member to add");
      }

      const results = await Promise.allSettled(
        membersToAdd.map((userId) =>
          addProjectMember({
            projectId,
            userId: userId as Id<"users">,
            orgId,
          }),
        ),
      );

      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      if (failed > 0) {
        throw new Error(`Failed to add ${failed} member${failed > 1 ? "s" : ""}`);
      }
    },
  });
};
