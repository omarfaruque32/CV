const SITES_URL =
  "https://omar-faruque-cv-2026.rashed829489.chatgpt.site";

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelProductionHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

export const SITE_URL = (
  configuredUrl ||
  (vercelProductionHost ? `https://${vercelProductionHost}` : SITES_URL)
).replace(/\/+$/, "");
