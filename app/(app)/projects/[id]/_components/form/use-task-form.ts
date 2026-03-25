// features/projects/forms/use-project-form.ts
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useSmartForm } from "@/hooks/use-smart-form";
import {
  formSchema,
  toCreatePayload,
  toUpdatePayload,
} from "./task-form-schema";
import { type z } from "zod";
import { Id } from "@/convex/_generated/dataModel";

type Type = "create" | "update";
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;
export type initialData = (FormInput & { _id: Id<"tasks"> }) | undefined;

export const useTaskForm = ({
  type,
  initialData,
  userId,
  orgId,
  projectId,
}: {
  type: Type;
  initialData?: (FormInput & { _id: Id<"tasks"> }) | undefined;
  userId: Id<"users">;
  orgId: Id<"organizations">;
  projectId: Id<"projects">;
}) => {
  const create = useMutation(api.tasks.mutations.createTask);
  const update = useMutation(api.tasks.mutations.updateTask);

  return useSmartForm<FormInput, FormOutput>({
    schema: formSchema,
    defaultValues: initialData,

    onSubmit: async (values) => {
      if (type === "create") {
        await create(toCreatePayload(values, userId, orgId, projectId, userId));
      } else if (!initialData?._id && type === "update") {
        throw new Error("Missing task id for update");
      } else if (initialData?._id) {
        await update(toUpdatePayload(values, initialData._id, userId, orgId));
      }
    },

    successMessage: type === "create" ? "Task created" : "Task updated",

    errorMessage:
      type === "create"
        ? "Failed to create task"
        : "Failed to update task",
  });
};
