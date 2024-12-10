import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

export type GetJobsParams = {
  title?: string;
  categoryId?: string;
  updatedAtFilter?: string;
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
  savedJobs?: boolean;
};

export const getJobs = async ({
  title,
  categoryId,
  updatedAtFilter,
  shiftTiming,
  workMode,
  yearsOfExperience,
  savedJobs,
}: GetJobsParams): Promise<Job[]> => {
  //   const { userId } = auth();
  try {
    // initial query with common filters
    let query: any = {
      where: {
        isPublished: true,
      },
      include: {
        company: true,
        category: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    };

    //   execute query
    const jobs = await db.job.findMany(query);
    return jobs;
  } catch (error) {
    console.log("Get_Jobs Error:", error);
    return [];
  }
};
