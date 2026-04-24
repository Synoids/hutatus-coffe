/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        // Allow any Supabase storage bucket URL
        hostname: '*.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
