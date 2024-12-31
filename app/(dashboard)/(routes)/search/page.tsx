import React, { Suspense } from "react";
import { getJobs } from "@/actions/get-jobs";
import SearchContainer from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import CategoriesList from "./_components/categories-list";
import PageContent from "./_components/page-content";
import AppliedFilters from "./_components/applied-filters";
import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
    updatedAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const resolvedSearchParams = await searchParams;
  const jobs = await getJobs({ ...resolvedSearchParams });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mt-20 block px-6 pt-6 md:mb-0 md:hidden">
        <SearchContainer />
      </div>

      <div className="p-5">
        <CategoriesList categories={categories} />
        <AppliedFilters categories={categories} />

        <PageContent jobs={jobs} userId={userId} />
      </div>
    </Suspense>
  );
}
