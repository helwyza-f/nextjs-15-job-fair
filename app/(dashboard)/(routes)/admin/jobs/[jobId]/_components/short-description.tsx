"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2, Lightbulb } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import GeneratePrompt from "@/scripts/ai-studio";
import toast from "react-hot-toast";
import axios from "axios";
import { Job } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  short_description: z.string().min(1),
});

export default function ShortDescriptionForm({
  initialData,
  jobId,
}: ShortDescriptionProps) {
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short_description: initialData?.short_description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Category updated.");
      toogleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const toogleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const job_short_description = `Could you craft a concise job description for a ${prompt} position in fewer than 600 characters?`;

      const response = await GeneratePrompt(job_short_description);
      form.setValue("short_description", response);
      setIsPrompting(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <h2 className="font-bold text-lg text-neutral-700">
          Job Short Description
        </h2>
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

      {/* display the description when not editing */}
      {!isEditing && (
        <p className="text-md mt-2">
          {initialData?.short_description || "No short description"}
        </p>
      )}

      {/* display the form when editing */}
      {isEditing && (
        <>
          <div className="w-full flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g 'Fullstack Developer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className=" h-4 w-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGeneration}>
                  <Lightbulb className=" h-4 w-4 " />
                </Button>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-right">
            Note: This will generate a job description based on the prompt
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="Short description about the job"
                        {...field}
                        rows={4}
                        className="leading-loose tracking-wide resize-none"
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
        </>
      )}
    </div>
  );
}
