import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) => {
  try {
    const { userId } = await auth();
    const data = await req.json();
    const { jobId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!jobId) {
      return new NextResponse("Job ID is required", { status: 401 });
    }

    // TODO: Update job to database
    const job = await db.job.update({
      where: {
        id: jobId,
        userId: userId,
      },
      data: data,
    });
    return NextResponse.json(job);
  } catch (error) {
    console.log(`JOB PATCH ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
