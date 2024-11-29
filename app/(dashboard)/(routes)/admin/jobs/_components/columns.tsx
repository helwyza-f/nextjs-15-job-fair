"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
    header: "Title",
  },
  {
    accessorKey: "isPublished",
    header: () => (
      <div className="text-center font-medium text-base">Status</div>
    ),
    cell: ({ row }) => {
      const { isPublished } = row.original;

      return (
        <div
          className={cn(
            "border px-2 py-1 text-md text-black flex justify-center mx-auto rounded-md w-1/2",
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
    header: "Category",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
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
            <Link href={`/admin/jobs/${job.id}`}>
              <DropdownMenuItem>
                <span>Edit</span>
                <EditIcon className="mr-2 h-4 w-4" />
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
