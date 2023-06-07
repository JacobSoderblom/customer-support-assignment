import { cx } from "class-variance-authority";
import { HomeIcon, UsersIcon, DocumentIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { api } from "~/utils/api";

export const pages = [
  {
    name: "Dashboard",
    href: "/portal",
    icon: HomeIcon,
    active: false,
  },
  {
    name: "Agents",
    href: "/portal/agents",
    icon: UsersIcon,
    active: false,
  },
  {
    name: "Tickets",
    href: "/portal/tickets",
    icon: DocumentIcon,
    active: false,
  },
];

export const SideNavigation = () => {
  const { asPath } = useRouter();
  const { data } = useSession();

  const tickets = api.ticket.list.useQuery(undefined, {
    refetchOnMount: false,
  });
  const agents = api.agents.list.useQuery(undefined, { refetchOnMount: false });
  const [navigation, setNavigation] = useState(
    pages
      .filter((item) => {
        if (data?.user.role === "admin") {
          return true;
        }

        if (item.href === "/portal") {
          return true;
        }

        return false;
      })
      .map((item) => ({
        ...item,
        active: item.href === asPath,
        count:
          item.href === "/portal/agents"
            ? agents.data?.length
            : item.href === "/portal/tickets"
            ? tickets.data?.length
            : undefined,
      }))
  );

  useEffect(() => {
    setNavigation(
      navigation.map((item) => ({
        ...item,
        active: item.href === asPath,
        count:
          item.href === "/portal/agents"
            ? agents.data?.length
            : item.href === "/portal/tickets"
            ? tickets.data?.length
            : undefined,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, tickets.data, agents.data]);

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-gray-200 bg-white md:border-r md:px-6">
      <div className="flex h-16 shrink-0 items-center">
        <Image
          className="h-8 w-auto"
          height={32}
          width={32}
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Customer Support Portal"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1 md:-mx-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cx(
                      item.active
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                    )}
                  >
                    <item.icon
                      className={cx(
                        item.active
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-indigo-600",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                    {item.count !== undefined ? (
                      <span
                        className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                        aria-hidden="true"
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto border-t border-gray-200 md:-mx-6">
            <p className="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900 md:px-6">
              <Image
                className="h-8 w-8 rounded-full bg-gray-50"
                width={32}
                height={32}
                src={data?.user?.image || ""}
                alt={data?.user?.name || ""}
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">{data?.user?.name}</span>
            </p>
            <div className="md:px-6">
              <Button
                intent="secondary"
                className="my-4"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => signOut({ redirect: true })}
              >
                Sign out
              </Button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};
