/** @type {import('next').NextConfig} */
const nextConfig = {
 output: "standalone",

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
      { protocol: "https", hostname: "https://res.cloudinary.com" },
      { protocol: "https", hostname: "https://cdn.bunnycdn.com" },
      { protocol: "https", hostname: "https://planwab-videos.b-cdn.net" },
      { protocol: "https", hostname: "https://planwab.b-cdn.net" },
    ],
  },

  compress: true,          // gzip + brotli

  poweredByHeader: false, 
};

export default nextConfig;
