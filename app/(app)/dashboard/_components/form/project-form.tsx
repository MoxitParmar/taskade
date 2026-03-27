"use client";
import { Controller } from "react-hook-form";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initialData, useProjectForm } from "./use-project-form";
import { Id } from "@/convex/_generated/dataModel";

export type options = {
  label: string;
  value: string;
};

export function ProjectForm({
  type,
  initialData,
  userId,
  orgId,
  members,
}: {
  type: "create" | "update";
  initialData?: initialData;
  userId: Id<"users">;
  orgId: Id<"organizations">;
  members: options[];
}) {
  const { form, onSubmit, isSubmitting, isSuccess } = useProjectForm({
    type,
    initialData,
    userId,
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
            Thank you
          </h2>
          <p className="text-center text-lg text-pretty text-muted-foreground">
            Form submitted successfully.
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
          Project Details
        </h2>

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="gap-1 col-span-full"
            >
              <FieldLabel htmlFor="name">Project name *</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="name"
                type="text"
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your project name"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="gap-1 col-span-full"
            >
              <FieldLabel htmlFor="description">Description </FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                id="description"
                placeholder="Enter your project description."
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => {
            const options = [
              { value: "planning", label: "Planning" },
              { value: "active", label: "Active" },
              { value: "on-hold", label: "On Hold" },
              { value: "completed", label: "Completed" },
            ];
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-1 md:col-span-3"
              >
                <FieldLabel htmlFor="status">Status *</FieldLabel>

                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="task status" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        <Controller
          name="lead"
          control={form.control}
          render={({ field, fieldState }) => {
            const options = members;
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-1 md:col-span-3"
              >
                <FieldLabel htmlFor="lead">Project Lead *</FieldLabel>

                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="lead" className="w-full">
                    <SelectValue placeholder="Select Project Lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

      </FieldGroup>
      <div className="flex justify-end items-center w-full">
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
