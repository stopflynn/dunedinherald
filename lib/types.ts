export type PortableTextChild = { _key?: string; text?: string; marks?: string[] };
export type PortableTextBlock = {
  _key?: string;
  _type?: string;
  style?: string;
  children?: PortableTextChild[];
};

export type Article = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  author: string;
  publishedAt: string;
  displayDate: string;
  time: string;
  image: string;
  imageAlt: string;
  imageCaption?: string;
  featured?: boolean;
  body: Array<string | PortableTextBlock>;
};
