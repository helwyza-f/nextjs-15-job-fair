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
      if (response.data.role !== "" || response.data.role !== null) {
        toast.error("You have already selected a role");
        router.push("/");
      }
      setRole(response.data);
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
    <Box className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Select your role first</h1>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex gap-4">
          <Button onClick={() => setRole("recruiter")}>Recruiter</Button>
          <Button onClick={() => setRole("job-seeker")}>Job Seeker</Button>
        </div>
        <Button disabled={!role} onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Box>
  );
}
