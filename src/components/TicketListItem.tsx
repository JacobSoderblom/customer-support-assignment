import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { type Ticket } from "@prisma/client";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { type FC } from "react";
import { getStatus, getStatusClass } from "~/utils/ticket";

export const TicketListItem: FC<{
  item: Ticket & { agent?: { name: string } };
  onMouseOver: () => void;
}> = ({ item, onMouseOver }) => {
  const status = getStatus(item);

  return (
    <li
      key={item.id}
      className="relative flex items-center space-x-4 px-4 py-4"
      onMouseOver={onMouseOver}
    >
      <div className="min-w-0 flex-auto">
        <div className="flex items-center gap-x-3">
          <div
            className={cx(getStatusClass(status), "flex-none rounded-full p-1")}
          >
            <div className="h-2 w-2 rounded-full bg-current" />
          </div>
          <h2 className="min-w-0 text-sm font-semibold leading-6">
            <Link href={`/portal/tickets/${item.id}`} className="flex gap-x-2">
              <span className="truncate">
                Ticket for product - {item.productNo}
              </span>
              <span className="sr-only">{status}</span>
              <span className="absolute inset-0" />
            </Link>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
          {item.agent && status !== "inactive" ? (
            <>
              <p className="truncate">Assigned to {item.agent.name}</p>
              <svg
                viewBox="0 0 2 2"
                className="h-0.5 w-0.5 flex-none fill-gray-300"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
            </>
          ) : null}
          <p className="truncate">
            Updated at - {item.updatedAt.toDateString()}
          </p>
        </div>
      </div>
      <ChevronRightIcon
        className="h-5 w-5 flex-none text-gray-400"
        aria-hidden="true"
      />
    </li>
  );
};
