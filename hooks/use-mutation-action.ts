import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

type Options = {
  successMessage?: string;
    errorMessage?: string;
  // eslint-disable-next-line
    onSuccess?: (data: any) => void;
  // eslint-disable-next-line
  onError?: (error: any) => void;
};

export const useMutationAction = (
    // eslint-disable-next-line
  mutationFn: any,
  options?: Options
) => {
  const mutate = useMutation(mutationFn);

  const [isLoading, setIsLoading] = useState(false);
// eslint-disable-next-line
  const execute = async (args: any) => {
    try {
      setIsLoading(true);

      const result = await mutate(args);

      // success callback
      options?.onSuccess?.(result);

      // toast
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }

        return result;
        // eslint-disable-next-line 
    } catch (error: any) {
      // error callback
      options?.onError?.(error);

      // toast
      if (options?.errorMessage) {
        toast.error(options.errorMessage);
        console.error("error log", error, "error message", options.errorMessage)
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
  };
};