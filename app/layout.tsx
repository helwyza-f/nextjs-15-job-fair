import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/provider/toast-provide";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Job Fair",
  description: "Online Job Fair Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content="Online Job Fair Platform" />
          <meta
            name="keywords"
            content="job fair, online job, recruitment, job seekers, employers, helwiza fahry, helwiza, helwyza"
          />
          <meta name="author" content="Helwiza Fahry" />
          <link rel="canonical" href="https://job-fair.helwiza.com" />
          <title>Job Fair - Online Job Fair Platform</title>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
