import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        }
    },
    images: {
        localPatterns: [
            {
                pathname: '/api/images',
            },
        ],
    },
};

export default nextConfig;
