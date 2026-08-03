import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoryCard } from "@/components/StoryCard";
import { getArticles } from "@/lib/content";

export default async function Home() {
  const articles = await getArticles();
  const [lead, ...rest] = articles;
  const supporting = rest.slice(0, 2);
  const latest = rest.slice(2, 7);
  const more = rest.length > 5 ? rest.slice(5) : rest.slice(0, 3);

  return (
    <>
      <Header />
      <main id="main-content">
        <div className="edition-line shell">
          <p>Monday, 3 August 2026</p>
          <p>Ōtepoti edition</p>
        </div>

        <section className="lead-layout shell" aria-labelledby="top-stories">
          <h1 id="top-stories" className="sr-only">Top stories</h1>
          {lead && (
            <article className="lead-story">
              <Link href={`/story/${lead.slug}`} className="lead-image-wrap">
                <img src={lead.image} alt={lead.imageAlt} className="lead-image" />
                <span className="parody-stamp">Parody</span>
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
          )}

          <div className="supporting-stories">
            {supporting.map((article) => (
              <StoryCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>

          <aside className="just-in" aria-labelledby="just-in-title">
            <div className="section-heading small-heading">
              <h2 id="just-in-title">Just in</h2>
              <span>Mostly</span>
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

        <section className="news-section shell" aria-labelledby="otago-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The bottom of the South</p>
              <h2 id="otago-title">Otago &amp; beyond</h2>
            </div>
            <Link href="/category/local">All local stories <span aria-hidden="true">→</span></Link>
          </div>
          <div className="story-grid">
            {more.slice(0, 3).map((article) => (
              <StoryCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <section className="dispatch shell" aria-labelledby="dispatch-title">
          <div className="dispatch-mark" aria-hidden="true">D</div>
          <div>
            <p className="eyebrow">Free. Questionably useful.</p>
            <h2 id="dispatch-title">The Evening Misprint</h2>
            <p>Fresh alternative truths, sent when somebody remembers the password.</p>
          </div>
          <a className="button gold-button" href="https://www.instagram.com/dunedinherald/" target="_blank" rel="noreferrer">
            Follow on Instagram
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
