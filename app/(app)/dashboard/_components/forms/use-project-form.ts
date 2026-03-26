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
  const { execute: createProject } = useMutationAction(api.projects.mutations.createProject, {
    successMessage: "Project created",
    errorMessage: "Failed to create project",
  });
  const { execute: updateProject } = useMutationAction(api.projects.mutations.updateProject, {
    successMessage: "Project updated",
    errorMessage: "Failed to update project",
  });
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
