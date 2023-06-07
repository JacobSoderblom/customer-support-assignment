import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { cva } from "class-variance-authority";
import { type HTMLProps, forwardRef } from "react";
import { type FieldError } from "react-hook-form";

const styles = cva(
  "block w-full rounded-md border-0 py-1.5 pr-10 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
  {
    variants: {
      state: {
        error:
          "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500",
        default:
          "text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export const Input = forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement> & {
    id: string;
    error?: FieldError;
    label: string;
    description?: string;
  }
>(function Input({ label, id, error, description, ...rest }, ref) {
  let describedBy: string | undefined;

  if (error) {
    describedBy = `${id}-error`;
  } else if (description) {
    describedBy = `${id}-description`;
  }
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          {...rest}
          ref={ref}
          id={id}
          className={styles({ state: error ? "error" : undefined })}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
        />
        {error ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error.message}
        </p>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
          {description}
        </p>
      ) : null}
    </div>
  );
});
