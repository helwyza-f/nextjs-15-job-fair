"use client";
import React, { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@prisma/client";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FileCheck2Icon,
  FilePlus2,
  Loader2,
  Pencil,
  ShieldCheckIcon,
  ShieldX,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
// import { DevTool } from "@hookform/devtools";

interface UploadedFile {
  name: string;
  url: string;
}

interface FilesUploadsProps {
  bucket: string; // Nama bucket di Supabase
  userId: string;
  initialData: UserProfile | null;
}

const formSchema = z.object({
  resumes: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    }),
  ),
});

const ResumeForm: React.FC<FilesUploadsProps> = ({
  bucket,
  userId,
  initialData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingActiveResume, setIsUpdatingActiveResume] = useState(false);
  const [activeResume, setActiveResume] = useState<string | null>(
    initialData?.activeResume ?? null,
  );
  const toogleEditing = () => setIsEditing((current) => !current);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      resumes: (Array.isArray(initialData?.resumes)
        ? initialData.resumes.map<{ name: string; url: string }>((resume) => ({
            name: (resume as { name: string; url: string }).name,
            url: (resume as { name: string; url: string }).url,
          }))
        : []) as { name: string; url: string }[],
    },
  });

  const { control, getValues, setValue } = form;
  const { isSubmitting, isValid } = form.formState;
  const values = useWatch({
    control,
    name: "resumes",
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        // Upload file ke Supabase
        setIsUploading(true);

        const uniqueFileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(`job/resumes/${uniqueFileName}`, file);

        if (error) {
          console.log(error.message);
          toast.error(error.message);

          // Kosongkan input field
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setIsUploading(false);
          return;
        }

        // Dapatkan URL file yang diunggah
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(`job/resumes/${uniqueFileName}`);

        // Tambahkan file yang berhasil diunggah ke daftar lokal
        const newFileEntry = {
          name: file.name,
          url: publicUrlData.publicUrl,
        };

        // Update field value with new file
        const currentAttachments = getValues("resumes") || [];
        setValue("resumes", [...currentAttachments, newFileEntry]);

        setIsUploading(false);
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }
  };

  const handleDeleteFile = async (fileUrl: string) => {
    console.log(fileUrl);
    if (initialData?.activeResume === fileUrl) {
      toast.error("Cannot delete active resume");
      return;
    }
    try {
      const filePath = fileUrl.split("/storage/v1/object/public/job-fair/")[1];
      if (!filePath) throw new Error("Invalid file URL");

      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        toast.error("Failed to delete file");
        return;
      }

      // Update attachments di state
      const updatedAttachments = getValues("resumes").filter(
        (file: UploadedFile) => file.url !== fileUrl,
      );
      setValue("resumes", updatedAttachments); // Tidak memengaruhi `isEditing`

      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        // ...values,
        resumes: values.resumes ?? [],
        activeResume: activeResume,
      };
      console.log(data);
      setIsEditing(false); // Keluar dari mode edit setelah submit
      await axios.patch(`/api/users/${userId}`, data);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleSetActiveResume = async (resumeUrl: string) => {
    const currentResumes = getValues("resumes") || [];
    const updatedResumes = currentResumes.map((resume) => ({
      ...resume,
      isActive: resume.url === resumeUrl, // Menandai resume aktif
    }));

    // Memanggil API untuk memperbarui activeResume di backend
    try {
      setIsUpdatingActiveResume(true);
      await axios.patch(`/api/users/${userId}/active-resume`, {
        activeResume: resumeUrl,
      });
      toast.success("Active resume updated successfully.");
      setActiveResume(resumeUrl);
      setValue("resumes", updatedResumes);
      setIsUpdatingActiveResume(false);
    } catch (error) {
      toast.error("Failed to update active resume.");
    }
  };

  return (
    <div className="mt-6 w-full flex-1 rounded-md border p-4">
      <div className="flex items-center justify-between font-medium">
        <h2 className="text-lg font-bold text-neutral-700">Your Resumes</h2>
        <Button onClick={toogleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        initialData?.resumes &&
        Array.isArray(initialData?.resumes) &&
        initialData?.resumes.length === 0 && (
          <p className="text-medium italic text-neutral-500">
            No resumes uploaded
          </p>
        )}

      {!isEditing &&
        initialData?.resumes &&
        Array.isArray(initialData?.resumes) &&
        initialData?.resumes.length != 0 && (
          <div className="flex flex-col">
            {values.map((file, index) => (
              <div
                key={index}
                className={`flex items-center justify-between gap-3 rounded-md p-2 transition-all duration-300 ${
                  activeResume === file.url
                    ? "border-l-4 border-purple-500 bg-purple-100"
                    : "bg-gray-100"
                }`}
              >
                <Link
                  href={file.url}
                  className="flex gap-2 font-semibold text-blue-500"
                  target="_blank"
                >
                  {file.name}
                  <FileCheck2Icon className="h-5 w-5" />
                </Link>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center justify-center gap-2",
                    activeResume === file.url
                      ? "text-emerald-500"
                      : "text-red-500",
                  )}
                  onClick={() => handleSetActiveResume(file.url)} // Mengatur resume aktif
                >
                  {isUpdatingActiveResume ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : activeResume === file.url ? (
                    <span className="flex items-center gap-2">
                      Live <ShieldCheckIcon className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Activate <ShieldX className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

      {isEditing && (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={control}
                name="resumes"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <label>
                          {isUploading ? (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                              <Loader2 className="h-6 w-6 animate-spin font-bold text-purple-950" />
                              Uploading...
                            </div>
                          ) : (
                            <>
                              <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-neutral-500">
                                <FilePlus2 className="h-10 w-10" />
                                <p>Upload a File</p>
                              </div>
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </>
                          )}
                        </label>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              {/* Render daftar file dari useWatch */}
              <div className="mt-4">
                {values && values.length > 0 ? (
                  values.map((file: { name: string; url: string }, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-start rounded-md bg-gray-100 px-2"
                    >
                      <Link
                        href={file.url}
                        className="text-blue-500"
                        target="_blank"
                      >
                        {file.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file.url)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    No files uploaded yet.
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
          {/* <DevTool control={control} /> */}
        </>
      )}
    </div>
  );
};

export default ResumeForm;
