import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    // console.log(data);
    // Validasi dan proses attachments jika ada
    if (data.resumes) {
      if (!Array.isArray(data.resumes)) {
        return new NextResponse("Invalid resumes format", { status: 400 });
      }

      // Validasi setiap file dalam attachments
      data.resumes.forEach((file: any) => {
        if (!file.name || !file.url) {
          throw new Error("Each attachment must include 'name' and 'url'.");
        }
      });
    }

    let profile = await db.userProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    let userProfile;

    if (profile) {
      userProfile = await db.userProfile.update({
        where: {
          userId: userId,
        },
        data: {
          ...data,
        },
      });
    } else {
      userProfile = await db.userProfile.create({
        data: {
          ...data,
          userId: userId,
        },
      });
    }

    return NextResponse.json(userProfile);
  } catch (error: any) {
    console.error(`JOB PATCH ERROR: ${error.message || error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
