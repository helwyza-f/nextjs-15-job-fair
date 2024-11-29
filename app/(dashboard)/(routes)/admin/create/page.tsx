"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export default function JobCreatePage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/jobs", values);
      // console.log(response);
      console.log("Navigating to:", `/admin/jobs/${response.data.id}`);
      router.push(`/admin/jobs/${response.data.id}`);
      toast.success("Job created successfully");
    } catch (error) {
      console.log((error as Error)?.message);
      // toast notification
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your job</h1>
        <p className="text-sm text-neutral-500">
          What would you like to name your job? Don&apos;t worry, you can change
          this later
        </p>

        {/* form */}
        <Form {...form}>
          <form
            className="space-y-8 mt-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* form field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Fullstack Developer'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Role of this job</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/admin/jobs">
                <Button type="button" variant={"ghost"}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant={"default"}
                disabled={!isValid || isSubmitting}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
