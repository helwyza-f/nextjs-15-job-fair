"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/image-upload";

import toast from "react-hot-toast";
import axios from "axios";
import { Company } from "@prisma/client";
import Image from "next/image";

interface CompanyCoverFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  coverImageUrl: z.string(),
});

export default function CompanyCoverForm({
  initialData,
  companyId,
}: CompanyCoverFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImageUrl: initialData?.coverImageUrl || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toogleEditing();
      router.refresh();
      toast.success("coverImageUrl updated.");
    } catch (error) {
      toast.error("Something went wrong.");
      console.log((error as Error)?.message);
    }
  };

  const toogleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <h2 className="text-lg font-bold text-neutral-700">
          Company Cover Image
        </h2>
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

      {/* display the coverImageUrl when not editing */}
      {!isEditing &&
        (!initialData.coverImageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-neutral-200">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video h-60 w-full">
            <Image
              alt="cover image"
              fill
              className="h-full w-full rounded-md object-contain"
              src={initialData.coverImageUrl}
              sizes="100%"
            />
          </div>
        ))}

      {/* display the form when editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="coverImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value} // Nilai dari formulir
                      onChange={(url) => field.onChange(url)} // Fungsi untuk memperbarui nilai formulir
                      onRemove={() => field.onChange("")} // Reset nilai formulir saat dihapus
                      folder="company/cover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
