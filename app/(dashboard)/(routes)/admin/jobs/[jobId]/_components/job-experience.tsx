"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
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

interface JobExperienceProps {
  initialData: Job;
  jobId: string;
}
const formSchema = z.object({
  yearsOfExperience: z.string().min(1),
});

const options = [
  {
    value: "0",
    label: "Fresh Graduate",
  },
  {
    value: "2",
    label: "0-2 years",
  },
  {
    value: "3",
    label: "2-5 years",
  },
  {
    value: "5",
    label: "5-10 years",
  },
];

export default function JobExperience({
  initialData,
  jobId,
}: JobExperienceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: initialData.yearsOfExperience?.toString() || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Work Mode updated.");
      toogleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const toogleEditing = () => setIsEditing((current) => !current);

  const selectedOption = options.find(
    (option) => option.value === initialData.yearsOfExperience?.toString()
  );

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <h2 className="font-bold text-lg text-neutral-800">Job Experience</h2>
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

      {/* display the title when not editing */}
      {!isEditing && (
        <p
          className={cn(
            "text-md mt-2",
            !initialData.yearsOfExperience && "text-neutral-500 italic"
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
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      heading="Select the job experience"
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
