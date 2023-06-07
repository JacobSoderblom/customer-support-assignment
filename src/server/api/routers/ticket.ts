import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTicketSchema } from "~/schemas/ticket";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const availableAgents = Prisma.sql`SELECT User.id FROM User LEFT JOIN Ticket ON Ticket.agentId = User.id AND Ticket.resolved = false WHERE Ticket.agentId IS NULL AND User.role = "agent"`;

export const ticketRouter = createTRPCRouter({
  create: publicProcedure
    .input(createTicketSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.ticket.create({
        data: {
          customerName: input.name,
          customerEmail: input.email,
          description: input.description,
          productNo: input.productNo,
        },
      });

      await ctx.prisma.$executeRaw(
        Prisma.sql`UPDATE Ticket SET agentId = (${availableAgents}) WHERE id IN (SELECT id FROM Ticket WHERE resolved = false AND agentId IS NULL LIMIT 1)`
      );

      return;
    }),

  list: protectedProcedure
    .input(z.object({ agentId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      if (input) {
        return await ctx.prisma.ticket.findMany({
          where: {
            agentId: input.agentId,
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      }

      return await ctx.prisma.ticket.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const item = await ctx.prisma.ticket.findFirst({
      where: {
        id: input,
      },
    });

    if (!item) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return item;
  }),

  resolve: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.ticket.findFirst({ where: { id: input } });

      if (!item) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ticket does not exist",
        });
      }

      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      });

      if (!user || (user.role !== "admin" && item.agentId !== user.id)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "user not allowed to resolve this ticket",
        });
      }

      const updatedTicket = await ctx.prisma.ticket.update({
        where: {
          id: input,
        },
        data: { resolved: true },
      });

      await ctx.prisma.$executeRaw(
        Prisma.sql`UPDATE Ticket SET agentId = (${availableAgents}) WHERE id IN (SELECT id FROM Ticket WHERE resolved = false AND agentId IS NULL LIMIT 1)`
      );

      return updatedTicket;
    }),
});
