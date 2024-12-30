import Box from "@/components/box";
import CostumBreadCrumb from "@/components/costum-bread-crumb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import NameForm from "./_components/name-form";
import { db } from "@/lib/db";
import EmailForm from "./_components/email-form";
import ContactForm from "./_components/contact-form";
import ResumeForm from "./_components/resume-form";
import { DataTable } from "@/components/ui/data-table";
import { AppliedJobsColumns, columns } from "./_components/column";
import { format } from "date-fns";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import React from "react";
import { truncate } from "lodash";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

async function UserProfile() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/");
  }

  let profile = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const jobs = await db.job.findMany({
    where: {
      id: {
        in: profile?.appliedJobs.map((appliedJob) => appliedJob.jobId),
      },
    },
    include: {
      category: true,
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredAppliedJobs =
    profile && profile.appliedJobs.length > 0
      ? jobs.map((job) => ({
          ...job,
          AppliedAt: profile.appliedJobs.find(
            (appliedJob) => appliedJob.jobId === job.id,
          )?.AppliedAt,
        }))
      : [];

  const formattedAppliedJobs: AppliedJobsColumns[] = filteredAppliedJobs.map(
    (job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.name || "",
      category: job.category?.name || "",
      AppliedAt: job.AppliedAt
        ? format(new Date(job.AppliedAt), "dd MMMM yyyy")
        : "",
    }),
  );

  const followedCompanies = await db.company.findMany({
    where: {
      followers: {
        has: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <Box>
        <CostumBreadCrumb breadCrumbPage="My Profile" />
      </Box>
      <Box className="mt-8 flex w-full flex-col space-y-6 rounded-lg border p-4 shadow-md md:p-8">
        {user && user.hasImage && (
          <div className="relative aspect-square h-24 w-24 rounded-full shadow-md">
            <Image
              fill
              sizes="100%"
              src={user.imageUrl}
              alt="User Profile Picture"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        )}
        <NameForm initialData={profile} userId={userId} />
        <EmailForm initialData={profile} userId={userId} />
        <ContactForm initialData={profile} userId={userId} />
        <ResumeForm initialData={profile} userId={userId} bucket="job-fair" />
      </Box>

      {/* applied jobs */}
      <Box className="mt-12 flex flex-col items-start justify-start">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Applied Jobs
        </h2>
        <div className="mt-6 w-full">
          <DataTable columns={columns} data={formattedAppliedJobs} />
        </div>
      </Box>

      {/* followed companies */}
      <Box className="mt-12 flex flex-col items-start justify-start">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Followed Companies
        </h2>
        <div className="mt-6 grid w-full grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {followedCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground">
                You are not following any company yet.
              </p>
            </div>
          ) : (
            <React.Fragment>
              {followedCompanies.map((company) => (
                <Card key={company.id} className="relative space-y-3 p-3">
                  <div className="flex w-full items-center justify-end">
                    <Link href={`/companies/${company.id}`}>
                      <Button variant="ghost">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  {company.logoUrl && (
                    <div className="relative flex h-20 w-full items-center justify-center overflow-hidden">
                      <Image
                        src={company.logoUrl}
                        alt={company.name}
                        fill
                        sizes="100%"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  {company.description && (
                    <CardDescription className="text-sm">
                      {truncate(company.description, {
                        length: 80,
                        omission: "...",
                      })}
                    </CardDescription>
                  )}
                </Card>
              ))}
            </React.Fragment>
          )}
        </div>
      </Box>
    </div>
  );
}

export default UserProfile;
