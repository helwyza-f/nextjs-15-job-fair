"use client";

import SearchContainer from "@/components/search-container";
import { Button } from "@/components/ui/button";

import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NavbarRoutes() {
  const pathname = usePathname();
  const [role, setRole] = useState("");
  const isAdminPage = pathname.startsWith("/admin");
  const isUserPage = pathname.startsWith("/job");
  const isSearchPage = pathname.startsWith("/search");

  useEffect(() => {
    const fetchUserRole = async () => {
      const response = await axios.get("/api/get-user-role");
      console.log(response.data);
      if (response.data !== "" || response.data !== null) {
        setRole(response.data);
      }
    };
    fetchUserRole();
  }, []);

  return (
    <>
      {isSearchPage && (
        <div className="hidden w-full items-center gap-x-6 px-2 pr-8 md:flex">
          <Suspense fallback={<div>Loading...</div>}>
            <SearchContainer />
          </Suspense>
        </div>
      )}
      <div className="ml-auto flex gap-x-4">
        {role === "recruiter" ? (
          <>
            {isAdminPage || isUserPage ? (
              <Link href="/" scroll={false}>
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
          </>
        ) : (
          <Button
            onClick={() => toast.success("Hello job seeker")}
            className="border-purple-500 px-8 text-sm text-purple-700 hover:bg-purple-900 hover:text-white hover:shadow-sm"
            variant={"outline"}
          >
            Job Seeker
          </Button>
        )}

        <UserButton />
      </div>
    </>
  );
}
