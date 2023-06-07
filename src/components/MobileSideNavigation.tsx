import { Dialog } from "@headlessui/react";
import { SideNavigation } from "./SideNavigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Bars3Icon } from "@heroicons/react/24/outline";

export const MobileSideNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { events } = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    events.on("routeChangeComplete", handleRouteChange);

    return () => {
      events.off("routeChangeComplete", handleRouteChange);
    };
  }, [events]);

  return (
    <div className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-start p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Dialog.Backdrop
          className="fixed inset-0 bg-black/75"
          onClick={() => setMobileMenuOpen(false)}
        />
        <Dialog.Panel className="fixed inset-y-0 z-10 flex overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <SideNavigation />
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};
