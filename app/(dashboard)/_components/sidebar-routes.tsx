"use client";
import Box from "@/components/box";
import SidebarRouteItems from "./sidebar-route-items";
import { BookMarked, Compass, Home, List, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";
import { Separator } from "@/components/ui/separator";
import DateFilter from "./date-filter";
import CheckBoxContainer from "./checkbox-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    href: "/saved-jobs",
  },
];

const shiftTimingsData = [
  {
    value: "full-time",
    label: "Full Time",
  },
  {
    value: "part-time",
    label: "Part Time",
  },
  {
    value: "contract",
    label: "Contract",
  },
];

const workingModesData = [
  {
    value: "remote",
    label: "Remote",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
  {
    value: "onsite",
    label: "On-Site",
  },
];

const experienceData = [
  {
    value: "0",
    label: "Fresher",
  },
  {
    value: "2",
    label: "0-2 years",
  },
  {
    value: "3",
    label: "2-4 years",
  },
  {
    value: "5",
    label: "5+ years",
  },
];

interface SidebarRoutesProps {
  onLinkClick: () => void;
}

export default function SidebarRoutes({ onLinkClick }: SidebarRoutesProps) {
  const pathName = usePathname();
  const router = useRouter();

  const isAdminPage = pathName.startsWith("/admin");
  const isSearchPage = pathName.startsWith("/search");

  const handleShiftTiming = (shiftTiming: string[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      shiftTiming: shiftTiming,
    };
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: updatedQueryParams,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );
    router.push(url, { scroll: false });
    // onLinkClick();
  };

  const handleWorkMode = (workMode: string[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      workMode: workMode,
    };
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: updatedQueryParams,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );
    router.push(url, { scroll: false });
    // onLinkClick();
  };

  const handleExperience = (experience: string[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      yearsOfExperience: experience,
    };
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: updatedQueryParams,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );
    router.push(url, { scroll: false });
    // onLinkClick();
  };

  const routes = isAdminPage ? adminRoutes : guestRoutes;
  return (
    <div className="flex w-full flex-col">
      {routes.map((route) => (
        <SidebarRouteItems
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          onLinkClick={onLinkClick}
        />
      ))}

      {isSearchPage && (
        <Box className="flex-col items-start justify-start px-4 py-2">
          <Separator />
          <div className="flex flex-col gap-2 border-none py-4">
            <h2 className="text-md tracking-wide text-muted-foreground">
              Filters
            </h2>
            {/* filter the data by UpdatedAtField */}
            <DateFilter onLinkClick={onLinkClick} />
          </div>

          <Separator />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md tracking-wide text-muted-foreground hover:no-underline">
                Working Schedule
              </AccordionTrigger>
              <AccordionContent>
                <CheckBoxContainer
                  data={shiftTimingsData}
                  onChange={handleShiftTiming}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md tracking-wide text-muted-foreground hover:no-underline">
                Working Mode
              </AccordionTrigger>
              <AccordionContent className="w-full">
                <CheckBoxContainer
                  data={workingModesData}
                  onChange={handleWorkMode}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md tracking-wide text-muted-foreground hover:no-underline">
                Experience
              </AccordionTrigger>
              <AccordionContent className="w-full">
                <CheckBoxContainer
                  data={experienceData}
                  onChange={handleExperience}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Box>
      )}
    </div>
  );
}
