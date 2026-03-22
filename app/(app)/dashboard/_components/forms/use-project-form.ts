// features/projects/forms/use-project-form.ts
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useFormHandler } from "@/hooks/use-smart-form";
import { formSchema } from "./project-form-schema";

type Type = "create" | "update";

export const useProjectForm = ({
  type,
  initialData,
}: {
    type: Type;
    //eslint-disable-next-line
  initialData?: any;
}) => {
  const create = useMutation(api.projects.mutations.createProject);
    const update = useMutation(api.projects.mutations.updateProject);

  return useFormHandler({
    schema: formSchema,
      defaultValues: initialData,

    onSubmit: async (values) => {
      if (type === "create") {
        await create(values);
      } else {
        await update({ ...values, id: initialData._id });
      }
    },

    successMessage:
      type === "create"
        ? "Project created"
        : "Project updated",

    errorMessage:
      type === "create"
        ? "Failed to create project"
        : "Failed to update project",
  });
};