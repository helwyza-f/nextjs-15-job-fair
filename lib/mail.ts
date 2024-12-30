import nodemailer from "nodemailer";
import ejs from "ejs";
import { ThankYouTemplate } from "@/lib/design/thank-you";
import { selectionTemplate } from "@/lib/design/selection";
import { rejectionTemplate } from "@/lib/design/rejection";

export const sendEmail = async ({
  to,
  name,
  subject,
}: {
  to: string;
  name: string;
  subject: string;
}) => {
  const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const textResult = await transporter.verify();
    console.log(textResult);
  } catch (error) {
    console.log(error);
  }

  try {
    const sendResult = await transporter.sendMail({
      from: "noreply@job-search.com",
      to: to,
      subject: subject,
      html: compileThankYouTemplate(name),
    });

    return sendResult;
  } catch (error) {
    console.log(error);
  }
};

export const compileThankYouTemplate = (name: string) => {
  const htmlBody = ejs.render(ThankYouTemplate, { name: name });
  return htmlBody;
};

export const sendSelectedEmail = async ({
  to,
  name,
  subject,
}: {
  to: string;
  name: string;
  subject: string;
}) => {
  const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const textResult = await transporter.verify();
    console.log(textResult);
  } catch (error) {
    console.log(error);
  }

  try {
    const sendResult = await transporter.sendMail({
      from: "noreply@job-search.com",
      to: to,
      subject: subject,
      html: compileSelectedEmail(name),
    });

    return sendResult;
  } catch (error) {
    console.log(error);
  }
};

export const compileSelectedEmail = (name: string) => {
  const htmlBody = ejs.render(selectionTemplate, { name: name });
  return htmlBody;
};

export const sendRejectedEmail = async ({
  to,
  name,
  subject,
}: {
  to: string;
  name: string;
  subject: string;
}) => {
  const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const textResult = await transporter.verify();
    console.log(textResult);
  } catch (error) {
    console.log(error);
  }

  try {
    const sendResult = await transporter.sendMail({
      from: "noreply@job-search.com",
      to: to,
      subject: subject,
      html: compileRejectedEmail(name),
    });

    return sendResult;
  } catch (error) {
    console.log(error);
  }
};

export const compileRejectedEmail = (name: string) => {
  const htmlBody = ejs.render(rejectionTemplate, { name: name });
  return htmlBody;
};
