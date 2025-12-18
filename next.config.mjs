/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows ALL domains over HTTPS
      },
      {
        protocol: "http",
        hostname: "**", // This allows ALL domains over HTTP (optional)
      },
    ],
  },
};

export default nextConfig;
