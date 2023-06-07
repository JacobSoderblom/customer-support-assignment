import { createTRPCRouter } from "~/server/api/trpc";
import { agentsRouter } from "./routers/agents";
import { ticketRouter } from "./routers/ticket";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  ticket: ticketRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
