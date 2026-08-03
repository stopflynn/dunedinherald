import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",

  groups: [
    {
      name: "general",
      title: "General",
      default: true,
    },
    {
      name: "Hero Category",
      title: "Hero Category",
    },
    {
      name: "Low Banner",
      title: "Low Banner",
    },
    {
      name: "header",
      title: "Header",
    },
    {
      name: "footer",
      title: "Footer",
    },
  ],


  fields: [
    defineField({ name: "taglineRight", title: "Tagline-right", type: "string", group: "header", initialValue: "Ōtepoti's least reliable" }),
    defineField({ name: "taglineLeft", title: "Tagline-left", type: "string", group: "header", initialValue: "Critic's critic" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url", group: "general", initialValue: "https://www.instagram.com/dunedinherald/" }),
    defineField({ name: "contactEmail", title: "Editorial email", type: "email", group: "general", initialValue: "editor@dunedinherald.com" }),
    defineField({ name: "footerText", title: "Footer text", type: "text", group: "footer", initialValue: "The Dunedin Herald is a satirical publication. All content is parody and not intended to be taken as fact." }),
    defineField({ name: "heroCategory", title: "Hero category", type: "reference", group: "Hero Category", to: [{ type: "category" }] }),
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string", group: "Hero Category" }),
    defineField({ name: "heroTitle", title: "Hero title", type: "string", group: "Hero Category" }),
    defineField({ name: "lowBannerText", title: "Low banner text", type: "string", group: "Low Banner" }),
    defineField({ name: "lowBannerTitle", title: "Low banner title", type: "string", group: "Low Banner" }),
    defineField({name: "lowBannerEyebrow", title: "Low banner eyebrow", type: "string", group: "Low Banner" }),
    defineField({ name: "lowBannerVisibility", title: "Low banner visibility", type: "boolean", group: "Low Banner", initialValue: false }),
    defineField({
      name: "passwordProtectionEnabled",
      title: "Password-protect the website",
      description: "Requires SITE_ACCESS_PASSWORD and SITE_ACCESS_COOKIE_SECRET to be configured securely on the website host. Never store the password in Sanity.",
      type: "boolean",
      group: "general",
      initialValue: false,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site settings",
        subtitle: "Header, footer and homepage controls",
      };
    },
  },
});
