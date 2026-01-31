/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    unoptimized: true,
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.bunnycdn.com" },
      { protocol: "https", hostname: "planwab-videos.b-cdn.net" },
      { protocol: "https", hostname: "planwab.b-cdn.net" },
      { protocol: "https", hostname: "**.b-cdn.net" },
    ],
  },

  compress: true,
  poweredByHeader: false,
};

export default nextConfig;