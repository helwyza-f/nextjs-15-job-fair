import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // TODO: Save company to database
    const company = await db.company.create({
      data: {
        // id: uuidv4(),
        userId,
        name,
      },
    });
    return NextResponse.json(company);
  } catch (error) {
    console.log(`Company POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
