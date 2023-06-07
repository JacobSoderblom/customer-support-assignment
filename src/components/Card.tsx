import { cx } from "class-variance-authority";
import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  forwardRef,
} from "react";

export const Card = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ header?: ReactNode; className?: string }>
>(function Card({ header, children, className }, ref) {
  return (
    <div
      ref={ref}
      className={cx(
        "divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow",
        className
      )}
    >
      {header}
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
});

export const CardHeaderAction: FC<{ title: ReactNode; action?: ReactNode }> = ({
  title,
  action,
}) => {
  return (
    <div className="bg-white px-4 py-5 sm:px-6">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">{title}</div>
        {action ? (
          <div className="ml-4 mt-2 flex-shrink-0">{action}</div>
        ) : null}
      </div>
    </div>
  );
};
