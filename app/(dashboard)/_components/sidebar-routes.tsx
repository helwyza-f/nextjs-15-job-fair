"use client";
import Box from "@/components/box";
import SidebarRouteItems from "./sidebar-route-items";
import { BookMarked, Compass, Home, List, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { Separator } from "@/components/ui/separator";
import DateFilter from "./date-filter";

const adminRoutes = [
  {
    icon: List,
    label: "Jobs",
    href: "/admin/jobs",
  },
  {
    icon: List,
    label: "Companies",
    href: "/admin/companies",
  },
  {
    icon: Compass,
    label: "Analytics",
    href: "/admin/analytics",
  },
];
const guestRoutes = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Compass,
    label: "search",
    href: "/search",
  },
  {
    icon: User,
    label: "Profile",
    href: "/user",
  },
  {
    icon: BookMarked,
    label: "Saved Jobs",
    href: "/savedJobs",
  },
];

export default function SidebarRoutes() {
  const pathName = usePathname();
  //   const router = useRouter();

  const isAdminPage = pathName.startsWith("/admin");
  const isSearchPage = pathName.startsWith("/search");

  const routes = isAdminPage ? adminRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarRouteItems
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}

      {isSearchPage && (
        <Box className="px-4 py-4 items-start justify-start space-y-4 flex-col">
          <Separator />
          <h2 className="text-md text-muted-foreground tracking-wide">
            Filters
          </h2>
          {/* filter the data by UpdatedAtField */}
          <DateFilter />

          <Separator />
          <h2 className="text-md text-muted-foreground tracking-wide">
            Working Schedule
          </h2>
          {/*  */}
        </Box>
      )}
    </div>
  );
}
