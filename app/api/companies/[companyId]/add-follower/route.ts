import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ companyId: string }> },
) => {
  try {
    const { userId } = await auth();

    const { companyId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!companyId) {
      return new NextResponse("company ID is required", { status: 401 });
    }

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const updatedCompany = await db.company.update({
      where: {
        id: companyId,
      },
      data: {
        followers: company.followers ? { push: userId } : [userId],
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.log(`company PATCH ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
