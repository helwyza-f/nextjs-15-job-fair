"use client";

import React, { useEffect, useState } from "react";
import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Page() {
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const response = await axios.get("/api/get-user-role");
      if (
        (response.data && response.data === "recruiter") ||
        response.data === "job-seeker"
      ) {
        toast.error("You have already selected a role");
        router.push("/");
      }
    };
    fetchUserRole();
  }, []);

  const onSubmit = async (role: string) => {
    await axios.post("/api/auth/select-role", { role });

    setRole("");
    toast.success("Role selected");
    router.push("/");
  };

  const handleSubmit = () => {
    if (!role) return;
    onSubmit(role);
  };

  return (
    <Box className="flex h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500">
      <h1 className="mb-6 text-3xl font-bold text-white">Select Your Role</h1>
      <p className="mb-4 text-lg text-white">
        Please choose one of the following roles:
      </p>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex gap-4">
          <Button
            onClick={() => setRole("recruiter")}
            className={`transform transition duration-300 ease-in-out ${
              role === "recruiter"
                ? "bg-white text-purple-600"
                : "bg-purple-600 text-white"
            } hover:bg-white hover:text-purple-600`}
          >
            Recruiter
          </Button>
          <Button
            onClick={() => setRole("job-seeker")}
            className={`transform transition duration-300 ease-in-out ${
              role === "job-seeker"
                ? "bg-white text-purple-600"
                : "bg-purple-600 text-white"
            } hover:bg-white hover:text-purple-600`}
          >
            Job Seeker
          </Button>
        </div>
        <Button
          disabled={!role}
          onClick={handleSubmit}
          className="bg-indigo-600 text-white transition duration-300 hover:bg-indigo-800"
        >
          Submit
        </Button>
      </div>
    </Box>
  );
}
