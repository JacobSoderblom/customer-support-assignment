import { type Ticket } from "@prisma/client";

const statuses = {
  inactive: "text-gray-500 bg-gray-100/10",
  resolved: "text-green-400 bg-green-400/10",
  active: "text-orange-400 bg-orange-400/10",
};

export type Statuses = keyof typeof statuses

export const getStatusClass = (status: Statuses) =>
  statuses[status];

export const getStatus = (item: Ticket): Statuses => {
  if (item.agentId && !item.resolved) {
    return "active";
  }

  if (item.agentId && item.resolved) {
    return "resolved";
  }

  return "inactive";
};
