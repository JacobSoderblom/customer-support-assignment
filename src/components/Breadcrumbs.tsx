import { HomeIcon } from "@heroicons/react/20/solid";
import { pages } from "./SideNavigation";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const Breadcrumbs = () => {
  const { asPath } = useRouter();
  const { data } = useSession();

  const pagesToRender = useMemo(() => {
    const routes = asPath
      .split("/")
      .filter((route) => route !== "portal")
      .filter(Boolean);

    const routesToRender = routes
      .map((route) => pages.find((page) => page.href.includes(route)))
      .filter(Boolean) as typeof pages;

    const routesNotInPages = routes.filter(
      (route) => !pages.find((page) => page.href.includes(route))
    );

    const tail = routesNotInPages[routesNotInPages.length - 1];

    if (data?.user.role !== "admin" && tail) {
      return [{ name: tail, href: asPath }];
    }

    if (tail) {
      return [...routesToRender, { name: tail, href: asPath }];
    }

    const arr = routesToRender;

    return arr;
  }, [asPath, data?.user.role]);

  if (!pagesToRender.length) {
    return null;
  }

  return (
    <nav className="mx-2 my-8 flex md:mx-8" aria-label="Breadcrumb">
      <ol
        role="list"
        className="flex space-x-4 rounded-md bg-white px-6 shadow"
      >
        <li className="flex">
          <div className="flex items-center">
            <Link href="/portal" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pagesToRender.map((page) => (
          <li key={page.name} className="flex">
            <div className="flex items-center">
              <svg
                className="h-full w-6 flex-shrink-0 text-gray-200"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <Link
                href={page.href}
                className="ml-4 w-16 truncate text-sm font-medium text-gray-500 hover:text-gray-700 sm:w-24 md:w-auto"
                aria-current={page.href === asPath ? "page" : undefined}
              >
                <span className="truncate">{page.name}</span>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
