import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ObjectId } from "bson";
import { IconBadge } from "@/components/icon-badge";
import CompanyName from "./_components/company-name";
import CompanyDescription from "./_components/company-description";
import LogoForm from "./_components/logo-form";
import CompanyOverview from "./_components/company-overview";
import CompanyCoverForm from "./_components/company-cover";
import CompanySocials from "./_components/company-socials";
import WhyJoinUs from "./_components/why-join-us";
import Banner from "@/components/banner";

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

  const requiredFields = [
    company.name,
    company.description,
    company.logoUrl,
    company.coverImageUrl,
    company.address_line_1,
    company.address_line_2,
    company.city,
    company.state,
    company.zip_code,
    company.mail,
    company.website,
    company.linkedin,
    company.whyJoinUs,
    company.overview,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="mt-20 p-6 md:mt-0">
      <Link href={"/admin/companies"} scroll={false}>
        <div className="flex items-center gap-x-2 text-sm text-neutral-500">
          <ArrowLeft className="h-4 w-4" />
          Back
        </div>
      </Link>

      {/* title */}
      <div className="my-4 flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Company Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
      </div>

      {/* isComplete */}
      {isComplete ? (
        <Banner
          label="You have completed all fields. You can now proceed to the next step."
          variant="success"
        />
      ) : (
        <Banner label="Please complete all fields." variant="warning" />
      )}

      {/* container layout form */}
      <div className="my-32 mt-16">
        <div className="flex flex-col gap-6 md:flex-row">
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
        {/* why join us */}
        <div className="mt-6 w-full">
          <WhyJoinUs initialData={company} companyId={companyId} />
        </div>
        {/* company overview */}
        <div className="mt-6 w-full">
          <CompanyOverview initialData={company} companyId={companyId} />
        </div>
      </div>
    </div>
  );
}
