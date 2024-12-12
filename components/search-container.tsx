"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";

export default function SearchContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const currentTitle = searchParams.get("title");

  const [value, setValue] = useState(currentTitle || "");
  const debounceValue = useDebounce(value);

  useEffect(() => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: {
          ...currentQueryParams,
          title: debounceValue,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url, { scroll: false });
  }, [debounceValue, router, pathName]);

  return (
    <>
      <div className="flex items-center gap-2 relative flex-1">
        <Search className="h-4 w-4 text-neutral-600 absolute left-3" />
        <Input
          placeholder="Search for the jobs using title"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-9 rounded-lg bg-purple-50/80 focus-visible:ring-purple-200 text-sm"
        />
        {value && (
          <Button
            onClick={() => setValue("")}
            variant={"ghost"}
            size={"icon"}
            type="button"
            className="cursor-pointer absolute right-3 hover:scale-125 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
}
