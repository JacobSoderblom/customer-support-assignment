import { TRPCError } from "@trpc/server";
import gravatar from "gravatar";
import { z } from "zod";
import { createAgentSchema } from "~/schemas/agent";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { isAdmin } from "~/utils/auth";
import { hashPassword } from "~/utils/password";

export const agentsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const agents = await ctx.prisma.user.findMany({
      where: {
        role: "agent",
      },
    });

    return agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      image: agent.image,
    }));
  }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const agent = await ctx.prisma.user.findFirst({
      where: {
        id: input,
      },
    });

    if (!agent) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return {
      id: agent.id,
      name: agent.name,
      email: agent.email,
      image: agent.image,
    };
  }),

  create: protectedProcedure
    .input(createAgentSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(await isAdmin(ctx.session))) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      const agent = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (agent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "email address is already taken",
        });
      }

      const newAgent = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: await hashPassword(input.password),
          role: "agent",
          image: gravatar.url(input.email, undefined, true),
        },
      });

      const freeTicket = await ctx.prisma.ticket.findFirst({
        select: {
          id: true,
        },
        where: {
          agentId: null,
          resolved: false,
        },
      });

      if (freeTicket) {
        await ctx.prisma.ticket.update({
          where: {
            id: freeTicket.id,
          },
          data: {
            agent: {
              connect: {
                id: newAgent.id,
              },
            },
          },
        });
      }

      return {
        id: newAgent.id,
        name: newAgent.name,
        email: newAgent.email,
        image: newAgent.image,
      };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!(await isAdmin(ctx.session))) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }
      
      const agent = await ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });

      if (!agent) {
        return;
      }

      const freeAgent = await ctx.prisma.user.findFirst({
        select: { id: true, name: true },
        where: {
          role: "agent",
          tickets: {
            none: {},
          },
        },
      });

      await ctx.prisma.ticket.updateMany({
        where: {
          agent: {
            id: input,
          },
        },
        data: {
          agentId: freeAgent?.id,
        },
      });

      await ctx.prisma.user.delete({ where: { id: input } });

      return;
    }),
});
