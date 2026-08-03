import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoryCard } from "@/components/StoryCard";
import { getArticles } from "@/lib/content";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const articles = await getArticles();
  const query = q.trim().toLowerCase();
  const results = query
    ? articles.filter((article) => `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query))
    : articles;

  return (
    <>
      <Header />
      <main id="main-content" className="archive shell">
        <header className="archive-header"><h1>Search</h1><p>Find the story you vaguely remember.</p></header>
        <form className="search-form-large" action="/search" method="get" role="search">
          <label className="sr-only" htmlFor="site-search">Search stories</label>
          <input id="site-search" name="q" defaultValue={q} placeholder="Try ‘pie’, ‘campus’ or ‘policy’" />
          <button type="submit">Search</button>
        </form>
        {query && <p>{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>}
        {results.length ? (
          <div className="archive-list">{results.map((article) => <StoryCard key={article.slug} article={article} />)}</div>
        ) : <p className="empty-state">No stories found. This may be the first thing we have not made up.</p>}
      </main>
      <Footer />
    </>
  );
}
