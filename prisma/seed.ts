import { hashPassword } from "~/utils/password";
import { prisma } from "../src/server/db";
import gravatar from "gravatar";

async function main() {
  await prisma.user.upsert({
    where: {email: "admin@customersupport.com",},
    update: {},
    create: {
      name: "Customer support Admin",
      email: "admin@customersupport.com",
      image: gravatar.url("admin@customersupport.com", undefined, true),
      role: "admin",
      password: await hashPassword("admin")
    },
  });

  await prisma.user.upsert({
    where: {email: "agent1@customersupport.com",},
    update: {},
    create: {
      name: "Agent 1",
      email: "agent1@customersupport.com",
      image: gravatar.url("agent1@customersupport.com", undefined, true),
      role: "agent",
      password: await hashPassword("agent1")
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
