import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns/format";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { columns, CompaniesColumns } from "./_components/columns";

export default async function CompaniesPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const companies = await db.company.findMany({
    where: {
      userId: userId ?? "",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const data: CompaniesColumns[] = companies.map((company) => ({
    id: company.id,
    name: company.name,
    logoUrl: company.logoUrl,
    createdAt: format(company.createdAt, "dd MMM yyyy"),
  }));

  return (
    <div className="p-8 pt-28 md:pt-10 ">
      <div className="flex items-end justify-end">
        <Link href={"/admin/companies/create"}>
          <Button variant={"default"}>
            <Plus className="h-5 w-5 " />
            New Company
          </Button>
        </Link>
      </div>

      {/* Table Job */}
      <div className="mt-8">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
