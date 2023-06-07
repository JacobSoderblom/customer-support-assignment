import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { getSession } from "next-auth/react";
import { type NextPageWithLayout } from "../../_app";
import { PortalLayout } from "~/components/PortalLayout";
import Image from "next/image";
import { Card, CardHeaderAction } from "~/components/Card";
import { isAdmin } from "~/utils/auth";
import { DeleteAgentModal } from "~/components/modals/DeleteAgent";
import { useMemo } from "react";
import { TicketListItem } from "~/components/TicketListItem";
import { cx } from "class-variance-authority";

const Agent: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const agent = api.agents.get.useQuery(id);
  const tickets = api.ticket.list.useQuery({ agentId: id });

  const utils = api.useContext();

  const items = useMemo(() => tickets.data || [], [tickets.data]);

  return (
    <>
      <Head>
        <title>Customer Support Portal - {agent.data?.id}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="w-full pb-8 md:px-8">
        {!agent.error ? (
          <>
            <Card
              header={
                <CardHeaderAction
                  title={
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Contact information
                    </h3>
                  }
                  action={<DeleteAgentModal id={id} />}
                />
              }
              className="md:max-w-3xl"
            >
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Profile picture
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {agent.data?.image ? (
                      <Image
                        src={agent.data.image}
                        width={32}
                        height={32}
                        alt={agent.data.name}
                      />
                    ) : null}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Name
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {agent.data?.name}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {agent.data?.email}
                  </dd>
                </div>
              </dl>
            </Card>
            <Card
              header={
                <CardHeaderAction
                  title={
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Assigned tickets
                    </h3>
                  }
                />
              }
              className="mt-8 md:max-w-3xl"
            >
              <ul role="list" className="divide-y divide-gray-200">
                {items.map((item) => (
                  <TicketListItem
                    key={item.id}
                    item={item}
                    onMouseOver={() => {
                      void utils.ticket.get.prefetch(item.id);
                    }}
                  />
                ))}
                {!items.length ? (
                  <li className="relative flex items-center space-x-4 px-4 py-4">
                    <div className="min-w-0 flex-auto">
                      <div className="flex items-center justify-center gap-x-3">
                        <div className={cx("flex-none rounded-full p-1")}></div>
                        <h2 className="min-w-0 text-sm font-semibold leading-6">
                          <span className="truncate">
                            No tickets to display
                          </span>
                        </h2>
                      </div>
                    </div>
                  </li>
                ) : null}
              </ul>
            </Card>
          </>
        ) : null}
        {agent.error ? (
          <Card className="md:max-w-3xl">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Could not find agent
            </h3>
          </Card>
        ) : null}
      </main>
    </>
  );
};

Agent.getLayout = function getLayout(page) {
  return <PortalLayout>{page}</PortalLayout>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession({ req: ctx.req });

  if (!(await isAdmin(session))) {
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

export default Agent;
