
import { type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { getSession } from "next-auth/react";
import { prisma } from "~/server/db";

export const isAuthenticated = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession({ req: ctx.req });

  return !!session;
};

export const isAdmin = async (session: Session | null) => {
    if (!session){
        return false
    }

    const user = await prisma.user.findFirst({where: {id: session?.user.id}})
  
    return user && user.role === "admin";
  };
