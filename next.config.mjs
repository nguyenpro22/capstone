import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/config/i18n/request.ts");

const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "via.placeholder.com",
      "qr.sepay.vn",
      "api.dicebear.com",
      "placehold.co",
      "thispersondoesnotexist.com",
      "cdn.nhathuoclongchau.com.vn",
    ],
  },
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_BEAUTIFY_BACKEND_AUTH_URL:
      process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_AUTH_URL,
    NEXT_PUBLIC_BEAUTIFY_BACKEND_COMMAND_URL:
      process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_COMMAND_URL,
    NEXT_PUBLIC_BEAUTIFY_BACKEND_QUERY_URL:
      process.env.NEXT_PUBLIC_BEAUTIFY_BACKEND_QUERY_URL,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      type: "asset/source", // Bỏ qua file .html (cách mới thay vì 'ignore-loader')
    });
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
