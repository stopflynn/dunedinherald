import { defineCliConfig } from "sanity/cli";

const appId = process.env.SANITY_STUDIO_APP_ID;

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  deployment: {
    ...(appId ? { appId } : {}),
    autoUpdates: Boolean(appId),
  },
});
