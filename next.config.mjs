const nextConfig = {
  output: "standalone",

  images: {
    unoptimized: true,      // 🚀 KILLS sharp (huge)
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ],
  },

  compress: true,          // gzip + brotli

  poweredByHeader: false, 
}
