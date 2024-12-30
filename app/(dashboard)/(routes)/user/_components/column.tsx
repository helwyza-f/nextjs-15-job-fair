"use client";
import Sort from "./sort";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Eye, MoreHorizontal } from "lucide-react";

import Link from "next/link";

export type AppliedJobsColumns = {
  id: string;
  title: string;
  company: string;
  category: string;
  AppliedAt: string;
};

export const columns: ColumnDef<AppliedJobsColumns>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div className="flex items-center gap-x-2">
        <h2 className="text-md font-bold tracking-wider">Title</h2>
        <Sort
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </div>
    ),
    cell: ({ row }) => {
      const { title } = row.original;
      return <div className="text-md font-bold tracking-wider">{title}</div>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2">
          <h2 className="text-md font-bold tracking-wider text-neutral-700">
            Category
          </h2>
          <Sort
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2">
          <h2 className="text-md font-bold tracking-wider text-neutral-700">
            Company
          </h2>
          <Sort
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "AppliedAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2">
          <h2 className="text-md font-bold tracking-wider text-neutral-700">
            Applied At
          </h2>
          <Sort
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <Link href={`/search/${id}`} scroll={false}>
          <Button variant={"ghost"} size={"icon"}>
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
];
