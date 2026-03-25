import { Id } from "@/convex/_generated/dataModel";
import * as z from "zod";

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
  priority: z.string().min(1, "Please select an item"),
  assignee: z.string().min(1, "Please select an item"),
  status: z.string().min(1, "Please select an item"),
  dueDate: z.date({ error: "This field is required" }),
});



type FormOutput = z.output<typeof formSchema>;

export const toCreatePayload = (
  values: FormOutput,
  userId: Id<"users">,
  orgId: Id<"organizations">,
  projectId: Id<"projects">,
  createdBy: Id<"users">
) => ({
  name: values.name,
  description: values.description ?? "",
  // cast to the server's literal union
  priority: values.priority as "low" | "medium" | "high",
  assignee: values.assignee as Id<"users">,
  // cast to server's status union
  status: values.status as "todo" | "in-progress" | "done",
  // server expects a number
  dueDate: values.dueDate instanceof Date ? values.dueDate.getTime() : Number(values.dueDate),
  userId,
  orgId,
  createdBy,
  projectId,
});

export const toUpdatePayload = (
  values: FormOutput,
  taskId: Id<"tasks">,
  userId: Id<"users">,
  orgId: Id<"organizations">
) => ({
  taskId,
  name: values.name,
  description: values.description ?? "",
  priority: values.priority as "low" | "medium" | "high",
  assignee: values.assignee ? (values.assignee as Id<"users">) : undefined,
  status: values.status as "todo" | "in-progress" | "done",
  dueDate: values.dueDate instanceof Date ? values.dueDate.getTime() : Number(values.dueDate),
  userId,
  orgId,
});