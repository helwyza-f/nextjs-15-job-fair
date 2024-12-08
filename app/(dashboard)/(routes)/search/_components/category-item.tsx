"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryItemProps {
  label: string;
  value: string;
}

export default function CategoryItem({ label, value }: CategoryItemProps) {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: {
          title: currentTitle,
          categoryId: isSelected ? "" : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url, { scroll: false });
  };
  return (
    <Button
      type="button"
      onClick={onClick}
      variant={"outline"}
      className={cn(
        "whitespace-nowrap text-sm tracking-wider text-muted-foreground border px-2 py-[2px] rounded-md hover:bg-purple-700 hover:text-white transition-all cursor-pointer hover:shadow-md",
        isSelected && "bg-purple-700 text-white shadow-md"
      )}
    >
      {label}
    </Button>
  );
}
