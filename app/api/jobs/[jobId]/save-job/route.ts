import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { jobId } = await params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!jobId) {
      return new NextResponse("Job ID is required", { status: 400 });
    }
    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
    });
    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    const updatedData = {
      savedUsers: job.savedUsers ? { push: userId } : [userId],
    };

    //   update job
    const updatedJob = await db.job.update({
      where: {
        id: jobId,
      },
      data: updatedData,
    });
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.log(`JOB PATCH ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
