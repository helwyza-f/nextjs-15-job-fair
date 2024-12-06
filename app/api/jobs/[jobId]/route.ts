import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { jobId } = await params;

    if (!jobId) {
      return new NextResponse("Job ID is required", { status: 400 });
    }

    const data = await req.json();

    // Validasi dan proses attachments jika ada
    if (data.attachments) {
      if (!Array.isArray(data.attachments)) {
        return new NextResponse("Invalid attachments format", { status: 400 });
      }

      // Validasi setiap file dalam attachments
      data.attachments.forEach((file: any) => {
        if (!file.name || !file.url) {
          throw new Error("Each attachment must include 'name' and 'url'.");
        }
      });
    }

    // Update job dengan data termasuk attachments
    const job = await db.job.update({
      where: {
        id: jobId,
        userId,
      },
      data: {
        ...data,
      },
    });

    return NextResponse.json(job);
  } catch (error: any) {
    console.error(`JOB PATCH ERROR: ${error.message || error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
