"use client";

import { UserProfile } from "@prisma/client";
import { useState, useEffect } from "react";
import { Modal } from "./modal";
import Box from "../box";
import { Button } from "./button";
import Link from "next/link";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onConfirm: () => void;
  loading: boolean;
}

export const ApplyModal = ({
  isOpen,
  onClose,
  userProfile,
  onConfirm,
  loading,
}: ApplyModalProps) => {
  // Kode ini digunakan untuk memastikan bahwa komponen hanya dirender setelah komponen tersebut dipasang (mounted) di DOM.
  // Ini mencegah masalah yang mungkin terjadi jika komponen mencoba mengakses state atau props sebelum siap.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone."
      isOpen={isOpen}
      // Menggunakan callback function kosong di sini tidak memberikan efek apapun saat modal ditutup.
      // Hal ini dapat menyebabkan kebingungan karena seharusnya fungsi onClose yang diberikan sebagai props dipanggil untuk menangani logika penutupan modal.
      // Jika kita menggunakan onClose={onClose}, maka fungsi yang benar akan dipanggil saat modal ditutup.
      onClose={onClose}
    >
      <Box>
        <div className="grid w-full grid-cols-2 gap-2">
          <label className="rounded-md border p-3">
            {userProfile?.fullName}
          </label>
          <label className="rounded-md border p-3">
            {userProfile?.contact}
          </label>
          <label className="col-span-2 rounded-md border p-3">
            {userProfile?.email}
          </label>
          <label className="col-span-2 flex items-center gap-2 whitespace-nowrap rounded-md border p-3">
            Your Active Resume :{" "}
            <span className="w-full truncate text-purple-500">
              {Array.isArray(userProfile?.resumes) &&
                userProfile.resumes
                  .filter(
                    (resume): resume is { url: string; name: string } =>
                      resume !== null,
                  )
                  .find((resume) => resume.url === userProfile.activeResume)
                  ?.name}
            </span>
          </label>
          <div className="col-span-2 flex items-center justify-end text-sm text-muted-foreground">
            Change your detail{" "}
            <Link href="/user" className="ml-1 text-blue-500">
              {" "}
              here
            </Link>
          </div>
        </div>
      </Box>

      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={onConfirm}
          className="bg-purple-700 hover:bg-purple-600"
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
