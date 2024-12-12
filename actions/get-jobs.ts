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
  try {
    const query: any = {
      where: {
        AND: [
          {
            isPublished: true,
          },
        ],
      },
      include: {
        company: true,
        category: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    };

    // Filter: Title
    if (title) {
      query.where.AND.push({
        title: {
          contains: title,
          mode: "insensitive",
        },
      });
    }

    // Filter: Category
    if (categoryId) {
      query.where.AND.push({
        categoryId: {
          equals: categoryId,
        },
      });
    }

    // Filter: UpdatedAt
    if (updatedAtFilter) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Normalize to midnight
      let startDate: Date;
      let endDate: Date;

      switch (updatedAtFilter) {
        case "today":
          startDate = new Date(currentDate);
          endDate = new Date(currentDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - 1);
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "thisWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay()); // Start of this week (Sunday)
          endDate = new Date(currentDate);
          endDate.setDate(startDate.getDate() + 6); // End of this week (Saturday)
          endDate.setHours(23, 59, 59, 999);
          break;
        case "lastWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay() - 7); // Start of last week (Sunday)
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6); // End of last week (Saturday)
          endDate.setHours(23, 59, 59, 999);
          break;
        case "thisMonth":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          ); // Last day of current month
          endDate.setHours(23, 59, 59, 999);
          break;
        default:
          startDate = new Date(0);
          endDate = new Date();
          break;
      }

      // Add range filter to query
      query.where.AND.push({
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      });
    }

    // Add other filters as needed (e.g., shiftTiming, workMode, etc.)

    // Execute query
    const jobs = await db.job.findMany(query);
    return jobs;
  } catch (error) {
    console.error("Get_Jobs Error:", error);
    return [];
  }
};
