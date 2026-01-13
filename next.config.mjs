/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
  async headers() {
    return [
      {
        // Target your video folder specifically
        source: "/CatVideos/:all*(mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // Cache for 1 year
          },
        ],
      },
      {
        // Also cache the Loading videos
        source: "/Loading/:all*(mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
