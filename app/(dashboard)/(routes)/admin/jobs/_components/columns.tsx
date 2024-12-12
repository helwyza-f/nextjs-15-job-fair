"use client";
import Sort from "./sort";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type JobsColumns = {
  id: string;
  title: string;
  isPublished: boolean;
  category: string;
  company: string;
  createdAt: string;
};

export const columns: ColumnDef<JobsColumns>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2 ">
          <h2 className="font-bold tracking-wider text-md text-neutral-700">
            Title
          </h2>
          <Sort
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2 ">
          <h2 className="font-bold tracking-wider text-md text-neutral-700">
            Status
          </h2>
          <Sort
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const { isPublished } = row.original;

      return (
        <div
          className={cn(
            "border px-2 py-1 text-md text-black flex justify-center rounded-md w-1/2",
            isPublished
              ? "border-emerald-500 bg-emerald-100/80"
              : "bg-red-100/80"
          )}
        >
          {isPublished ? "Published" : "Draft"}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2 ">
          <h2 className="font-bold tracking-wider text-md text-neutral-700">
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
        <div className="flex items-center gap-x-2 ">
          <h2 className="font-bold tracking-wider text-md text-neutral-700">
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2 ">
          <h2 className="font-bold tracking-wider text-md text-neutral-700">
            Date
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
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/jobs/${job.id}`} scroll={false}>
              <DropdownMenuItem>
                <span>Edit</span>
                <EditIcon className="mr-2 h-4 w-4" />
              </DropdownMenuItem>
            </Link>
            <Link href={`/admin/jobs/${job.id}/applicants`}>
              <DropdownMenuItem>
                <span>Applicants</span>
                <Eye className="mr-2 h-4 w-4" />
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
