/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fever-lol.s3.amazonaws.com",
        port: "",
        pathname: "/flyer/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
