import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { use } from "react";

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

    const userIndex = company.followers.indexOf(userId);

    if (userIndex !== -1) {
      const updatedCompany = await db.company.update({
        where: {
          id: companyId,
          userId: userId,
        },
        data: {
          followers: {
            set: company.followers.filter((id) => id !== userId),
          },
        },
      });
      return NextResponse.json(updatedCompany);
    }
    return NextResponse.json({ message: "User not found" });
  } catch (error) {
    console.log(`company PATCH ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
