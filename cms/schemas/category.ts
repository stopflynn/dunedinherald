import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "showInNavigation",
      title: "Show in navigation",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "order",
      title: "Navigation order",
      description: "Lower numbers appear first.",
      type: "number",
      initialValue: 10,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],

  orderings: [
    {
      title: "Navigation order",
      name: "navigationOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
