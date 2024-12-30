"use client";
import Sort from "./sort";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import CellAction from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ApplicantsColumns = {
  id: string;
  fullName: string;
  email: string;
  contact: string;
  AppliedAt: string;
  resumeUrl: string;
  resumeName: string;
};

export const columns: ColumnDef<ApplicantsColumns>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2">
          <h2 className="text-md font-bold tracking-wider text-neutral-700">
            Full Name
          </h2>
          <Sort
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2">
          <h2 className="text-md font-bold tracking-wider text-neutral-700">
            Email
          </h2>
          <Sort
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const { email } = row.original;

      return <div>{email}</div>;
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2">
          <h2 className="text-md font-bold tracking-wider text-neutral-700">
            Contact
          </h2>
          <Sort
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "resumeUrl",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2">
          <h2 className="text-md font-bold tracking-wider text-neutral-700">
            Resume
          </h2>
          <Sort
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const { resumeUrl, resumeName } = row.original;
      return (
        <Link
          href={resumeUrl}
          target="_blank"
          className="flex items-center text-purple-500"
        >
          <Button variant="outline">
            <FileIcon className="h-4 w-4" />
            <p className="w-20 truncate">{resumeName}</p>
          </Button>
        </Link>
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
      const { id, fullName, email } = row.original;

      return <CellAction id={id} fullName={fullName} email={email} />;
    },
  },
];
