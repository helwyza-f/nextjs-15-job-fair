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

import toast from "react-hot-toast";
import axios from "axios";
import { Company } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

interface CompanyDescriptionProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export default function CompanyDescription({
  initialData,
  companyId,
}: CompanyDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company Description Updated.");
      toogleEditing();
      router.refresh();
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
          Company Description
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

      {/* display the title when not editing */}
      {!isEditing && <p className="text-md mt-2">{initialData.description}</p>}

      {/* display the form when editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="This is the description of the company."
                      rows={3}
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
