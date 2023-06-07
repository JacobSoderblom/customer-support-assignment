import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { getSession, useSession } from "next-auth/react";
import { type NextPageWithLayout } from "../_app";
import { PortalLayout } from "~/components/PortalLayout";
import { isAuthenticated } from "~/utils/auth";
import { Stats } from "~/components/Stats";
import { Card, CardHeaderAction } from "~/components/Card";
import { TicketListItem } from "~/components/TicketListItem";
import { api } from "~/utils/api";
import { useMemo } from "react";
import { cx } from "class-variance-authority";

const Portal: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({}) => {
  const { data } = useSession();
  const utils = api.useContext();
  const tickets = api.ticket.list.useQuery(
    { agentId: data?.user.id || "" },
    { enabled: !!data?.user.id }
  );

  const items = useMemo(() => tickets.data || [], [tickets.data]);
  return (
    <>
      <Head>
        <title>Customer Support Portal</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="w-full py-8 md:px-8">
        {data?.user.role === "admin" ? <Stats /> : null}
        {data?.user.role === "agent" ? (
          <Card
            header={
              <CardHeaderAction
                title={
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    My tickets
                  </h3>
                }
              />
            }
            className="md:max-w-3xl"
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
                        <span className="truncate">No tickets to display</span>
                      </h2>
                    </div>
                  </div>
                </li>
              ) : null}
            </ul>
          </Card>
        ) : null}
      </main>
    </>
  );
};

Portal.getLayout = function getLayout(page) {
  return <PortalLayout>{page}</PortalLayout>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession({ req: ctx.req });

  if (!(await isAuthenticated(ctx))) {
    return {
      redirect: {
        destination: "/signin",
        permananet: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Portal;
