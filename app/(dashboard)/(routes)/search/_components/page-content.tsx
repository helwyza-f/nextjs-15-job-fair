"use client";

import { Job } from "@prisma/client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import JobCardItem from "./job-card-item";
import { FadeInOut } from "@/animations";

interface PageContentProps {
  jobs: Job[];
  userId: string | null;
}

export default function PageContent({ jobs, userId }: PageContentProps) {
  if (jobs.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex h-[60vh] w-full items-center justify-center">
            <Image
              src="/img/not-found.jpg"
              alt="no job found"
              width={400}
              height={400}
              className="h-full w-full object-contain"
            />
          </div>
          <h2 className="text-4xl font-semibold text-muted-foreground">
            No Job Found
          </h2>
        </div>
      </>
    );
  }
  return (
    <div className="pt-6">
      <AnimatePresence>
        <motion.div
          {...FadeInOut}
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
          {jobs.map((job) => {
            return <JobCardItem key={job.id} job={job} userId={userId} />;
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
