import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { role } = await req.json();
  //   console.log(role);

  try {
    await db.userProfile.update({
      where: {
        userId: userId,
      },
      data: {
        role: role,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ message: "Role selected" });
}
