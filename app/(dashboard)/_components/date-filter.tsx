"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

export default function DateFilter() {
  const data = [
    { value: "all", label: "All time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "thisMonth", label: "This Month" },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const [selectedValue, setSelectedValue] = useState<string | null>(null); // Track selected value

  const onChange = (value: string) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    setSelectedValue(value); // Update selected value
    const updatedQueryParams = {
      ...currentQueryParams,
      updatedAtFilter: value,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url, { scroll: false });
  };

  return (
    <Select onValueChange={(selected) => onChange(selected)}>
      <SelectTrigger
        className={cn(
          "w-44 ",
          selectedValue
            ? "bg-blue-50 border-purple-500 text-purple-600" // Style for selected
            : "bg-gray-50 border-gray-300 text-gray-500" // Style for placeholder
        )}
      >
        <SelectValue
          placeholder="Filter by Date"
          className="placeholder-gray-500"
        />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
