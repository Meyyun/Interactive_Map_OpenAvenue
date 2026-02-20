/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable if you need app directory features
    appDir: true,
  },
  env: {
    // Make environment variables available to the browser
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  // Add any additional configuration here
}

module.exports = nextConfig