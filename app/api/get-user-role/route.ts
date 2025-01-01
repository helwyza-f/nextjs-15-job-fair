import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!user) {
    return new NextResponse("User not found", { status: 200 });
  }
  return NextResponse.json(user.role);
}
