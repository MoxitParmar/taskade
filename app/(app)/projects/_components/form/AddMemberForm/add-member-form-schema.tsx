import * as z from "zod";

export const addMemberFormSchema = z.object({
  members: z
    .array(z.string())
    .min(1, "Select at least one member to add"),
});

type FormInput = z.input<typeof addMemberFormSchema>;
type FormOutput = z.output<typeof addMemberFormSchema>;

export type { FormInput, FormOutput };