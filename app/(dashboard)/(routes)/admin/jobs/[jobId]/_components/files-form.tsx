"use client";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Job } from "@prisma/client";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  File,
  FileCheck2Icon,
  FilePlus2,
  ImagePlus,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UploadedFile {
  name: string;
  url: string;
}

interface FilesUploadsProps {
  bucket: string; // Nama bucket di Supabase
  jobId: string;
  initialData: Job;
}

const formSchema = z.object({
  attachments: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
});

const FileUploader: React.FC<FilesUploadsProps> = ({
  bucket,
  jobId,
  initialData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const toogleEditing = () => setIsEditing((current) => !current);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      attachments: (Array.isArray(initialData.attachments)
        ? initialData.attachments.map<{ name: string; url: string }>(
            (attachment) => ({
              name: (attachment as { name: string; url: string }).name,
              url: (attachment as { name: string; url: string }).url,
            })
          )
        : []) as { name: string; url: string }[],
    },
  });

  const { control, getValues, setValue } = form;
  const { isSubmitting, isValid } = form.formState;
  const values = useWatch({
    control,
    name: "attachments",
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
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
          .upload(`job/attachments/${uniqueFileName}`, file);

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
          .getPublicUrl(`job/attachments/${uniqueFileName}`);

        // Tambahkan file yang berhasil diunggah ke daftar lokal
        const newFileEntry = {
          name: file.name,
          url: publicUrlData.publicUrl,
        };

        // Update field value with new file
        const currentAttachments = getValues("attachments") || [];
        setValue("attachments", [...currentAttachments, newFileEntry]);

        setIsUploading(false);
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }
  };

  const handleDeleteFile = async (fileUrl: string) => {
    // console.log(fileUrl);
    try {
      const filePath = fileUrl.split("/storage/v1/object/public/job-fair/")[1];
      if (!filePath) throw new Error("Invalid file URL");

      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        toast.error("Failed to delete file");
        return;
      }

      // Update attachments di state
      const updatedAttachments = getValues("attachments").filter(
        (file: UploadedFile) => file.url !== fileUrl
      );
      setValue("attachments", updatedAttachments); // Tidak memengaruhi `isEditing`

      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        // ...values,
        attachments: values.attachments ?? [],
      };
      await axios.patch(`/api/jobs/${jobId}`, data);
      setIsEditing(false); // Keluar dari mode edit setelah submit
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <h2 className="font-bold text-lg text-neutral-700">Attachments</h2>
        <Button onClick={toogleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        initialData.attachments &&
        Array.isArray(initialData.attachments) &&
        initialData.attachments.length === 0 && (
          <p className="text-medium text-neutral-500 italic">
            No attachments yet.
          </p>
        )}

      {!isEditing &&
        initialData.attachments &&
        Array.isArray(initialData.attachments) &&
        initialData.attachments.length != 0 && (
          <div className="flex flex-col">
            {initialData.attachments
              // difilter untuk ngecheck apakah nilai dalam object tersebut bukan null, hanya mengembalikan yg tidak null
              .filter(
                (file): file is { name: string; url: string } => file !== null
              )
              // setelah di filter, dan dipastikan nilai masing2 properti didalam objek tidak null, baru di looping
              .map((file, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-start bg-gray-100 rounded-md p-2 gap-3"
                  >
                    <Link
                      href={file.url}
                      className="text-blue-500"
                      target="_blank"
                    >
                      {file.name}
                    </Link>
                    <FileCheck2Icon className="h-5 w-5" />
                  </div>
                );
              })}
          </div>
        )}

      {isEditing && (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={control}
                name="attachments"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <label>
                          {isUploading ? (
                            <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                              <Loader2 className="w-6 h-6 animate-spin text-purple-950 font-bold" />
                              Uploading...
                            </div>
                          ) : (
                            <>
                              <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer text-neutral-500">
                                <FilePlus2 className="h-10 w-10" />
                                <p>Upload a File</p>
                              </div>
                              <input
                                type="file"
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
                      className="flex items-center justify-start bg-gray-100 rounded-md px-2 "
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
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    No files uploaded yet.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-x-2 mt-4">
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

export default FileUploader;
