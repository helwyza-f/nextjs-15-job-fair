import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";

export default async function JobsPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const jobs = await db.job.findMany({
    where: {
      userId: userId ?? "",
    },
    include: {
      category: true,
      company: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  const data = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    isPublished: job.isPublished,
    category: job.category?.name ?? "Not Avaliable",
    company: job.company?.name ?? "Not Avaliable",
    createdAt: format(job.createdAt, "dd MMM yyyy"),
  }));

  return (
    <div className="p-8 pt-28 md:pt-10">
      <div className="flex items-end justify-end">
        <Link href={"/admin/create"} scroll={false}>
          <Button variant={"default"}>
            <Plus className="mr-2 h-5 w-5" />
            New Job
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
