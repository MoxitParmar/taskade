import { Id } from "@/convex/_generated/dataModel";
import * as z from "zod";

//eslint-disable-next-line
export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}
export const formSchema = z.object({
  name: z.string({ error: "This field is required" }),
  description: z.string({ error: "This field is required" }).optional(),
  status: z.string().min(1, "Please select an item"),
  lead: z.string().min(1, "Please select an item"),
});


type FormOutput = z.output<typeof formSchema>;

export const toCreatePayload = (
  values: FormOutput,
  userId: Id<"users">,
  orgId: Id<"organizations">
) => ({
  name: values.name,
  description: values.description ?? "",
  status: values.status,
  lead: values.lead as Id<"users">,
  userId,
  orgId,
});

export const toUpdatePayload = (
  values: FormOutput,
  projectId: Id<"projects">,
  userId: Id<"users">,
  orgId: Id<"organizations">
) => ({
  projectId,
  name: values.name,
  description: values.description ?? "",
  status: values.status,
  lead: values.lead as Id<"users">,
  userId,
  orgId,
});