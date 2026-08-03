import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoryCard } from "@/components/StoryCard";
import {
  getArticles,
  getSiteSettings,
} from "@/lib/content";

export default async function Home() {
  const siteSettings = await getSiteSettings();
  const articles = await getArticles();
  const [lead, ...rest] = articles;
  const supporting = rest.slice(0, 2);
  const latest = rest.slice(2, 7);
  const heroTitle = siteSettings.heroTitle?.trim();
  const heroCategory = siteSettings.heroCategory?.trim();
  const heroEyebrow = siteSettings.heroEyebrow?.trim();
  const heroArticles = heroCategory
    ? articles.filter((article) => article.categorySlug === heroCategory).slice(0, 3)
    : [];

  return (
    <>
      <Header />
      <main id="main-content">
        <div className="edition-line shell">
          <p>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Ōtepoti edition</p>
        </div>

        {lead ? (
          <>
            <section className="lead-layout shell" aria-labelledby="top-stories">
              <h1 id="top-stories" className="sr-only">Top stories</h1>
            <article className="lead-story">
              <Link href={`/story/${lead.slug}`} className="lead-image-wrap">
                <img src={lead.image} alt={lead.imageAlt} className="lead-image" />
              </Link>
              <div className="lead-copy">
                <Link href={`/category/${lead.categorySlug}`} className="kicker">
                  {lead.category}
                </Link>
                <h2><Link href={`/story/${lead.slug}`}>{lead.title}</Link></h2>
                <p className="dek">{lead.excerpt}</p>
                <p className="byline">By {lead.author} <span aria-hidden="true">•</span> {lead.displayDate}</p>
              </div>
            </article>

              <div className="supporting-stories">
                {supporting.map((article) => (
                  <StoryCard key={article.slug} article={article} variant="compact" />
                ))}
              </div>

              <aside className="just-in" aria-labelledby="just-in-title">
                <div className="section-heading small-heading">
                  <h2 id="just-in-title">Just in</h2>
                </div>
                <ol>
                  {latest.map((article, index) => (
                    <li key={article.slug}>
                      <span className="latest-number">{index + 1}</span>
                      <div>
                        <Link href={`/category/${article.categorySlug}`} className="mini-kicker">
                          {article.category}
                        </Link>
                        <h3><Link href={`/story/${article.slug}`}>{article.title}</Link></h3>
                        <time dateTime={article.publishedAt}>{article.time}</time>
                      </div>
                    </li>
                  ))}
                </ol>
              </aside>
            </section>

            {heroTitle && heroCategory && (
              <section className="news-section shell" aria-labelledby="hero-section-title">
                <div className="section-heading">
                  <div>
                    {heroEyebrow && <p className="eyebrow">{heroEyebrow}</p>}
                    <h2 id="hero-section-title">{heroTitle}</h2>
                  </div>
                  <Link href={`/category/${heroCategory}`}>More stories <span aria-hidden="true">→</span></Link>
                </div>
                <div className="story-grid">
                  {heroArticles.map((article) => (
                    <StoryCard key={article.slug} article={article} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="empty-state shell" aria-labelledby="empty-newsroom-title">
            <p className="eyebrow">Newsroom notice</p>
            <h1 id="empty-newsroom-title">The presses are warming up.</h1>
            <p>No stories have been published yet. In the meantime, please remain appropriately suspicious.</p>
          </section>
        )}

        {siteSettings.lowBannerVisibility && (
        <section className="dispatch shell" aria-labelledby="dispatch-title">
          <div className="dispatch-mark" aria-hidden="true">D</div>
          <div>
            <p className="eyebrow">{siteSettings.lowBannerEyebrow}</p>
            <h2 id="dispatch-title">{siteSettings.lowBannerTitle}</h2>
            <p>{siteSettings.lowBannerText}</p>
          </div>
          <a className="button gold-button" href="https://www.instagram.com/dunedinherald/" target="_blank" rel="noreferrer">
            Follow on Instagram
          </a>
        </section>
        )}
      </main>
      <Footer />
    </>
  );
}
