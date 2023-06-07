import { type FC, type PropsWithChildren } from "react";
import { SideNavigation } from "./SideNavigation";
import { MobileSideNavigation } from "./MobileSideNavigation";
import { Breadcrumbs } from "./Breadcrumbs";

export const PortalLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <div className="hidden h-full w-72 md:flex">
        <SideNavigation />
      </div>
      <div className="block md:hidden">
        <MobileSideNavigation />
      </div>
      <div className="w-full">
        <Breadcrumbs />
        {children}
      </div>
    </div>
  );
};
