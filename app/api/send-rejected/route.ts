import { db } from "@/lib/db";
import { sendRejectedEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, fullName, jobId, id } = await req.json();

  try {
    // Update database untuk menambahkan email ke rejectedUsers
    await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        rejectedUsers: {
          push: id, // Menambahkan email ke array rejectedUsers
        },
      },
    });

    const response = await sendRejectedEmail({
      to: email,
      name: fullName,
      subject: "You've been rejected for the job",
    });
    if (response?.messageId) {
      return NextResponse.json({ message: "Email sent" }, { status: 200 });
    }
    return NextResponse.json({ message: "Email not sent" }, { status: 500 });
  } catch (error) {
    console.error("Error updating rejected user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 },
    );
  }
};
