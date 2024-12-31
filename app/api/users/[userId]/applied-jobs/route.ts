import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();
    const data = await req.text();

    if (!data) {
      return new NextResponse("No data provided", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.userProfile.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    const updatedProfile = await db.userProfile.update({
      where: {
        userId: userId,
      },
      data: {
        appliedJobs: {
          push: {
            jobId: data,
          },
        },
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error(`JOB PATCH ERROR: ${error.message || error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
