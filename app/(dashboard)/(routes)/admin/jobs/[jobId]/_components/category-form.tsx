"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ComboBox from "@/components/ui/combo-box";
import toast from "react-hot-toast";
import axios from "axios";
import { Job } from "@prisma/client";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
  initialData: Job;
  jobId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

export default function CategoryForm({
  initialData,
  jobId,
  options,
}: CategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId?.toString() || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Category updated.");
      toogleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
      console.log((error as Error)?.message);
    }
  };

  const toogleEditing = () => setIsEditing((current) => !current);

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId?.toString(),
  );

  return (
    <div className="mt-6 rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <h2 className="text-lg font-bold text-neutral-700">Job Category</h2>
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

      {/* display the title when not editing */}
      {!isEditing && (
        <p
          className={cn(
            "text-md mt-2",
            !initialData.categoryId && "italic text-neutral-500",
          )}
        >
          {selectedOption?.label || "Not selected yet"}
        </p>
      )}

      {/* display the form when editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      heading="Select a category"
                      options={options}
                      {...field}
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
