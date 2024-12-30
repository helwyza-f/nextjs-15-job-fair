import { sendRejectedEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  const { email, fullName } = await req.json();
  const response = await sendRejectedEmail({
    to: email,
    name: fullName,
    subject:
      "We are sorry to inform you that you've been rejected to our application",
  });

  if (response?.messageId) {
    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  }
  return NextResponse.json({ message: "Email not sent" }, { status: 500 });
};
