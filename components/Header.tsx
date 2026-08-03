import Link from "next/link";
import {
  getSiteSettings,
  getCategories,
  getArticles,
 } from "@/lib/content";

const TICKER_HEADLINE_COUNT = 6;

export async function Header() {
  const [siteSettings, categories, articles] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getArticles(),
  ]);

  const recentHeadlines = [...articles]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, TICKER_HEADLINE_COUNT);

  const tickerLoopHeadlines = recentHeadlines.length > 0
    ? Array.from(
        { length: Math.ceil(TICKER_HEADLINE_COUNT / recentHeadlines.length) },
        () => recentHeadlines,
      ).flat()
    : [];

  return (
    <header>
      <a className="skip-link" href="#main-content">Skip to stories</a>
      <div className="utility-bar">
        <div className="utility-inner shell">
          <span>{siteSettings.taglineLeft}</span>
          <span>{siteSettings.taglineRight}</span>
        </div>
      </div>
      <div className="masthead">
        <div className="masthead-inner shell">
          <div className="masthead-tools">
            <details className="mobile-menu">
              <summary aria-label="Open menu"><span className="tool-circle">☰</span></summary>
              <nav className="mobile-menu-panel" aria-label="Mobile navigation">
                <Link href="/">Home</Link>
                <Link href="/search">Search</Link>
                {categories.map((category) => (
                  <Link key={category.slug} href={`/category/${category.slug}`}>
                    {category.title}
                  </Link>
                ))}
                <Link href="/about">About</Link>
              </nav>
            </details>
            <Link className="tool-link" href="/search"><span className="tool-circle">⌕</span><span className="tool-label">Search</span></Link>
          </div>
          <Link href="/" className="wordmark" aria-label="The Dunedin Herald home">
            <img className="brand-mark" src="/brand-mark.jpg" alt="" />
            <span className="wordmark-text">The Dunedin Herald</span>
          </Link>
          <a className="masthead-cta" href={siteSettings.instagramUrl} target="_blank" rel="noreferrer">
           ★ <span>Instagram</span> ★
          </a>
        </div>
      </div>
      <nav className="primary-nav" aria-label="Primary navigation">
        <div className="nav-inner shell">
          <Link href="/">Home</Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              {category.title}
            </Link>
          ))}
        </div>
      </nav>
      {recentHeadlines.length > 0 && (
        <div className="ticker" aria-label="Latest headlines">
          <div className="ticker-track">
            {[0, 1].map((copyIndex) => (
              <div
                className="ticker-run"
                key={copyIndex}
                aria-hidden={copyIndex === 1 ? true : undefined}
              >
                {tickerLoopHeadlines.map((article, headlineIndex) => (
                  copyIndex === 0 ? (
                    <Link
                      className="ticker-item"
                      href={`/story/${article.slug}`}
                      key={`${article.slug}-${headlineIndex}`}
                    >
                      {article.title}
                    </Link>
                  ) : (
                    <span className="ticker-item" key={`${article.slug}-${headlineIndex}`}>
                      {article.title}
                    </span>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
