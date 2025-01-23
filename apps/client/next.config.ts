import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'api.orn-atsinanana.mg',
            pathname: '/storage/**',
          },
        ],
    }
};

export default nextConfig;
