import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crmsgchfvmltrwgnvszr.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/job-fair/**",
      },
    ],
  },
};

export default nextConfig;
