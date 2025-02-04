import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ppscanner.pythonanywhere.com",
      },
    ],
  },
  reactStrictMode: false,

};

export default nextConfig;
