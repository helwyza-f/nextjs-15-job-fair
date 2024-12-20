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
      (option) => option.value === experience
    );
    return selectedOption ? selectedOption.label : "N/A";
  };
  return (
    <motion.div layout>
      <Card>
        <div className="h-full w-full p-4 flex flex-col items-start justify-start gap-y-4">
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
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <div onClick={onClickSaveJob}>
                  <SavedUserIcon
                    className={cn(
                      "h-4 w-4",
                      isSavedByUser
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              )}
            </Button>
          </Box>
          {/* company details */}
          <Box className="items-center justify-start gap-x-4">
            <div className="w-12 h-12 min-w-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden">
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
              <p className="text-stone-700 font-semibold text-base w-full truncate">
                {job.title}
              </p>
              <Link
                href={`/company/${company?.id}`}
                className="text-sm text-purple-500 font-medium w-full truncate"
              >
                {company?.name}
              </Link>
            </div>
          </Box>
          {/* Job detail */}
          <Box>
            {job.shiftTiming && (
              <div className="text-xs text-muted-foreground flex items-center">
                <BriefcaseBusiness className="w-3 h-3 mr-1" />
                {formattedString(job.shiftTiming)}
              </div>
            )}
            {job.workMode && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Layers className="w-3 h-3 mr-1" />
                {formattedString(job.workMode)}
              </div>
            )}
            {job.hourlyRate && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Currency className="w-3 h-3 mr-1" />
                {`${formattedString(job.hourlyRate)} $/hr`}
              </div>
            )}
            {job.yearsOfExperience && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Network className="w-3 h-3 mr-1" />
                {getExperienceLabel(job.yearsOfExperience)}
              </div>
            )}
          </Box>
          {job.short_description && (
            <CardDescription className="text-xs tracking-wide leading-relaxed">
              {truncate(job.short_description, {
                length: 150,
                omission: "...",
              })}
            </CardDescription>
          )}
          {job.tags.length > 0 && (
            <Box className="flex-wrap justify-start gap-2 ">
              {job.tags.slice(0, 6).map((tag, index) => (
                <p
                  key={index}
                  className="bg-gray-100 text-xs rounded-md px-2 py-[2px] font-semibold text-neutral-700"
                >
                  {tag}
                </p>
              ))}
            </Box>
          )}
          <Box className="gap-2 mt-auto ">
            <Link href={`/search/${job.id}`} className="w-full">
              <Button
                className="w-full border-purple-500 text-purple-500 hover:bg-transparent hover:text-purple-600 "
                variant={"outline"}
              >
                Details
              </Button>
            </Link>
            <Button
              className=" w-full hover:bg-purple-800 bg-purple-800/90 text-white hover:text-white "
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
