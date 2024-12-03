import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ companyId: string }> }
) => {
  try {
    const { userId } = await auth();
    const data = await req.json();
    const { companyId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!companyId) {
      return new NextResponse("company ID is required", { status: 401 });
    }

    // TODO: Update job to database
    const company = await db.company.update({
      where: {
        id: companyId,
        userId: userId,
      },
      data: data,
    });
    return NextResponse.json(company);
  } catch (error) {
    console.log(`company PATCH ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
