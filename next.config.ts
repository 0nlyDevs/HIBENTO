
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
      },
    ],
    qualities: [75, 85],
  },
};

module.exports = nextConfig;