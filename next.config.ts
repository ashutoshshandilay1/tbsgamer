import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React Strict Mode — it double-invokes effects in dev,
  // which causes two concurrent Supabase auth lock acquisitions
  // and triggers the "lock was stolen" race condition.
  reactStrictMode: false,
};

export default nextConfig;
