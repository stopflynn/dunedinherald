import type { StructureResolver } from "sanity/structure";

export const newsroomStructure: StructureResolver = (S) =>
  S.list()
    .title("Newsroom")
    .items([
      S.listItem()
        .title("Articles")
        .schemaType("article")
        .child(S.documentTypeList("article").title("Articles")),
      S.divider(),
      S.listItem()
        .title("About page")
        .id("aboutPage")
        .child(
          S.document()
            .schemaType("aboutPage")
            .documentId("aboutPage")),
      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .defaultOrdering([
              { field: "order", direction: "asc" },
            ]),
        ),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
