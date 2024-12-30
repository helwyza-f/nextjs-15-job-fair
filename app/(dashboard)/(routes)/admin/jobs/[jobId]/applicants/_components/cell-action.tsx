"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { MoreHorizontal, Loader2, BadgeCheck, BadgeX } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CellActionProps {
  id: string;
  fullName: string;
  email: string;
}

export default function CellAction({ id, fullName, email }: CellActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejection, setIsRejection] = useState(false);

  const sendSelected = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-selected", {
        email,
        fullName,
      });
      toast.success("Email sent");
    } catch (error) {
      console.error("Error sending selected email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendRejected = async () => {
    setIsRejection(true);
    try {
      const response = await axios.post("/api/send-rejected", {
        email,
        fullName,
      });
      toast.success("Email sent");
    } catch (error) {
      console.error("Error sending rejected email:", error);
    } finally {
      setIsRejection(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isLoading ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={sendSelected}
            className="flex items-center justify-center"
          >
            <BadgeCheck className="h-4 w-4" />
            Selected
          </DropdownMenuItem>
        )}
        {isRejection ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={sendRejected}
            className="flex items-center justify-center"
          >
            <BadgeX className="h-4 w-4" />
            Rejected
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
