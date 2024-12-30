"use client";

import Banner from "@/components/banner";
import Box from "@/components/box";
import CostumBreadCrumb from "@/components/costum-bread-crumb";
import Preview from "@/components/preview";
import { ApplyModal } from "@/components/ui/apply-modal";
import { Button } from "@/components/ui/button";
import { Job, UserProfile, Company } from "@prisma/client";
import axios from "axios";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
interface JobDetailsPageContentProps {
  job: Job & { company: Company | null }; // Pastikan tipe ini sesuai
  profile: UserProfile | null;
  jobId: string;
}
interface Attachment {
  name: string;
  url: string;
}
export default function JobDetailsPageContent({
  job,
  profile,
  jobId,
}: JobDetailsPageContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onApply = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `/api/users/${profile?.userId}/applied-jobs`,
        jobId,
      );

      // send email to user
      await axios.post("/api/thank-you", {
        email: profile?.email,
        fullName: profile?.fullName,
      });

      toast.success("Thank you for applying to this job");
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setIsOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };
  return (
    <>
      <ApplyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onApply}
        loading={isLoading}
        userProfile={profile}
      />
      {profile &&
        profile.appliedJobs.some(
          (appliedJob) => appliedJob.jobId === jobId,
        ) && (
          <Banner
            label="Thank you for applying to this job. Your application has been submitted successfully. We will contact you soon."
            variant="success"
          />
        )}
      <Box className="mt-4">
        <CostumBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={job.title !== undefined ? job.title : "Job Details"}
        />
      </Box>
      {/* job cover image */}
      <Box className="mt-4">
        <div className="relative flex h-72 w-full items-center overflow-hidden rounded-lg">
          {job.imageUrl ? (
            <Image
              src={job.imageUrl}
              alt={job.title}
              fill
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-purple-100">
              <p className="text-3xl font-semibold tracking-wider text-gray-500">
                {job.title}
              </p>
            </div>
          )}
        </div>
      </Box>

      {/* title and action button */}
      <Box className="mt-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-700">{job.title}</h1>
          <Link href={`/company/${job.company?.id}`}>
            <div className="mt-2 flex items-center gap-2">
              {job.company?.logoUrl && (
                <Image
                  src={job.company?.logoUrl}
                  alt={job.company?.name}
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              <p className="text-sm font-semibold text-gray-500">
                {job.company?.name}
              </p>
            </div>
          </Link>
        </div>
        {/* action button */}
        <div>
          {profile ? (
            <>
              {!profile.appliedJobs.some(
                (appliedJob) => appliedJob.jobId === jobId,
              ) ? (
                <Button
                  className="bg-purple-700 px-8 text-sm hover:bg-purple-900 hover:shadow-sm"
                  onClick={() => setIsOpen(true)}
                >
                  Apply
                </Button>
              ) : (
                <Button
                  className="border-purple-500 px-8 text-sm text-purple-700 hover:bg-purple-900 hover:text-white hover:shadow-sm"
                  variant={"outline"}
                >
                  Applied
                </Button>
              )}
            </>
          ) : (
            <Link href={"/user"}>
              <Button className="bg-purple-700 px-8 text-sm hover:bg-purple-900 hover:shadow-sm">
                Update Profile
              </Button>
            </Link>
          )}
        </div>
      </Box>

      {/* Descriptions */}
      <Box className="my-4 flex flex-col items-start justify-start gap-2 p-4">
        <h2 className="text-lg font-semibold text-gray-700">Description :</h2>
        <p className="font-sans text-base text-gray-500">
          {job.short_description}
        </p>
      </Box>

      {job.description && (
        <Box>
          <Preview value={job.description} />
        </Box>
      )}

      {job.attachments &&
        Array.isArray(job.attachments) &&
        job.attachments.length > 0 && (
          <Box className="my-4 flex flex-col items-start justify-start gap-2 p-4 font-sans">
            <h2 className="text-lg font-semibold text-gray-700">
              Attachments :
            </h2>
            <p>Download the attachment about the job</p>
            {Array.isArray(job.attachments) &&
              job.attachments.length > 0 &&
              job.attachments.map((item, index: number) => {
                const attachment = item as { name: string; url: string }; // Type assertion
                return (
                  <div key={index} className="space-y-3">
                    <Link
                      href={attachment.url}
                      target="_blank"
                      download
                      className="flex items-center gap-2 text-blue-500"
                    >
                      <FileIcon className="h-4 w-4" />
                      {attachment.name}
                    </Link>
                  </div>
                );
              })}
          </Box>
        )}
    </>
  );
}
