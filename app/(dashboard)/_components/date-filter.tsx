"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";

export default function DateFilter() {
  const data = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "thisMonth", label: "This Month" },
  ];
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (value: string) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    // console.log(currentQueryParams);
    const updatedQueryParams = {
      ...currentQueryParams,
      updatedAtFilter: value,
    };
    // console.log(updatedQueryParams);
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
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by Date" />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => {
          return (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
