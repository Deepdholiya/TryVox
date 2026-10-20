/** Static export: every route is pre-rendered to plain HTML, so search engines and LLM crawlers read full content without running JavaScript. */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
