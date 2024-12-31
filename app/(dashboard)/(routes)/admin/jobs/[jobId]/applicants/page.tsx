import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";
import Box from "@/components/box";
import CustomBreadCrumb from "@/components/costum-bread-crumb";
import { DataTable } from "@/components/ui/data-table";

export default async function page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { userId } = await auth();
  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    redirect("/admin/jobs");
  }
  if (!userId) {
    redirect("/");
  }

  const profiles = await db.userProfile.findMany({});
  if (!profiles) {
    redirect("/admin/jobs");
  }

  const filteredProfiles =
    profiles &&
    profiles.filter((profile) =>
      profile.appliedJobs.some((appliedJob) => appliedJob.jobId === jobId),
    );
  // console.log(filteredProfiles);

  const formattedProfile: ApplicantsColumns[] = filteredProfiles.map(
    (profile) => {
      const activeResume =
        Array.isArray(profile.resumes) &&
        (profile.resumes.find(
          (resume) =>
            typeof resume === "object" &&
            resume !== null &&
            "url" in resume &&
            "name" in resume &&
            resume.url === profile.activeResume,
        ) as { name: string; url: string } | undefined);

      return {
        id: profile.userId,
        jobId: jobId,
        selectedUsers: job.selectedUsers,
        rejectedUsers: job.rejectedUsers,
        fullName: profile.fullName || "",
        email: profile.email || "",
        contact: profile.contact || "",
        AppliedAt: profile.appliedJobs.find(
          (appliedJob) => appliedJob.jobId === jobId,
        )?.AppliedAt
          ? format(
              new Date(
                profile.appliedJobs.find((job) => job.jobId === jobId)
                  ?.AppliedAt ?? "",
              ),
              "MMM dd, yyyy",
            )
          : "",
        resumeUrl: activeResume ? activeResume.url : "",
        resumeName: activeResume ? activeResume.name : "",
      };
    },
  );

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Box>
        <CustomBreadCrumb
          breadCrumbPage="Applicants"
          breadCrumbItem={[
            { link: "/admin/jobs", label: "Jobs" },
            { link: `/admin/jobs`, label: `${job ? job.title : ""}` },
          ]}
        />
      </Box>
      <div className="mt-6 w-full">
        <DataTable data={formattedProfile} columns={columns} />
      </div>
    </div>
  );
}
