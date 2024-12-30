"use client";

import { Company, Job } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Preview from "@/components/preview";
import JobsTabContent from "./jobs-tab-content";

interface TabContentSectionProps {
  userId: string | null;
  company: Company;
  jobs: Job[];
}

export default function TabContentSection({
  userId,
  company,
  jobs,
}: TabContentSectionProps) {
  return (
    <div className="my-4 mt-12 w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent shadow-none">
          <TabsTrigger
            value="overview"
            className="rounded-none bg-transparent font-sans text-base tracking-wider shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="joinus"
            className="rounded-none bg-transparent font-sans text-base tracking-wider shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
          >
            Why Join Us
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="rounded-none bg-transparent font-sans text-base tracking-wider shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
          >
            Jobs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {company.overview ? <Preview value={company.overview} /> : ""}
        </TabsContent>
        <TabsContent value="joinus">
          {company.whyJoinUs ? <Preview value={company.whyJoinUs} /> : ""}
        </TabsContent>
        <TabsContent value="jobs">
          <JobsTabContent jobs={jobs} userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
