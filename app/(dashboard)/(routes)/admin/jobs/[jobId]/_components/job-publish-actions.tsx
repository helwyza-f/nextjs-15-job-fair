"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onclick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/jobs/${jobId}`, {
        isPublished: !isPublished,
      });
      toast.success("Job status updated successfully!");
      router.push("/admin/jobs", { scroll: false });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/jobs/${jobId}`);
      toast.success(response.data.message);

      router.push("/admin/jobs", { scroll: false });
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete the job. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-x-2">
      <Button
        variant={"outline"}
        disabled={disabled || isLoading}
        size={"sm"}
        onClick={onclick}
      >
        {!isLoading ? (
          isPublished ? (
            "Unpublish"
          ) : (
            "Publish"
          )
        ) : (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </>
        )}
      </Button>

      <Button
        variant={"destructive"}
        size={"icon"}
        disabled={isLoading}
        onClick={() => setShowModal(true)} // Tampilkan modal
      >
        <Trash className="h-4 w-4" />
      </Button>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-80">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to delete this job?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant={"outline"}
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setShowModal(false);
                  onDelete();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
