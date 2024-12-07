"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarRoutes() {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");
  const isUserPage = pathname.startsWith("/job");
  return (
    <>
      <div className="flex gap-x-4 ml-auto">
        {isAdminPage || isUserPage ? (
          <Link href="/">
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-purple-700/70"
            >
              <LogOut />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/admin/jobs" scroll={false}>
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-purple-700/70"
            >
              Admin Mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
}
