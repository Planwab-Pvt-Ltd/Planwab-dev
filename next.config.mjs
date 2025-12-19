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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.yesmadam.com", // Adding this too since you used it in other components
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.theweddingcompany.com", // Adding this too
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
