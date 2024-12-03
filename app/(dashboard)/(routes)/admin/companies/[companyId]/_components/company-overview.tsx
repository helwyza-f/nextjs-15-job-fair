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

interface CompanyOverviewProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  overview: z.string().min(1),
});

export default function CompanyOverview({
  initialData,
  companyId,
}: CompanyOverviewProps) {
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [roleName, setRoleName] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overview: initialData?.overview || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // return console.log(values.overview);
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company overview updated.");
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

      const company_overview = `Generate an overview content about ${roleName}. Include information about its history, purpose, features, user base, and impact on the industry. Focus on providing a comprehensive yet concise summary suitable for readers unfamiliar with the platform.`;
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
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <h2 className="font-bold text-lg text-neutral-700">Company overview</h2>
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

      {/* display the overview when not editing */}
      {!isEditing && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData.overview && "text-neutral-500 italic"
          )}
        >
          {!initialData.overview && "No overview yet."}
          {initialData.overview && <Preview value={initialData.overview} />}
        </div>
      )}

      {/* display the form when editing */}
      {isEditing && (
        <>
          <div className="w-full flex items-center gap-4 my-2">
            <Textarea
              //     type="text"
              placeholder="Write your company overview here, AI will help you generate a summary."
              value={roleName}
              rows={1}
              onChange={(e) => setRoleName(e.target.value)}
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
            Note: This will generate a company overview based on the prompt
          </p>
          {aiValue && (
            <div className="mt-4 bg-white rounded-lg w-full h-96 max-h-96 overflow-y-scroll p-3 relative text-muted-foreground">
              {aiValue}
              <Button
                className="absolute top-3 right-3 z-10 animate-pulse ease-in-out bg-violet-500 text-white hover:bg-violet-600"
                variant="outline"
                onClick={onCopy}
              >
                <Copy className="w-4 h-4 " />
              </Button>
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="overview"
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
