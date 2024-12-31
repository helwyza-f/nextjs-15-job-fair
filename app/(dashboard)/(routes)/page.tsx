import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getJobs } from "@/actions/get-jobs";
import { db } from "@/lib/db";
import Box from "@/components/box";
import HomeSearchContainer from "../_components/home-search-container";
import Image from "next/image";
import HomeCategories from "../_components/home-categories";
import HomeCompanies from "../_components/home-companies";
import RecommendedJobs from "../_components/recommended-jobs";
import { Footer } from "../_components/footer";

export default async function page() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const userProfile = await db.userProfile.findUnique({
    where: { userId: userId },
  });

  if (!userProfile) {
    return redirect("/user");
  }

  if (userProfile.role === null || userProfile.role === "") {
    return redirect("/select-role");
  }

  const jobs = await getJobs({});

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const companies = await db.company.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col space-y-12 px-4 py-6">
      <Box className="mt-12 flex w-full flex-col justify-center space-y-4 pt-10 md:pt-4">
        <h2 className="font-sans text-2xl font-bold tracking-wide text-neutral-600 md:text-4xl">
          Find Your Dream Job Now!
        </h2>
        <p className="text-2xl text-muted-foreground">
          {jobs.length}+ jobs available
        </p>
      </Box>
      <HomeSearchContainer />
      <Box className="relative mt-12 flex h-64 items-center justify-center overflow-hidden rounded-lg">
        <Image
          src={"/img/job-portal-banner.jpg"}
          alt="job portal banner"
          fill
          className="h-full w-full object-cover"
        />
      </Box>
      <HomeCategories categories={categories} />
      <HomeCompanies companies={companies} />
      <RecommendedJobs jobs={jobs.splice(0, 6)} userId={userId} />
      <Footer />
    </div>
  );
}
