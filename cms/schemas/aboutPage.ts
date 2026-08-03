import {
  defineArrayMember,
  defineField,
  defineType,
} from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",

  fields: [
    defineField({
      name: "eyebrow",
      title: "Small heading",
      type: "string",
      initialValue: "About this questionable institution",
    }),

    defineField({
      name: "heading",
      title: "Main heading",
      type: "string",
      initialValue: "News, without the burden of accuracy.",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "standfirst",
      title: "Introduction",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "body",
      title: "Page content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Quote", value: "blockquote" },
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      heading: "heading",
    },

    prepare({ heading }) {
      return {
        title: "About page",
        subtitle: heading || "About-page content",
      };
    },
  },
});
