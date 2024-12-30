import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { activeResume } = await req.json();

    if (!activeResume) {
      return new NextResponse("Active resume is required", { status: 400 });
    }

    // Update user profile dengan activeResume
    const userProfile = await db.userProfile.update({
      where: {
        userId: userId,
      },
      data: {
        activeResume: activeResume,
      },
    });

    return NextResponse.json(userProfile);
  } catch (error: any) {
    console.error(`ACTIVE RESUME PATCH ERROR: ${error.message || error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
