import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      // Spotify CDN — album art, artist images, avatars
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
      { protocol: "https", hostname: "thisis-img.scdn.co" },
      { protocol: "https", hostname: "lineup-images.scdn.co" },
      { protocol: "https", hostname: "*.scdn.co" },
      { protocol: "https", hostname: "*.spotifycdn.com" },
      // Google (user avatars via Supabase OAuth)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
