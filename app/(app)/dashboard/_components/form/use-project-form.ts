// features/projects/forms/use-project-form.ts
import { api } from "@/convex/_generated/api";
import { useSmartForm } from "@/hooks/use-smart-form";
import {
  formSchema,
  toCreatePayload,
  toUpdatePayload,
} from "./project-form-schema";
import { type z } from "zod";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationAction } from "@/hooks/use-mutation-action";
import { useCreateProject, useUpdateProject } from "../../_hooks/useDashboard";

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
  const { execute: createProject } = useCreateProject();
  const { execute: updateProject } = useUpdateProject();
  return useSmartForm<FormInput, FormOutput>({
    schema: formSchema,
    defaultValues: initialData,

    onSubmit: async (values) => {
      if (type === "create") {
        await createProject(toCreatePayload(values, userId, orgId));
      } else if (!initialData?._id && type === "update") {
        throw new Error("Missing project id for update");
      } else if (initialData?._id) {
        await updateProject(toUpdatePayload(values, initialData._id, userId, orgId));
      }
    },
  });
};
