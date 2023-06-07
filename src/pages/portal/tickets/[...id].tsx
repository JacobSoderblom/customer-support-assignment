import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import { api } from "~/utils/api";
import { getSession, useSession } from "next-auth/react";
import { type NextPageWithLayout } from "../../_app";
import { PortalLayout } from "~/components/PortalLayout";
import Image from "next/image";
import { Card, CardHeaderAction } from "~/components/Card";
import { getStatus } from "~/utils/ticket";
import { Ticket } from "@prisma/client";
import Link from "next/link";
import { ResolveTicketModal } from "~/components/modals/ResolveTicket";
import { isAuthenticated } from "~/utils/auth";

const Ticket: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const { data } = useSession();
  const item = api.ticket.get.useQuery(id);

  const agent = api.agents.get.useQuery(item.data?.agentId || "", {
    enabled: !!item.data?.agentId,
  });

  const allowed =
    item.data?.agentId === data?.user.id || data?.user.role === "admin";

  return (
    <>
      <Head>
        <title>Customer Support Portal - {item.data?.id}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="w-full pb-8 md:px-8">
        {!item.error ? (
          <Card
            header={
              <CardHeaderAction
                title={
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Ticket information
                  </h3>
                }
                action={
                  !item.data?.resolved && allowed ? (
                    <ResolveTicketModal id={id} />
                  ) : null
                }
              />
            }
            className="md:max-w-3xl"
          >
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Product
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {item.data?.productNo}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Customer name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {item.data?.customerName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Customer mail address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {item.data?.customerEmail}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Description
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {item.data?.description}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Status
                </dt>
                <dd className="first-letter:upperticket mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {getStatus(item.data || ({} as Ticket))}
                </dd>
              </div>
              <div className="x-4 py-6 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Assigned to
                </dt>
                <dd className="first-letter:upperticket mt-3 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {agent.data ? (
                    <Link
                      href={`/portal/agents/${agent.data.id}`}
                      className="flex items-center gap-x-4 pr-6"
                    >
                      <Image
                        className="h-8 w-8 rounded-full bg-gray-50"
                        width={32}
                        height={32}
                        src={agent.data.image}
                        alt={agent.data.name}
                      />
                      <span>{agent.data.name}</span>

                      <ChevronRightIcon
                        className="ml-auto h-5 w-5 flex-none text-gray-400"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    "Not assigned yet"
                  )}
                </dd>
              </div>
            </dl>
          </Card>
        ) : null}
        {agent.error ? (
          <Card className="md:max-w-3xl">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Could not find ticket
            </h3>
          </Card>
        ) : null}
      </main>
    </>
  );
};

Ticket.getLayout = function getLayout(page) {
  return <PortalLayout>{page}</PortalLayout>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession({ req: ctx.req });

  if (!(await isAuthenticated(ctx))) {
    return {
      redirect: {
        destination: "/portal",
        permananet: false,
      },
    };
  }

  return {
    props: { session, id: (ctx.query.id as string[])[0] as string },
  };
}

export default Ticket;
