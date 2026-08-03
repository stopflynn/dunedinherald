import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { newsroomStructure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

if (!projectId) {
  throw new Error("Missing SANITY_STUDIO_PROJECT_ID. Copy .env.example to .env and add the Sanity project ID.");
}

export default defineConfig({
  name: "dunedin-herald-newsroom",
  title: "Dunedin Herald Newsroom",
  projectId,
  dataset,
  basePath: "/newsroom",
  plugins: [structureTool({ structure: newsroomStructure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (previous) => previous.filter((item) => item.templateId !== "siteSettings"),
  },
});
