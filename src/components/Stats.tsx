import { cx } from "class-variance-authority";
import { useMemo } from "react";
import { api } from "~/utils/api";
import { type Statuses, getStatus, getStatusClass } from "~/utils/ticket";

export const Stats = () => {
  const tickets = api.ticket.list.useQuery();

  const items = useMemo(() => {
    if (!tickets.data) {
      return undefined;
    }

    const inactive = tickets.data.filter(
      (item) => getStatus(item) === "inactive"
    );
    const active = tickets.data.filter((item) => getStatus(item) === "active");
    const resolved = tickets.data.filter(
      (item) => getStatus(item) === "resolved"
    );

    return {
      inactive: inactive.length,
      active: active.length,
      resolved: resolved.length,
    };
  }, [tickets.data]);

  if (!items) {
    return null;
  }

  return (
    <div className="md:max-w-3xl">
      <h2 className="sr-only">Ticket stats</h2>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {Object.entries(items).map(([key, count]) => (
          <div
            key={key}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div>
              <dt className="flex items-center truncate text-sm font-medium text-gray-500">
                <div
                  className={cx(
                    getStatusClass(key as Statuses),
                    "mr-2 h-4 w-4 flex-none rounded-full p-1"
                  )}
                >
                  <div className="h-2 w-2 rounded-full bg-current" />
                </div>
                <span className="first-letter:uppercase">{key}</span>
              </dt>
              <dd className="ml-6 mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {count}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
};
