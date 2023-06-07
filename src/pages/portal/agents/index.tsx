import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { api } from "~/utils/api";
import { getSession } from "next-auth/react";
import { type NextPageWithLayout } from "../../_app";
import { PortalLayout } from "~/components/PortalLayout";
import { cx } from "class-variance-authority";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeaderAction } from "~/components/Card";
import { CreateAgentModal } from "~/components/modals/CreateAgent";
import { isAdmin } from "~/utils/auth";

const Agents: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({}) => {
  const agents = api.agents.list.useQuery();
  const utils = api.useContext();

  return (
    <>
      <Head>
        <title>Customer Support Portal - Agents</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="w-full pb-8 md:px-8">
        <Card
          header={
            <CardHeaderAction
              title={
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Agents
                </h3>
              }
              action={<CreateAgentModal />}
            />
          }
          className="md:max-w-3xl"
        >
          <ul role="list" className="divide-y divide-gray-200">
            {agents.data?.map((agent) => (
              <li
                key={agent.id}
                className="relative flex items-center space-x-4 px-4 py-4"
                onMouseOver={() => {
                  void utils.agents.get.prefetch(agent.id);
                }}
              >
                <div className="min-w-0 flex-auto">
                  <div className="flex items-center gap-x-3">
                    <div className={cx("flex-none rounded-full p-1")}>
                      <Image
                        src={agent.image}
                        height={32}
                        width={32}
                        alt={agent.name}
                      />
                    </div>
                    <h2 className="min-w-0 text-sm font-semibold leading-6">
                      <Link
                        href={`agents/${agent.id}`}
                        className="flex gap-x-2"
                      >
                        <span className="truncate">{agent.name}</span>
                        <span className="absolute inset-0" />
                      </Link>
                    </h2>
                  </div>
                  <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                    <p className="truncate">{agent.email}</p>
                  </div>
                </div>
                <ChevronRightIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex-1 overflow-hidden bg-white shadow"></div>
      </main>
    </>
  );
};

Agents.getLayout = function getLayout(page) {
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
    props: { session },
  };
}

export default Agents;
