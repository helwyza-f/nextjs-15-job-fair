import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CustomBreadCrumb from "@/components/costum-bread-crumb";
import Image from "next/image";
import CompanyDetailsContent from "./_components/company-details-content";

export default async function CompanyDetails({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const { userId } = await auth();
  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company || !userId) {
    return redirect("/");
  }

  const job = await db.job.findMany({
    where: {
      companyId: companyId,
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col">
      <Box className="mb-4 mt-4 items-center justify-start gap-2 px-2">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={
            company.name !== undefined ? company.name : "Company Details"
          }
        />
      </Box>

      {/* company cover image */}
      {company.coverImageUrl ? (
        <div className="relative -z-10 flex h-80 w-full items-center justify-center overflow-hidden">
          <Image
            src={company.coverImageUrl}
            alt={company.name}
            fill
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="relative -z-10 flex h-80 w-full items-center justify-center overflow-hidden">
          <div className="flex h-80 w-full items-center justify-center bg-purple-200">
            <p className="text-3xl font-semibold tracking-wider text-gray-500">
              {company.name}
            </p>
          </div>
        </div>
      )}

      {/* company details */}
      <CompanyDetailsContent jobs={job} company={company} userId={userId} />
    </div>
  );
}
