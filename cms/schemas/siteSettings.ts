import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "tagline", title: "Tagline", type: "string", initialValue: "Ōtepoti's least reliable" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url", initialValue: "https://www.instagram.com/dunedinherald/" }),
    defineField({ name: "contactEmail", title: "Editorial email", type: "email", initialValue: "editor@dunedinherald.com" }),
  ],
});
