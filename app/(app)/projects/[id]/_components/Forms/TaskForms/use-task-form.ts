// features/projects/forms/use-project-form.ts
import { api } from "@/convex/_generated/api";
import { useSmartForm } from "@/hooks/use-smart-form";
import { useMutationAction } from "@/hooks/use-mutation-action";
import {
  formSchema,
  toCreatePayload,
  toUpdatePayload,
} from "./task-form-schema";
import { type z } from "zod";
import { Id } from "@/convex/_generated/dataModel";
import { useCreateTask, useUpdateTask } from "../../../_hooks/useProject";

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
  const { execute: createTask } = useCreateTask();
  const { execute: updateTask } = useUpdateTask();
  return useSmartForm<FormInput, FormOutput>({
    schema: formSchema,
    defaultValues: initialData,

    onSubmit: async (values) => {
      if (type === "create") {
        await createTask(toCreatePayload(values, userId, orgId, projectId, userId));
      } else if (!initialData?._id && type === "update") {
        throw new Error("Missing task id for update");
      } else if (initialData?._id) {
        await updateTask(toUpdatePayload(values, initialData._id, userId, orgId));
      }
    },

  });
};
