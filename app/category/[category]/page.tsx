import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoryCard } from "@/components/StoryCard";
import { getArticlesByCategory } from "@/lib/content";

const labels: Record<string, string> = {
  local: "Local",
  politics: "Politics",
  national: "National",
  campus: "Student life",
  sport: "Sport",
  weather: "Weather",
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  return { title: labels[category] || "Stories" };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const articles = await getArticlesByCategory(category);
  const label = labels[category] || category.replace(/-/g, " ");
  return (
    <>
      <Header />
      <main id="main-content" className="archive shell">
        <header className="archive-header">
          <h1>{label}</h1>
          <p>Every story in this section, for better or worse.</p>
        </header>
        {articles.length ? (
          <div className="archive-list">
            {articles.map((article) => <StoryCard key={article.slug} article={article} />)}
          </div>
        ) : (
          <p className="empty-state">Nothing here yet. The newsroom is looking into it.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
