import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"img.clerk.com"
      },
      {
        protocol:"https",
        hostname:"images.unsplash.com"
      }
    ],
    
  },
  typescript:{
    ignoreBuildErrors:true
  }
};

export default nextConfig;
