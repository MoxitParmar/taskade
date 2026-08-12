import { useSmartForm } from "@/hooks/use-smart-form";
import {
  formSchema,
  toCreatePayload,
  toUpdatePayload,
} from "./project-form-schema";
import { type z } from "zod";
import { Id } from "@/convex/_generated/dataModel";
import { useCreateProject, useUpdateProject } from "../../_hooks/useDashboard";

type Type = "create" | "update";
type FormInput = z.input<typeof formSchema>;
 type FormOutput = z.output<typeof formSchema>;
type ProjectFormInitialData = Omit<FormInput, "lead"> & {
  _id: Id<"projects">;
  lead: string | { _id: Id<"users"> };
};

export type initialData = ProjectFormInitialData | undefined;

export const useProjectForm = ({
  type,
  initialData,
  userId,
  orgId,
}: {
  type: Type;
  initialData?: initialData ;
  userId: Id<"users">;
  orgId: Id<"organizations">;
}) => {
    const defaultValues = initialData
    ? {
        ...initialData,
        lead:
          typeof initialData.lead === "string"
            ? initialData.lead
            : initialData.lead?._id ?? "",
      }
    : undefined;

  const { execute: createProject } = useCreateProject();
  const { execute: updateProject } = useUpdateProject();
  return useSmartForm<FormInput, FormOutput>({
    schema: formSchema,
    defaultValues,

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
