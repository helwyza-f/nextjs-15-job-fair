import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  LayoutDashboard,
  ListChecks,
  PanelsTopLeft,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Banner from "@/components/banner";

import { ObjectId } from "bson";
import { IconBadge } from "@/components/icon-badge";
import CompanyName from "./_components/company-name";
import CompanyDescription from "./_components/company-description";
import LogoForm from "./_components/logo-form";
import CompanyOverview from "./_components/company-overview";
import CompanyCoverForm from "./_components/company-cover";
import CompanySocials from "./_components/company-socials";

export default async function JobsDetailsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  // verify if user is autenticated
  const { userId } = await auth();
  if (!userId) return redirect("/");

  // verify if job is exist
  const { companyId } = await params;

  if (!ObjectId.isValid(companyId)) {
    return redirect("/admin/companies"); // Atur rute sesuai kebutuhan
  }

  const company = await db.company.findUnique({
    where: {
      id: companyId,
      userId: userId,
    },
  });

  if (!company) return redirect("/admin/jobs");

  const requiredFields = [company.name];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6 mt-20 md:mt-0">
      <Link href={"/admin/companies"} scroll={false}>
        <div className="flex items-center gap-x-2 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Company Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
      </div>

      {/* container layout form */}
      <div className="mt-16 my-32">
        <div className="flex flex-col md:flex-row gap-6">
          {/* left side */}
          <div className="flex-1">
            {/* title */}
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl text-neutral-800">
                Customize your Company
              </h2>
            </div>

            {/* company name */}
            <CompanyName initialData={company} companyId={companyId} />

            {/* company description */}
            <CompanyDescription initialData={company} companyId={companyId} />

            {/* logo form */}
            <LogoForm initialData={company} companyId={companyId} />
          </div>

          {/* right side */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={PanelsTopLeft} />
              <h2 className="text-xl text-neutral-800">
                Company Socials & Contacts{" "}
              </h2>
            </div>
            {/* company socials */}
            <CompanySocials initialData={company} companyId={companyId} />
            {/* company cover */}
            <CompanyCoverForm initialData={company} companyId={companyId} />
          </div>
        </div>
        {/* company overview */}
        <div className="w-full mt-6">
          <CompanyOverview initialData={company} companyId={companyId} />
        </div>
      </div>
    </div>
  );
}
