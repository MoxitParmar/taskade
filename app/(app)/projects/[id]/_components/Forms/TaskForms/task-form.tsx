"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSeparator,
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
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { formSchema } from "./task-form-schema";
import { initialData,useTaskForm } from "./use-task-form";
import { options } from "@/app/(app)/dashboard/_components/form/ProjectForm/project-form";
import { Id } from "@/convex/_generated/dataModel";

type Schema = z.infer<typeof formSchema>;

export function TaskForm({
  type,
  initialData,
  userId,
  orgId,
  projectId,
  members,
}: {
  type: "create" | "update";
  initialData?: initialData;
  userId: Id<"users">;
  orgId: Id<"organizations">;
  projectId: Id<"projects">;
  members: options[];
}) {
  const { form, onSubmit, isSubmitting, isSuccess } = useTaskForm({
    type,
    initialData,
    userId,
    orgId,
    projectId,
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
        <h1 className="mt-6 mb-1 font-extrabold text-3xl tracking-tight col-span-full">
          Task Details
        </h1>

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="gap-1 col-span-full"
            >
              <FieldLabel htmlFor="taskName">Title *</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="taskName"
                type="text"
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Task title"
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
              <FieldLabel htmlFor="taskDescription">Description </FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                id="taskDescription"
                placeholder="Describe the task."
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="priority"
          control={form.control}
          render={({ field, fieldState }) => {
            const options = [
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ];
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-1 md:col-span-3"
              >
                <FieldLabel htmlFor="taskPriority">Priority *</FieldLabel>

                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Priority" />
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
          name="assignee"
          control={form.control}
          render={({ field, fieldState }) => {
            const options = members;
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-1 md:col-span-3"
              >
                <FieldLabel htmlFor="taskAssignee">Assignee *</FieldLabel>

                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Assignee" />
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
          name="status"
          control={form.control}
          render={({ field, fieldState }) => {
            const options = [
              { value: "todo", label: "To Do" },
              { value: "in-progress", label: "In Progress" },
              { value: "done", label: "Done" },
            ];
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-1 md:col-span-3"
              >
                <FieldLabel htmlFor="taskStatus">Status *</FieldLabel>

                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
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
          name="dueDate"
          control={form.control}
          render={({ field, fieldState }) => {
            const selectedDate = field.value ?? "";
            return (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-3"
              >
                <FieldLabel htmlFor="dueDate">Due Date *</FieldLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-start font-normal active:scale-none",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="size-4" />
                        {selectedDate ? (
                          <span>{format(selectedDate, "dd MMM, yyyy")}</span>
                        ) : (
                          <span>Select DueDate</span>
                        )}
                      </Button>
                      {fieldState.isDirty && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1/2 inset-e-0 -translate-y-1/2 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            form.resetField("dueDate");
                          }}
                        >
                          <X />
                        </Button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(newDate) => {
                        if (!newDate) {
                          form.resetField(field.name);
                          return;
                        }
                        form.setValue(field.name, newDate, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </PopoverContent>
                </Popover>
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
