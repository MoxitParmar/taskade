import { useEffect } from "react";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

type Options<
  TInput extends FieldValues,
  TOutput extends FieldValues = TInput,
> = {
  schema: z.ZodType<TOutput, TInput>;
  defaultValues?: DefaultValues<TInput>;
  values?: Partial<TInput>;
  onSubmit: (values: TOutput) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
};

export function useSmartForm<
  TInput extends FieldValues,
  TOutput extends FieldValues = TInput,
>({
  schema,
  defaultValues,
  values,
  onSubmit,
  successMessage,
  errorMessage,
}: Options<TInput, TOutput>) {
  const form = useForm<TInput, unknown, TOutput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (values) {
      form.reset(values as DefaultValues<TInput>);
    }
  }, [values, form]);

  const handleSubmit = form.handleSubmit(async (submittedValues) => {
    try {
      await onSubmit(submittedValues);

      if (successMessage) toast.success(successMessage);

      form.reset(submittedValues as DefaultValues<TInput>);
    } catch (err) {
      if (errorMessage) toast.error(errorMessage);
      console.error(err);
    }
  });

  return {
    form,
    onSubmit: handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    isSuccess: form.formState.isSubmitSuccessful,
  };
}

