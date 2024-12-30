"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2, Lightbulb, Copy } from "lucide-react";
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
import { Company, Job } from "@prisma/client";
import Preview from "@/components/preview";
import Editor from "@/components/editor";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface WhyJoinUsProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  whyJoinUs: z.string().min(1),
});

export default function WhyJoinUs({ initialData, companyId }: WhyJoinUsProps) {
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [roleName, setRoleName] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyJoinUs: initialData?.whyJoinUs || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // return console.log(values.overview);
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Why join us updated.");
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

      const company_overview = `Generate an why join us content about ${roleName}. Include information about its history, purpose, features, user base, and impact on the industry. Focus on providing a comprehensive yet concise summary suitable for readers unfamiliar with the platform.`;
      const response = await GeneratePrompt(company_overview);
      const cleanResponse = response.replace(/^'|'$/g, "");
      const finalResponse = cleanResponse.replace(/[\*\#]/g, "");
      setAiValue(finalResponse);
      setIsPrompting(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to clipboard.");
  };

  return (
    <div className="mt-6 rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <h2 className="text-lg font-bold text-neutral-700">Why Join Us</h2>
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

      {/* display the overview when not editing */}
      {!isEditing && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData.whyJoinUs && "italic text-neutral-500",
          )}
        >
          {!initialData.whyJoinUs && "No why join us yet."}
          {initialData.whyJoinUs && <Preview value={initialData.whyJoinUs} />}
        </div>
      )}

      {/* display the form when editing */}
      {isEditing && (
        <>
          <div className="my-2 flex w-full items-center gap-4">
            <Textarea
              //     type="text"
              placeholder="Write your why join us here, AI will help you generate a summary."
              value={roleName}
              rows={1}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            />

            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGeneration}>
                  <Lightbulb className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-right text-sm text-muted-foreground">
            Note: This will generate a why join us based on the prompt
          </p>
          {aiValue && (
            <div className="relative mt-4 h-96 max-h-96 w-full overflow-y-scroll rounded-lg bg-white p-3 text-muted-foreground">
              {aiValue}
              <Button
                className="absolute right-3 top-3 z-10 animate-pulse bg-violet-500 text-white ease-in-out hover:bg-violet-600"
                variant="outline"
                onClick={onCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-4"
            >
              <FormField
                control={form.control}
                name="whyJoinUs"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
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
