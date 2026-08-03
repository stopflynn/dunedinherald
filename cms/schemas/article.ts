import { defineArrayMember, defineField, defineType } from "sanity";

defineField({
  name: "category",
  title: "Section",
  type: "reference",
  group: "publishing",
  to: [{ type: "category" }],
  validation: (rule) => rule.required(),
})

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "story", title: "Story", default: true },
    { name: "image", title: "Image & credit" },
    { name: "instagram", title: "Instagram" },
    { name: "publishing", title: "Publishing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      group: "story",
      validation: (rule) => rule.required().min(8).max(120),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "story",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Standfirst / summary",
      description: "One sentence shown beneath the headline and on story cards.",
      type: "text",
      rows: 3,
      group: "story",
      validation: (rule) => rule.required().min(30).max(240),
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "array",
      group: "story",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Pull quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({ name: "href", title: "URL", type: "url", validation: (rule) => rule.uri({ scheme: ["http", "https", "mailto"] }) }),
                ],
              },
            ],
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "heroImage",
      title: "Lead image",
      type: "image",
      group: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alternative text", description: "Describe the image for people who cannot see it.", type: "string", validation: (rule) => rule.required().min(8) }),
        defineField({ name: "caption", title: "Caption and credit", type: "string", validation: (rule) => rule.required().min(5) }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Section",
      type: "reference",
      group: "publishing",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Byline",
      type: "string",
      group: "publishing",
      initialValue: "Dunedin Herald Editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "publishing",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Lead story on homepage",
      description: "Turn this on for only one article at a time.",
      type: "boolean",
      group: "publishing",
      initialValue: false,
    }),
    defineField({
      name: "instagramPostUrl",
      title: "Instagram post URL",
      description: "If this article has an Instagram post, paste the URL here.",
      type: "url",
      group: "instagram",
    }),
  ],
  orderings: [
    { title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "heroImage" },
  },
});
