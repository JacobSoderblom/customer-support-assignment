import { cva, cx, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const styles = cva(
  "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      intent: {
        primary:
          "bg-indigo-600  text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-indigo-600",
        secondary:
          "text-gray-900 shadow-sm border border-gray-300 hover:bg-gray-50",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof styles>
>(function Button({ intent, ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className={cx(styles({ intent }), props.className)}
    />
  );
});
