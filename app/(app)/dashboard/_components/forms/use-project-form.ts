// features/projects/forms/use-project-form.ts
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useSmartForm } from "@/hooks/use-smart-form";
import {
  formSchema,
  toCreatePayload,
  toUpdatePayload,
} from "./project-form-schema";
import { type z } from "zod";
import { Id } from "@/convex/_generated/dataModel";

type Type = "create" | "update";
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;
export type initialData = (FormInput & { _id: Id<"projects"> }) | undefined;

export const useProjectForm = ({
  type,
  initialData,
  userId,
  orgId,
}: {
  type: Type;
  initialData?: (FormInput & { _id: Id<"projects"> }) | undefined;
  userId: Id<"users">;
  orgId: Id<"organizations">;
}) => {
  const create = useMutation(api.projects.mutations.createProject);
  const update = useMutation(api.projects.mutations.updateProject);

  return useSmartForm<FormInput, FormOutput>({
    schema: formSchema,
    defaultValues: initialData,

    onSubmit: async (values) => {
      if (type === "create") {
        await create(toCreatePayload(values, userId, orgId));
      } else if (!initialData?._id && type === "update") {
        throw new Error("Missing project id for update");
      } else if (initialData?._id) {
        await update(toUpdatePayload(values, initialData._id, userId, orgId));
      }
    },

    successMessage: type === "create" ? "Project created" : "Project updated",

    errorMessage:
      type === "create"
        ? "Failed to create project"
        : "Failed to update project",
  });
};
