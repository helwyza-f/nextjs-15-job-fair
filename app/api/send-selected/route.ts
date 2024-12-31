import { sendSelectedEmail } from "@/lib/mail";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, fullName, jobId, id } = await req.json();

  try {
    // Update database untuk menambahkan email ke selectedUsers
    await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        selectedUsers: {
          push: id, // Menambahkan email ke array selectedUsers
        },
      },
    });

    // Kirim email jika perlu
    const response = await sendSelectedEmail({
      to: email,
      name: fullName,
      subject: "You've been selected for the job",
    });

    if (response?.messageId) {
      return NextResponse.json({ message: "Email sent" }, { status: 200 });
    }
    return NextResponse.json({ message: "Email not sent" }, { status: 500 });
  } catch (error) {
    console.error("Error updating selected user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 },
    );
  }
};
