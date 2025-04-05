/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // or more if needed
    },
  },
};

export default nextConfig;
