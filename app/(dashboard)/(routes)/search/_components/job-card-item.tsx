"use client";

import { Company, Job } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { compareAsc, formatDistanceToNow } from "date-fns";
import { enGB, id } from "date-fns/locale";
import Box from "@/components/box";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookmarkCheckIcon,
  BookmarkIcon,
  BriefcaseBusiness,
  Currency,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import { cn, formattedString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface JobCardItemProps {
  job: Job;
  userId: string | null;
}

const experienceData = [
  {
    value: "0",
    label: "Fresher",
  },
  {
    value: "2",
    label: "0-2 years",
  },
  {
    value: "3",
    label: "2-4 years",
  },
  {
    value: "5",
    label: "5+ years",
  },
];

export default function JobCardItem({ job, userId }: JobCardItemProps) {
  const typeJob = job as Job & {
    company: Company | null;
  };
  const company = typeJob.company;

  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const isSavedByUser = userId && job.savedUsers.includes(userId);
  const SavedUserIcon = isSavedByUser ? BookmarkCheckIcon : BookmarkIcon;
  const router = useRouter();
  const onClickSaveJob = async () => {
    try {
      setIsBookmarkLoading(true);
      if (isSavedByUser) {
        await axios.patch(`/api/jobs/${job.id}/remove-job`);
        toast.success("Job removed from bookmark.");
      } else {
        await axios.patch(`/api/jobs/${job.id}/save-job`);
        toast.success("Job saved to bookmark.");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const getExperienceLabel = (experience: string) => {
    const selectedOption = experienceData.find(
      (option) => option.value === experience,
    );
    return selectedOption ? selectedOption.label : "N/A";
  };
  return (
    <motion.div layout>
      <Card>
        <div className="flex h-full w-full flex-col items-start justify-start gap-y-4 p-4">
          {/* card header */}
          <Box>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
                locale: enGB,
              })}
            </p>
            <Button variant={"ghost"} size={"icon"}>
              {isBookmarkLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div onClick={onClickSaveJob}>
                  <SavedUserIcon
                    className={cn(
                      "h-4 w-4",
                      isSavedByUser
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  />
                </div>
              )}
            </Button>
          </Box>
          {/* company details */}
          <Box className="items-center justify-start gap-x-4">
            <div className="relative flex h-12 min-h-12 w-12 min-w-12 items-center justify-center overflow-hidden rounded-md border p-2">
              {company?.logoUrl && (
                <Image
                  alt={company?.name}
                  src={company?.logoUrl}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
            </div>
            <div className="w-full overflow-hidden">
              <p className="w-full truncate text-base font-semibold text-stone-700">
                {job.title}
              </p>
              <Link
                href={`/companies/${company?.id}`}
                className="w-full truncate text-sm font-medium text-purple-500"
              >
                {company?.name}
              </Link>
            </div>
          </Box>
          {/* Job detail */}
          <Box>
            {job.shiftTiming && (
              <div className="flex items-center text-xs text-muted-foreground">
                <BriefcaseBusiness className="mr-1 h-3 w-3" />
                {formattedString(job.shiftTiming)}
              </div>
            )}
            {job.workMode && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Layers className="mr-1 h-3 w-3" />
                {formattedString(job.workMode)}
              </div>
            )}
            {job.hourlyRate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Currency className="mr-1 h-3 w-3" />
                {`${formattedString(job.hourlyRate)} $/hr`}
              </div>
            )}
            {job.yearsOfExperience && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Network className="mr-1 h-3 w-3" />
                {getExperienceLabel(job.yearsOfExperience)}
              </div>
            )}
          </Box>
          {job.short_description && (
            <CardDescription className="text-xs leading-relaxed tracking-wide">
              {truncate(job.short_description, {
                length: 150,
                omission: "...",
              })}
            </CardDescription>
          )}
          {job.tags.length > 0 && (
            <Box className="flex-wrap justify-start gap-2">
              {job.tags.slice(0, 6).map((tag, index) => (
                <p
                  key={index}
                  className="rounded-md bg-gray-100 px-2 py-[2px] text-xs font-semibold text-neutral-700"
                >
                  {tag}
                </p>
              ))}
            </Box>
          )}
          <Box className="mt-auto gap-2">
            <Link href={`/search/${job.id}`} className="w-full">
              <Button
                className="w-full border-purple-500 text-purple-500 hover:bg-transparent hover:text-purple-600"
                variant={"outline"}
              >
                Details
              </Button>
            </Link>
            <Button
              className="w-full bg-purple-800/90 text-white hover:bg-purple-800 hover:text-white"
              variant={"outline"}
              onClick={onClickSaveJob}
            >
              {isSavedByUser ? "Saved" : "Save for later"}
            </Button>
          </Box>
        </div>
      </Card>
    </motion.div>
  );
}
