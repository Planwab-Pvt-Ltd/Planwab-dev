/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    minimumCacheTTL: 3600,
    dangerouslyAllowSVG: false,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dhkkvo36x/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      { protocol: "https", hostname: "cdn.bunnycdn.com" },
      { protocol: "https", hostname: "planwab-videos.b-cdn.net" },
      { protocol: "https", hostname: "planwab.b-cdn.net" },
      { protocol: "https", hostname: "**.b-cdn.net" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "www.theweddingcompany.com" },
      { protocol: "https", hostname: "cdn.theweddingcompany.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/((?!api|_next|admin).*)",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/admin(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;