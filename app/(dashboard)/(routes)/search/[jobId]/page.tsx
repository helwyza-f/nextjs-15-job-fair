import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import JobDetailsPageContent from "./_components/job-details-page-content";
import { Separator } from "@/components/ui/separator";
import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import PageContent from "../_components/page-content";

export default async function JobDetailsPageSearch({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const { jobId } = await params;

  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      company: true,
    },
  });

  if (!job) {
    return redirect("/search");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const jobs = await getJobs({});
  const filteredJobs = jobs.filter(
    (j) => j.id !== jobId && j.categoryId === job.categoryId,
  );

  return (
    <div className="flex flex-col p-4 md:p-8">
      <JobDetailsPageContent job={job} profile={profile} jobId={jobId} />
      {filteredJobs && filteredJobs.length > 0 && (
        <>
          <Separator className="my-4" />
          <Box className="flex flex-col items-start justify-start">
            <h2 className="text-lg font-semibold text-gray-700">
              Related Jobs
            </h2>
          </Box>
          <PageContent jobs={filteredJobs} userId={userId} />
        </>
      )}
    </div>
  );
}
