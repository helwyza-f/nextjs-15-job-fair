import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
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
    // console.log(data);
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

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }
    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });
    // console.log(job);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    if (job.imageUrl) {
      const filePath = job.imageUrl.split(
        "/storage/v1/object/public/job-fair/"
      )[1];
      await supabase.storage.from("job-fair").remove([filePath]);
    }
    if (Array.isArray(job.attachments) && job.attachments.length > 0) {
      const fileUrls = job.attachments.map(
        (attachment: any) =>
          attachment.url.split("/storage/v1/object/public/job-fair/")[1]
      );
      await supabase.storage.from("job-fair").remove(fileUrls);
    }

    // Simulasi penghapusan dari database
    await db.job.delete({
      where: {
        id: jobId,
        userId,
      },
    });

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`JOB DELETE ERROR: ${error.message || error}`);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
