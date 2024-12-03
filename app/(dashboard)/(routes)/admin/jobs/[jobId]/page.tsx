import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Building2,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Banner from "@/components/banner";
import JobPublishActions from "./_components/job-publish-actions";
import { IconBadge } from "@/components/icon-badge";
import TitleForm from "./_components/title-form";
import CategoryForm from "./_components/category-form";
import ImageForm from "./_components/image-form";
import ShortDescriptionForm from "./_components/short-description";
import JobShift from "./_components/job-shift";
import HourlyRate from "./_components/hourly-rate";
import WorkMode from "./_components/work-mode";
import JobExperience from "./_components/job-experience";
import JobDescriptionForm from "./_components/job-description";
import JobTagsForm from "./_components/job-tags";
import { ObjectId } from "bson";
import CompanyForm from "./_components/company-form";

export default async function JobsDetailsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  // verify if user is autenticated
  const { userId } = await auth();
  if (!userId) return redirect("/");

  // verify if job is exist
  const { jobId } = await params;

  if (!ObjectId.isValid(jobId)) {
    return redirect("/admin/jobs"); // Atur rute sesuai kebutuhan
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId: userId,
    },
  });

  if (!job) return redirect("/admin/jobs");
  // console.log(job);
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const companies = await db.company.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
    job.short_description,
    job.shiftTiming,
    job.hourlyRate,
    job.workMode,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6 mt-20 md:mt-0">
      <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-x-2 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Job Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>

        {/* actions */}
        <JobPublishActions
          jobId={jobId}
          isPublished={job.isPublished}
          disabled={!isComplete}
        />
      </div>

      {/* warning if job is not published */}
      {!job.isPublished && (
        <Banner
          label="This job is not published yet. It will not be visible in the job list."
          variant="warning"
        />
      )}

      {/* container layout form */}
      <div className="mt-16 my-32">
        <div className="flex flex-col md:flex-row gap-6">
          {/* left side */}
          <div className="flex-1">
            {/* title */}
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl text-neutral-800">Customize your job</h2>
            </div>

            {/* title form */}
            <TitleForm initialData={job} jobId={jobId} />

            {/* category form */}
            <CategoryForm
              initialData={job}
              jobId={jobId}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id.toString(),
              }))}
            />

            {/* image form */}
            <ImageForm initialData={job} jobId={jobId} />

            {/* Short description */}
            <ShortDescriptionForm initialData={job} jobId={jobId} />

            {/* Job Shift */}
            <JobShift initialData={job} jobId={jobId} />

            {/* Hourly Rate */}
            <HourlyRate initialData={job} jobId={jobId} />

            {/* work mode */}
            <WorkMode initialData={job} jobId={jobId} />

            {/* job experience */}
            <JobExperience initialData={job} jobId={jobId} />
          </div>

          {/* right side */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl text-neutral-800">Job Requirements </h2>
              </div>

              {/* Job Tags */}
              <JobTagsForm initialData={job} jobId={jobId} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Building2} />
                <h2 className="text-xl text-neutral-800">Company Details </h2>
              </div>

              {/* company */}
              <CompanyForm
                initialData={job}
                jobId={jobId}
                options={companies.map((company) => ({
                  label: company.name,
                  value: company.id.toString(),
                }))}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl text-neutral-800">
                  Files & Attachment{" "}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* description full side */}
        <div className="w-full mt-6">
          <JobDescriptionForm initialData={job} jobId={jobId} />
        </div>
      </div>
    </div>
  );
}
