"use client";

import Box from "@/components/box";
import { Job } from "@prisma/client";
import PageContent from "../(routes)/search/_components/page-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecommendedJobsProps {
  jobs: Job[];
  userId: string;
}

export default function RecommendedJobs({
  jobs,
  userId,
}: RecommendedJobsProps) {
  return (
    <Box className="my-6 mt-12 flex flex-col justify-center gap-y-4">
      <h2 className="font-sans text-2xl font-bold tracking-wider text-neutral-600">
        Recommended Jobs for you
      </h2>
      <div className="mt-4">
        <PageContent jobs={jobs} userId={userId} />
      </div>
      <Link href={"/search"} className="my-8">
        <Button className="h-11 w-40 rounded-xl border border-purple-500 bg-transparent text-purple-500 hover:bg-transparent hover:text-purple-700 hover:shadow-md">
          View All Jobs
        </Button>
      </Link>
    </Box>
  );
}
