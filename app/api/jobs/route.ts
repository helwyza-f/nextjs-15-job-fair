import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    // TODO: Save job to database
    const job = await db.job.create({
      data: {
        // id: uuidv4(),
        userId,
        title,
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    console.log(`JOB POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
