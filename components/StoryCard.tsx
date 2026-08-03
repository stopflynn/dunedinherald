import Link from "next/link";
import type { Article } from "@/lib/types";

export function StoryCard({ article, variant = "standard" }: { article: Article; variant?: "standard" | "compact" }) {
  return (
    <article className={`story-card ${variant}`}>
      <Link href={`/story/${article.slug}`} className="story-card-image">
        <img src={article.image} alt={article.imageAlt} loading="lazy" />
      </Link>
      <Link href={`/category/${article.categorySlug}`} className="kicker">{article.category}</Link>
      <h3><Link href={`/story/${article.slug}`}>{article.title}</Link></h3>
      {variant === "standard" && <p>{article.excerpt}</p>}
      <time dateTime={article.publishedAt}>{article.displayDate}</time>
    </article>
  );
}
