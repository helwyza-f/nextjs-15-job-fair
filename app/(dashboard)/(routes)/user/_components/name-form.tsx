"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil, UserCircleIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { UserProfile } from "@prisma/client";
import Box from "@/components/box";
import { cn } from "@/lib/utils";
import Banner from "@/components/banner";

interface NameFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: "Name is required",
  }),
});

export default function NameForm({ initialData, userId }: NameFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.patch(`/api/users/${userId}`, values);
      toast.success("Profile updated.");
      toogleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const toogleEditing = () => setIsEditing((current) => !current);

  return (
    <Box>
      {!isEditing && (
        <div
          className={cn(
            "text-md mt-2 flex items-center gap-2 font-medium",
            !initialData?.fullName && "italic text-neutral-500",
          )}
        >
          <UserCircleIcon className="mr-2 h-6 w-6" />
          {!initialData?.fullName && (
            <Banner
              variant={"warning"}
              label="You may wanna set your Profile first"
            />
          )}
          {initialData?.fullName || "No name"}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 items-center gap-2"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g. Helwiza Fahry"
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
      <Button onClick={toogleEditing} variant={"ghost"}>
        {isEditing ? "Cancel" : "Edit"}
      </Button>
    </Box>
  );
}
