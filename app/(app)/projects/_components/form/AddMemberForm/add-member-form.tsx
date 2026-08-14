"use client";
import { Controller } from "react-hook-form";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddMemberForm } from "./use-add-member-form";
import { Id } from "@/convex/_generated/dataModel";

export type MemberOption = {
  label: string;
  value: string;
};

export function AddMemberForm({
    orgId,
  projectId,
  members,
}: {
  projectId: Id<"projects">;
    orgId: Id<"organizations">;
  members: MemberOption[];
}) {
  const { form, onSubmit, isSubmitting, isSuccess } = useAddMemberForm({
    projectId,
    orgId,
  });

  if (isSuccess) {
    return (
      <div className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
          className="h-full py-6 px-3"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-2"
          >
            <Check className="size-8" />
          </motion.div>
          <h2 className="text-center text-2xl text-pretty font-bold mb-2">
            Members Added
          </h2>
          <p className="text-center text-lg text-pretty text-muted-foreground">
            Selected members have been added to the project.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border max-w-3xl mx-auto"
    >
      <FieldGroup className="grid md:grid-cols-6 gap-4 mb-6">
        <h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
          {" "}
          Add Project Members
        </h2>

        <Controller
          name="members"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="gap-1 col-span-full"
            >
              <FieldLabel htmlFor="members">Members *</FieldLabel>
              <Select
                onValueChange={(value) => {
                  const current = field.value ?? [];
                  if (current.includes(value)) {
                    field.onChange(current.filter((v: string) => v !== value));
                  } else {
                    field.onChange([...current, value]);
                  }
                }}
                value={field.value?.at(-1) ?? ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add team members">
                    {field.value && field.value.length > 0
                      ? `${field.value.length} member${
                          field.value.length > 1 ? "s" : ""
                        } selected`
                      : "Add team members"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {members.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        {field.value?.includes(opt.value) && (
                          <span className="size-1.5 rounded-full bg-primary" />
                        )}
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {field.value.map((memberId: string) => {
                    const member = members.find((m) => m.value === memberId);
                    return (
                      <span
                        key={memberId}
                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      >
                        {member?.label ?? memberId}
                        <button
                          type="button"
                          className="ml-0.5 text-primary/60 hover:text-primary"
                          onClick={() =>
                            field.onChange(
                              (field.value ?? []).filter((v: string) => v !== memberId),
                            )
                          }
                          aria-label={`Remove ${member?.label ?? memberId}`}
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Clear
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add members"}
        </Button>
      </div>
    </form>
  );
}