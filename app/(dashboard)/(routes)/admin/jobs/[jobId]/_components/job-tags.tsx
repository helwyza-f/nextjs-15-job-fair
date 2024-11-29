"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2, Lightbulb, X } from "lucide-react";
import GeneratePrompt from "@/scripts/ai-studio";
import toast from "react-hot-toast";
import axios from "axios";
import { Job } from "@prisma/client";

interface JobTagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

export default function JobTagsForm({ initialData, jobId }: JobTagsFormProps) {
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags || []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: initialData.tags || [] },
  });

  const { setValue } = form;
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async () => {
    try {
      const payload = { tags: jobTags }; // Simpan array langsung ke database
      await axios.patch(`/api/jobs/${jobId}`, payload);
      toast.success("Tags updated.");
      toogleEditing();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setJobTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const toogleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const job_tags = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.`;

      const response = await GeneratePrompt(job_tags);
      // console.log(response);
      const cleanedResponse = response
        .replace(/^javascript\s*/, "")
        .replace(/^json\s*/, "");
      // console.log(cleanedResponse);

      const parsedResponse = JSON.parse(cleanedResponse);

      if (Array.isArray(parsedResponse)) {
        console.log("Setting jobTags:", parsedResponse);
        setJobTags((prevTags) => [...prevTags, ...parsedResponse]);
        setValue("tags", [...jobTags, ...parsedResponse]);
      } else {
        console.log("not array");
        toast.error("Something went wrong.");
      }
      setIsPrompting(false);
      setPrompt("");
    } catch (error) {
      console.error("Error during prompt generation:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsPrompting(false);
    }
  };

  const handleReset = () => {
    setJobTags([]); // Reset ke nilai awal
    setValue("tags", []);
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <h2 className="font-bold text-lg text-neutral-700">Job Tags</h2>
        <Button onClick={toogleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && jobTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {jobTags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-purple-300/90 border border-primary text-neutral-800 rounded-md px-3 py-1 text-md font-medium group"
            >
              <span>{tag}</span>
            </div>
          ))}
        </div>
      )}

      {!isEditing && jobTags.length < 1 && (
        <p className="text-neutral-500 text-md mt-2 italic">
          No tags added yet.
        </p>
      )}

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
              <Button>
                <Loader2 className=" h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button onClick={handlePromptGeneration}>
                <Lightbulb className=" h-4 w-4 " />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-right">
            Note: This will generate job tags related to the job based on the
            prompt
          </p>

          {jobTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-purple-300/90 border border-primary text-neutral-800 rounded-md px-3 py-2 text-md font-medium group"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-primary hover:text-red-500 focus:outline-none"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 duration-500 group-hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-between gap-2">
            <Button onClick={onSubmit} disabled={isSubmitting || !isValid}>
              Save
            </Button>
            <Button onClick={handleReset} variant={"destructive"}>
              Reset
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
