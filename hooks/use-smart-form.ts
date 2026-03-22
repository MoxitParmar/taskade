// lib/forms/use-form-handler.ts
import { useForm, FieldValues, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";


type Options<TSchema, TValues> = {
  schema: TSchema;
  defaultValues?: DefaultValues<TValues>;
  onSubmit: (values: TValues) => Promise<void>;
  successMessage?: string;
    errorMessage?: string;
};

export function useFormHandler<TValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  successMessage,
    errorMessage,
  //eslint-disable-next-line
}: Options<any,TValues>) {
  const form = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values);

      if (successMessage) toast(successMessage);

      form.reset();
    } catch (err) {
        if (errorMessage) toast(errorMessage);
        console.error("error from catch",err);
    }
  });

  return {
    form,
    onSubmit: handleSubmit,
    isSubmitting: form.formState.isSubmitting,
      isSuccess: form.formState.isSubmitSuccessful
  };
}