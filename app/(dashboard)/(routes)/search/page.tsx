import { getJobs } from "@/actions/get-jobs";
import SearchContainer from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import CategoryList from "./_components/categories-list";
import CategoriesList from "./_components/categories-list";
import PageContent from "./_components/page-content";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
    updatedAtFilter: string;
    shiftTiming: string;
    workMode: string;
    yearsOfExperience: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams; // Pastikan properti ini telah di-resolve

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc", // Perbaikan: menggunakan `orderBy` untuk pengurutan
    },
  });
  const { userId } = await auth();
  const jobs = await getJobs({ ...resolvedSearchParams });
  // console.log(resolvedSearchParams);
  // console.log(jobs.length);
  return (
    <>
      <div className="px-6 pt-6 mt-20 block md:hidden md:mb-0 ">
        <SearchContainer />
      </div>

      <div className="p-5">
        {/* categories */}
        <CategoriesList categories={categories} />

        {/* page content */}
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
}
