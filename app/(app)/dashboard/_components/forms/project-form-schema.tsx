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
  members: z
    .array(z.string(), { error: "Please select at least one item" })
    .min(1, "Please select at least one item")
    .optional(),
});
