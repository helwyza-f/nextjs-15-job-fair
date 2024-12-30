import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CustomBreadcrumb from "@/components/costum-bread-crumb";
import SearchContainer from "@/components/search-container";
import PageContent from "../search/_components/page-content";

interface SavedJobsPageProps {
  searchParams: {
    title: string;
    categoryId: string;
    updatedAtFilter: string;
    shiftTiming: string;
    workMode: string;
    yearsOfExperience: string;
  };
}
export default async function SavedJobsPage({
  searchParams,
}: SavedJobsPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const jobs = await getJobs({
    ...searchParams,
    savedJobs: true,
  });
  return (
    <div className="flex flex-col gap-4">
      <Box className="mt-4 items-center justify-start px-2">
        <CustomBreadcrumb breadCrumbPage="Saved Jobs" />
      </Box>
      <Box className="h-44 w-full justify-center bg-purple-600/20">
        <h2 className="text-center text-2xl font-bold">SAVED JOBS</h2>
      </Box>
      <div className="px-6 pt-6 md:mb-0">
        <SearchContainer />
      </div>
      <div className="p-4">
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </div>
  );
}
