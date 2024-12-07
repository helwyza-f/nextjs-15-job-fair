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
import Image from "next/image";

export type CompaniesColumns = {
  id: string;
  name: string;
  logoUrl: string | null;
  createdAt: string;
};
const logoPath = "/img/logo-placeholder-image.png";
export const columns: ColumnDef<CompaniesColumns>[] = [
  {
    accessorKey: "LogoUrl",
    header: () => <div className="font-bold tracking-wider text-md">Logo</div>,
    cell: ({ row }) => {
      const { logoUrl } = row.original;
      return (
        <div className="w-20 h-20 flex items-center justify-center relative rounded-full">
          <Image
            src={logoUrl || logoPath}
            fill
            sizes="100%"
            // width={20}
            // height={20}
            alt="Company Logo"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-2 ">
          <h2 className="font-bold tracking-wider text-md text-neutral-700">
            Company Name
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
      const company = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/companies/${company.id}`} scroll={false}>
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
