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
    ],
  },
};

export default nextConfig;
