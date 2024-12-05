import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  zoho: {
    clientId: process.env.ZOHO_CLIENT_ID!,
    clientSecret: process.env.ZOHO_CLIENT_SECRET!,
    region: process.env.ZOHO_REGION || "in",
    redirectUri: process.env.ZOHO_REDIRECT_URI!,
  },
};

export default config;
