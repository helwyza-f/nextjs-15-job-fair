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
import { useRouter } from "next/navigation";

interface CellActionProps {
  id: string;
  fullName: string;
  email: string;
  jobId: string;
  selectedUsers: string[];
  rejectedUsers: string[];
}

export default function CellAction({
  id,
  fullName,
  email,
  jobId,
  selectedUsers,
  rejectedUsers,
}: CellActionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRejection, setIsRejection] = useState(false);

  const isSelected = selectedUsers.includes(id);
  const isRejected = rejectedUsers.includes(id);

  const sendSelected = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/send-selected", {
        id,
        email,
        fullName,
        jobId,
      });
      toast.success("User selected");
      router.refresh();
    } catch (error) {
      console.error("Error sending selected user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendRejected = async () => {
    setIsRejection(true);
    try {
      await axios.post("/api/send-rejected", {
        id,
        email,
        fullName,
        jobId,
      });
      toast.success("User rejected");
      router.refresh();
    } catch (error) {
      console.error("Error sending rejected user:", error);
    } finally {
      setIsRejection(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          // disabled={isSelected || isRejected}
        >
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
          <>
            <DropdownMenuItem className="flex items-center justify-center">
              {isSelected ? (
                <BadgeCheck className="h-4 w-4 text-green-500" />
              ) : isRejected ? (
                <BadgeX className="h-4 w-4 text-red-500" />
              ) : null}
              <span className="ml-2">
                {isSelected
                  ? "Selected"
                  : isRejected
                    ? "Rejected"
                    : "Not Selected yet"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={sendSelected}
              className="flex items-center justify-center"
              disabled={isSelected || isRejected}
            >
              <BadgeCheck className="h-4 w-4" />
              <span className={isSelected || isRejected ? "text-gray-500" : ""}>
                Select
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={sendRejected}
              className="flex items-center justify-center"
              disabled={isSelected || isRejected}
            >
              <BadgeX className="h-4 w-4" />
              <span className={isSelected || isRejected ? "text-gray-500" : ""}>
                Reject
              </span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
