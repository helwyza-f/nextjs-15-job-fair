import { sendEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, fullName } = await req.json();
  const response = await sendEmail({
    to: email,
    name: fullName,
    subject: "Thank you for applying to our job",
  });

  if (response?.messageId) {
    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  }
  return NextResponse.json({ message: "Email not sent" }, { status: 500 });
};
