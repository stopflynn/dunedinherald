import type { Article, PortableTextBlock } from "./types";

const fallbackArticles: Article[] = [
  {
    title: "‘Terrified’ bakery owner trying to nail pie recipe before Kosmos rates it",
    slug: "terrified-bakery-kosmos",
    excerpt: "A North Dunedin baker says the pressure is mounting as the city's most feared pie critic approaches the display cabinet.",
    category: "Local",
    categorySlug: "local",
    author: "Dunedin Herald Editorial",
    publishedAt: "2026-08-03T08:12:00+12:00",
    displayDate: "3 Aug 2026",
    time: "8:12 AM",
    image: "/news/bakery-kosmos.jpg",
    imageAlt: "Satirical graphic of a man eating a pie in front of a wall of pies",
    imageCaption: "The assessment criteria remain closely guarded. Image: Dunedin Herald / Instagram",
    featured: true,
    body: [
      "A North Dunedin bakery owner has entered what staff are calling “the final, terrifying phase” of pie development after learning that Kosmos may visit at any moment.",
      "The owner said the mince-to-gravy ratio had been recalculated six times since breakfast and that one apprentice had been assigned to watch the footpath for any sign of a black bucket hat.",
      { _type: "block", style: "blockquote", children: [{ text: "I just really want it to be good for him. That is all any baker in this city wants." }] },
      "Emergency pastry consultations are expected to continue until the rating is posted, deleted, reposted with different punctuation, and discussed by everyone in the comments.",
    ],
  },
  {
    title: "Citizens allowed to use force on ‘little shit’ politicians under new policy",
    slug: "reasonable-force-little-shit-politicians",
    excerpt: "A carefully costed policy has defined reasonable force as anything that can be explained before morning tea.",
    category: "Politics",
    categorySlug: "politics",
    author: "Dunedin Herald Editorial",
    publishedAt: "2026-08-03T07:41:00+12:00",
    displayDate: "3 Aug 2026",
    time: "7:41 AM",
    image: "/news/reasonable-force.jpg",
    imageAlt: "Satirical political graphic at a party event",
    imageCaption: "The proposed policy launch was described as hands-on. Image: Dunedin Herald / Instagram",
    body: [
      "A new policy unveiled this morning would permit members of the public to use “reasonable force” on politicians who are, after an independent assessment, found to be acting like little shits.",
      "Officials stressed that the process would contain robust safeguards, including a laminated flow chart and one person asking whether everyone had considered simply calming down.",
      "The definition of reasonable remains under consultation, although early drafts reportedly include a firm clip around the ears and being made to explain the fiscal implications of their own press release.",
    ],
  },
  {
    title: "New report recommends two pies and a V for every student body",
    slug: "two-pies-and-a-v",
    excerpt: "Researchers say the balanced meal provides all three essential food groups: pastry, taurine and a feeling of consequence.",
    category: "Student life",
    categorySlug: "campus",
    author: "Dunedin Herald Editorial",
    publishedAt: "2026-08-01T16:25:00+12:00",
    displayDate: "1 Aug 2026",
    time: "4:25 PM",
    image: "/news/pies-and-v.jpg",
    imageAlt: "Satirical student nutrition graphic",
    imageCaption: "A meal plan designed for academic excellence, or at least consciousness. Image: Dunedin Herald / Instagram",
    body: [
      "A landmark nutrition report has concluded that Dunedin students perform best on a strict daily programme of two pies and a V, administered whenever the line at the campus café is shortest.",
      "The authors found the programme improved alertness, confidence and the ability to call a 9am lecture “basically the middle of the night”.",
      "The university has welcomed the findings and is considering a pilot scheme in which tuition fees can be paid entirely in blue V cans.",
    ],
  },
  {
    title: "Billionaire CEOs urge workers to maximise output by taking no breaks",
    slug: "billionaires-no-breaks",
    excerpt: "The advice was delivered from a yacht during a short wellness sabbatical in the Mediterranean.",
    category: "National",
    categorySlug: "national",
    author: "Dunedin Herald Editorial",
    publishedAt: "2026-07-31T14:10:00+12:00",
    displayDate: "31 Jul 2026",
    time: "2:10 PM",
    image: "/news/no-breaks.jpg",
    imageAlt: "Satirical graphic of a billionaire giving workplace advice",
    imageCaption: "The productivity summit paused for three catered lunches. Image: Dunedin Herald / Instagram",
    body: [
      "A coalition of billionaire chief executives has advised workers to stop taking breaks, drinking water and experiencing the passage of time if they are serious about improving productivity.",
      "The statement was recorded in advance because the coalition is currently unavailable during a three-month strategic rest period.",
      "One spokesperson said employees should learn to treat every weekend as “a Monday with fewer meetings” and every holiday as “an exciting off-site keyboard opportunity”.",
    ],
  },
  {
    title: "Prime Minister defends helicopter trip to dairy for pie",
    slug: "helicopter-trip-for-pie",
    excerpt: "Officials say the flight was essential government business because somebody had already preheated the pie warmer.",
    category: "Politics",
    categorySlug: "politics",
    author: "Dunedin Herald Editorial",
    publishedAt: "2026-07-30T12:33:00+12:00",
    displayDate: "30 Jul 2026",
    time: "12:33 PM",
    image: "/news/helicopter-pie.jpg",
    imageAlt: "Satirical political graphic about a helicopter trip for a pie",
    imageCaption: "Cabinet papers describe the mince and cheese as time-sensitive. Image: Dunedin Herald / Instagram",
    body: [
      "The Prime Minister has defended using a government helicopter for a trip to the dairy, saying the mission was urgent, appropriate and undertaken in the national interest of getting a pie while it was still hot.",
      "A spokesperson said road travel would have exposed the delegation to unacceptable risks including traffic lights, small talk and the possibility that somebody else bought the last mince and cheese.",
      "The flight has been referred to the Auditor-General, who is understood to be checking whether the pie was correctly declared as a coalition expense.",
    ],
  },
  {
    title: "Campus Watch targets sick students in bold new health initiative",
    slug: "campus-watch-health-initiative",
    excerpt: "The programme aims to improve wellbeing by making unwell students slightly faster over short distances.",
    category: "Student life",
    categorySlug: "campus",
    author: "Dunedin Herald Editorial",
    publishedAt: "2026-07-30T09:02:00+12:00",
    displayDate: "30 Jul 2026",
    time: "9:02 AM",
    image: "/news/campus-watch.jpg",
    imageAlt: "Satirical graphic about campus health",
    imageCaption: "Students are advised to remain hydrated and difficult to identify. Image: Dunedin Herald / Instagram",
    body: [
      "Campus Watch has announced a comprehensive student health initiative focused on identifying anyone who looks slightly pale and following them at a motivational distance.",
      "The programme combines traditional wellness advice with flashing lights and the healing knowledge that somebody in a high-visibility vest knows exactly where you are.",
      "Students experiencing symptoms have been advised to rest, drink fluids and avoid travelling in a group of fewer than twelve.",
    ],
  },
];

type SanityResult = Omit<
  Article,
  "displayDate" | "time" | "image"
> & {
  image?: string;
};

const articleQuery = `*[_type == "article" && !(_id in path("drafts.**"))] | order(featured desc, publishedAt desc) {
  title,
  "slug": slug.current,
  excerpt,
  "category": category->title,
  "categorySlug": category->slug.current,
  author,
  publishedAt,
  "image": heroImage.asset->url,
  "imageAlt": heroImage.alt,
  "imageCaption": heroImage.caption,
  featured,
  body,
  instagramPostUrl,
}`;

function formatArticle(article: SanityResult): Article {
  const date = new Date(article.publishedAt);

  return {
    ...article,
    category: article.category || "Uncategorised",
    categorySlug: article.categorySlug || "uncategorised",
    image: article.image || "/news/bakery-kosmos.jpg",
    imageAlt:
      article.imageAlt || "Dunedin Herald story image",

    displayDate: new Intl.DateTimeFormat("en-NZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Pacific/Auckland",
    }).format(date),

    time: new Intl.DateTimeFormat("en-NZ", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Pacific/Auckland",
    }).format(date),
    instagramPostUrl: article.instagramPostUrl || "https://www.instagram.com/dunedinherald/",
  };
}

export type SiteSettings = {
  taglineRight: string;
  taglineLeft: string;
  instagramUrl: string;
  contactEmail: string;
  footerText: string;
  heroCategory?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  lowBannerText?: string;
  lowBannerTitle?: string;
  lowBannerEyebrow?: string;
  lowBannerVisibility?: boolean;
  passwordProtectionEnabled?: boolean;
};

const defaultSiteSettings: SiteSettings = {
  taglineRight: "Ōtepoti's least reliable",
  taglineLeft: "Critic's critic",
  instagramUrl: "https://www.instagram.com/dunedinherald/",
  contactEmail: "editor@dunedinherald.com",
  footerText:
    "The Dunedin Herald is a satirical publication. All content is parody and not intended to be taken as fact.",
  passwordProtectionEnabled: false,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  const apiVersion = process.env.SANITY_API_VERSION || "2026-08-01";
  const token = process.env.SANITY_READ_TOKEN;

  if (!projectId) return defaultSiteSettings;

  const query = `*[
    _type == "siteSettings" &&
    !(_id in path("drafts.**"))
  ][0] {
    taglineRight,
    taglineLeft,
    instagramUrl,
    contactEmail,
    footerText,
    "heroCategory": heroCategory->slug.current,
    heroEyebrow,
    heroTitle,
    lowBannerText,
    lowBannerTitle,
    lowBannerEyebrow,
    lowBannerVisibility,
    passwordProtectionEnabled,
  }`;

  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  );

  url.searchParams.set("query", query);

  try {
    const response = await fetch(url, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
      next: { revalidate: 60 },
    });

    if (!response.ok) return defaultSiteSettings;

    const data = (await response.json()) as {
      result?: Partial<SiteSettings>;
    };

    return {
      ...defaultSiteSettings,
      ...data.result,
    };
  } catch {
    return defaultSiteSettings;
  }
}

async function fetchSanityArticles(): Promise<Article[] | null> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  const apiVersion = process.env.SANITY_API_VERSION || "2026-08-01";
  if (!projectId) return null;

  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", articleQuery);
  const token = process.env.SANITY_READ_TOKEN;

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { result?: SanityResult[] };
    if (!data.result?.length) return [];
    return data.result.map(formatArticle);
  } catch {
    return [];
  }
}

export async function getArticles(): Promise<Article[]> {
  return (await fetchSanityArticles()) ?? fallbackArticles;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((article) => article.categorySlug === slug);
}

export type AboutPage = {
  eyebrow: string;
  heading: string;
  standfirst: string;
  body: Array<string | PortableTextBlock>;
};

export async function getAboutPage(): Promise<AboutPage> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  const apiVersion = process.env.SANITY_API_VERSION || "2026-08-01";
  if (!projectId) return {
    eyebrow: "About this questionable institution",
    heading: "News, without the burden of accuracy.",
    standfirst: "",
    body: [],
  };

  const query = `*[_type == "aboutPage" && !(_id in path("drafts.**"))][0] {
    eyebrow,
    heading,
    standfirst,
    body
  }`;

  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", query);
  const token = process.env.SANITY_READ_TOKEN;

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: 60 },
    });
    if (!response.ok) return {
      eyebrow: "About this questionable institution",
      heading: "News, without the burden of accuracy.",
      standfirst: "",
      body: [],
    };
    const data = (await response.json()) as { result?: AboutPage };
    return data.result ?? {
      eyebrow: "About this questionable institution",
      heading: "News, without the burden of accuracy.",
      standfirst: "",
      body: [],
    };
  } catch {
    return {
      eyebrow: "About this questionable institution",
      heading: "News, without the burden of accuracy.",
      standfirst: "",
      body: [],
    };
  }
}

export type Category = {
  title: string;
  slug: string;
};

const categoryQuery = `*[
  _type == "category" &&
  showInNavigation == true &&
  !(_id in path("drafts.**"))
] | order(order asc) {
  title,
  "slug": slug.current
}`;

export async function getCategories(): Promise<Category[]> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  const apiVersion =
    process.env.SANITY_API_VERSION || "2026-08-01";
  const token = process.env.SANITY_READ_TOKEN;

  if (!projectId) return [];

  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  );

  url.searchParams.set("query", categoryQuery);

  try {
    const response = await fetch(url, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as {
      result?: Category[];
    };

    return data.result ?? [];
  } catch {
    return [];
  }
}
