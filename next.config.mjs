/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb', // Allow large uploads
    },
  },

  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
    responseLimit: false,
  },

  serverRuntimeConfig: {
    maxDuration: 300, // 5 minutes
  },

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
