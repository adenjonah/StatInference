import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle data/ JSON + markdown with serverless functions so SSR + API
  // routes that read from disk (stages.json, content/*.md, exams/*.json,
  // questions/*.json) work on Vercel.
  outputFileTracingIncludes: {
    "/**/*": ["./data/**/*"],
  },
};

export default nextConfig;
