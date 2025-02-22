import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/config/i18n/request.ts");

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    domains: ["upload.wikimedia.org"],
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BEAUTIFY_BACKEND_AUTH_URL:
      process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_AUTH_URL,
    NEXT_PUBLIC_BEAUTIFY_BACKEND_COMMAND_URL:
      process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_COMMAND_URL,
    NEXT_PUBLIC_BEAUTIFY_BACKEND_QUERY_URL:
      process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_QUERY_URL,
  },
};

export default withNextIntl(nextConfig);
