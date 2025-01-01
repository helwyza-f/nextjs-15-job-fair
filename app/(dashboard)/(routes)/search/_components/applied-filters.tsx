"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategoriesListProps {
  categories: Category[];
}

const data = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "thisWeek", label: "This Week" },
  { value: "lastWeek", label: "Last Week" },
  { value: "thisMonth", label: "This Month" },
];

const experienceData = [
  {
    value: "0",
    label: "Fresher",
  },
  {
    value: "2",
    label: "0-2 years",
  },
  {
    value: "3",
    label: "2-4 years",
  },
  {
    value: "5",
    label: "5+ years",
  },
];

export default function AppliedFilters({ categories }: CategoriesListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mengonversi searchParams ke array
  const paramsArray = [...searchParams.entries()];
  // console.log("paramsArray", paramsArray);

  const title = paramsArray
    .filter((param) => param[0] === "title")
    .map((param) => param[1]);

  const categoryId = paramsArray
    .filter((param) => param[0] === "categoryId")
    .map((param) => param[1]);
  const categoryName = categories.find(
    (category) => category.id === categoryId.toString(),
  )?.name;

  // filter untuk date
  const dateFilter = paramsArray
    .filter((param) => param[0] === "updatedAtFilter")
    .map((param) => param[1]);

  // Filter hanya untuk key "workMode"
  const workModeValues = paramsArray
    .filter((param) => param[0] === "workMode")
    .map((param) => param[1]);

  // Filter hanya untuk key "shiftTiming"
  const shiftTimingValues = paramsArray
    .filter((param) => param[0] === "shiftTiming") // Ambil array dengan key "shiftTiming"
    .map((param) => param[1]); // Ekstrak hanya value-nya

  // Filter hanya untuk key "yearsOfExperience"
  const yearsOfExperienceValues = paramsArray
    .filter((param) => param[0] === "yearsOfExperience") // Ambil array dengan key "yearsOfExperience"
    .map((param) => param[1]); // Ekstrak hanya value-nya
  //   console.log("yearsOfExperienceValues", yearsOfExperienceValues); // Output: Array
  return (
    <>
      <div className="mt-4 flex items-center justify-center gap-4">
        {title && title.length > 0 && (
          <p>
            Your search results for :{" "}
            <span className="font-semibold">{title}</span>
          </p>
        )}
      </div>
      <div className="mt-4 flex items-center gap-4">
        {/* CATEGORY FILTER */}
        {categoryName && (
          <Button
            variant={"outline"}
            type="button"
            className="flex cursor-pointer items-center gap-x-2 rounded-md border-purple-200 bg-purple-200/50 px-3 py-1 capitalize text-neutral-500 hover:bg-purple-200/90"
          >
            {categoryName}
          </Button>
        )}
        {/* DATE FILTER */}
        {dateFilter &&
          dateFilter.map((value, index) => (
            <Button
              variant={"outline"}
              type="button"
              key={index}
              className="flex cursor-pointer items-center gap-x-2 rounded-md border-purple-200 bg-purple-200/50 px-3 py-1 capitalize text-neutral-500 hover:bg-purple-200/90"
            >
              {data.find((item) => item.value === value)?.label}
            </Button>
          ))}

        {/* SHIFT FILTER */}
        {shiftTimingValues &&
          shiftTimingValues.map((value, index) => (
            <Button
              variant={"outline"}
              type="button"
              key={index}
              className="flex cursor-pointer items-center gap-x-2 rounded-md border-purple-200 bg-purple-200/50 px-3 py-1 capitalize text-neutral-500 hover:bg-purple-200/90"
            >
              {value}
            </Button>
          ))}

        {/* WORK MODE FILTER */}
        {workModeValues &&
          workModeValues.map((value, index) => (
            <Button
              variant={"outline"}
              type="button"
              key={index}
              className="flex cursor-pointer items-center gap-x-2 rounded-md border-purple-200 bg-purple-200/50 px-3 py-1 capitalize text-neutral-500 hover:bg-purple-200/90"
            >
              {value}
            </Button>
          ))}

        {/* YEARS OF EXPERIENCE */}
        {yearsOfExperienceValues &&
          yearsOfExperienceValues.map((value, index) => (
            <Button
              variant={"outline"}
              type="button"
              key={index}
              className="flex cursor-pointer items-center gap-x-2 rounded-md border-purple-200 bg-purple-200/50 px-3 py-1 capitalize text-neutral-500 hover:bg-purple-200/90"
            >
              {experienceData.find((item) => item.value === value)?.label}
            </Button>
          ))}
      </div>
    </>
  );
}
