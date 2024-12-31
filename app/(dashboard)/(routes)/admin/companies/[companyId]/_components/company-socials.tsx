"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Globe, Linkedin, MailIcon, MapPin, Pencil } from "lucide-react";
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
import { Company } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface CompanySocialsProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  mail: z.string().min(1, {
    message: "Mail is required",
  }),
  website: z.string().min(1, {
    message: "Website is required",
  }),
  linkedin: z.string().min(1, {
    message: "Linkedin is required",
  }),
  address_line_1: z.string().min(1, {
    message: "Address Line 1 is required",
  }),
  address_line_2: z.string().min(1, {
    message: "Address Line 2 is required",
  }),
  city: z.string().min(1, {
    message: "City is required",
  }),
  state: z.string().min(1, {
    message: "State is required",
  }),
  zip_code: z.string().min(1, {
    message: "Zip Code is required",
  }),
});

export default function CompanySocials({
  initialData,
  companyId,
}: CompanySocialsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData.mail || "",
      website: initialData.website || "",
      linkedin: initialData.linkedin || "",
      address_line_1: initialData.address_line_1 || "",
      address_line_2: initialData.address_line_2 || "",
      city: initialData.city || "",
      state: initialData.state || "",
      zip_code: initialData.zip_code || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company Name Updated.");
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
        <h2 className="text-lg font-bold text-neutral-700">Company Socials</h2>
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
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3">
            {initialData.mail && (
              <div className="flex items-center gap-x-2 truncate py-2 text-sm text-neutral-500">
                <MailIcon className="h-4 w-4" />
                {initialData.mail}
              </div>
            )}
            {initialData.website && (
              <Link
                href={initialData.website}
                className="group flex items-center gap-x-2 truncate py-2 text-sm text-neutral-500"
              >
                <Globe className="h-4 w-4" />
                <span className="group-hover:text-primary group-hover:underline">
                  {initialData.website}
                </span>
              </Link>
            )}
            {initialData.linkedin && (
              <Link
                href={initialData.linkedin}
                className="group flex items-center gap-x-2 truncate py-2 text-sm text-neutral-500"
              >
                <Linkedin className="h-4 w-4" />
                <span className="group-hover:text-primary group-hover:underline">
                  {initialData.linkedin}
                </span>
              </Link>
            )}
          </div>
          <div className="col-span-3">
            {initialData.address_line_1 && (
              <div className="flex items-start justify-start gap-2">
                <MapPin className="h-4 w-4" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {initialData.address_line_1}, {initialData.address_line_2},
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {initialData.city}, {initialData.state}{" "}
                    {initialData.zip_code}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
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
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Company Email: example@gmail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Official Website: https://example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Linkedin Profile: https://linkedin.com/example"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Address Line 1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Address Line 2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="City"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="State"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="Zip Code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
