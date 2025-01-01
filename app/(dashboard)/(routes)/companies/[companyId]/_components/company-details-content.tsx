"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Company, Job } from "@prisma/client";
import axios from "axios";
import { Loader2, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";
import { toast } from "react-hot-toast";
import TabContentSection from "./tab-content-section";

interface CompanyDetailsContentProps {
  userId: string | null;
  company: Company;
  jobs: Job[];
}

export default function CompanyDetailsContent({
  userId,
  company,
  jobs,
}: CompanyDetailsContentProps) {
  const isFollower = userId && company.followers.includes(userId);
  const isOwner = userId && company.userId === userId;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClickFollower = async () => {
    if (isOwner) {
      toast.error("You are the owner of this company");
      return;
    }
    try {
      setIsLoading(true);
      if (isFollower) {
        await axios.patch(`/api/companies/${company.id}/remove-follower`);
        toast.success("Unfollowed ");
      } else {
        await axios.patch(`/api/companies/${company.id}/add-follower`);
        toast.success("Followed ");
      }
      router.refresh();
    } catch (error) {
      console.log(`company PATCH ERROR: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="z-50 -mt-8 w-full rounded-2xl bg-white p-4">
      <div className="flex w-full flex-col px-4">
        {/* company details */}
        <div className="flex w-full flex-wrap items-center justify-between gap-2 md:-mt-12">
          <div className="flex items-end justify-end space-x-4">
            <div className="relative flex aspect-square h-28 w-auto items-center justify-center overflow-hidden rounded-2xl border bg-white p-3 md:h-32">
              {company.logoUrl ? (
                <Image
                  width={120}
                  height={120}
                  alt={company.name}
                  src={company.logoUrl}
                  className="object-contain"
                />
              ) : (
                <div className="flex aspect-square h-32 w-auto items-center justify-center overflow-hidden rounded-2xl bg-gray-200">
                  <p className="text-3xl font-semibold tracking-wider text-gray-500">
                    {company.name}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-xl font-bold capitalize text-neutral-700">
                  {company.name}
                </h2>
                <p className="text-sm text-muted-foreground">{`(${company.followers.length}) followers`}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Providing Solutions For Better Humanity
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="whitespace-nowrap rounded-lg border px-2 py-1 text-sm text-muted-foreground">
                  Management Information System
                </p>
                <p className="whitespace-nowrap rounded-lg border px-2 py-1 text-sm text-muted-foreground">
                  Technology
                </p>
                <p className="whitespace-nowrap rounded-lg border px-2 py-1 text-sm text-muted-foreground">
                  Artificial Intelligence
                </p>
                <p className="whitespace-nowrap rounded-lg border px-2 py-1 text-sm text-muted-foreground">
                  Data Science
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleClickFollower}
            className={cn(
              "flex w-24 items-center justify-center rounded-full border-2 border-purple-200 hover:shadow-sm",
              !isFollower && "bg-purple-600 hover:bg-purple-700",
            )}
            variant={isFollower ? "outline" : "default"}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <React.Fragment>
                {isFollower ? (
                  "Unfollow"
                ) : (
                  <React.Fragment>
                    <PlusIcon className="h-4 w-4" />
                    Follow
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Button>
        </div>
        {/* tab content section */}
        <TabContentSection userId={userId} company={company} jobs={jobs} />
      </div>
    </div>
  );
}
