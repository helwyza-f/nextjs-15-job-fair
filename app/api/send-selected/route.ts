import { sendSelectedEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  const { email, fullName } = await req.json();
  const response = await sendSelectedEmail({
    to: email,
    name: fullName,
    subject: "You've been selected for the job",
  });

  if (response?.messageId) {
    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  }
  return NextResponse.json({ message: "Email not sent" }, { status: 500 });
};
