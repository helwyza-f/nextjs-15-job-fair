"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface JobPublishActionsProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

export default function JobPublishActions({
  disabled,
  jobId,
  isPublished,
}: JobPublishActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const onclick = async () => {};
  const onDelete = async () => {};
  return (
    <div className="flex gap-x-2">
      <Button
        variant={"outline"}
        disabled={disabled || isLoading}
        size={"sm"}
        onClick={onclick}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <Button
        variant={"destructive"}
        size={"icon"}
        disabled={isLoading}
        onClick={onDelete}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
