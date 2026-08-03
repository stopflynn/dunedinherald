import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getArticle } from "@/lib/content";
import type { PortableTextBlock } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Story not found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [article.image], type: "article" },
  };
}

function Block({ block }: { block: string | PortableTextBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  const text = block.children?.map((child) => child.text || "").join("") || "";
  if (!text) return null;
  if (block.style === "h2") return <h2>{text}</h2>;
  if (block.style === "blockquote") return <blockquote>{text}</blockquote>;
  return <p>{text}</p>;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <Header />
      <main id="main-content" className="article-shell">
        <header className="article-header">
          <Link className="kicker" href={`/category/${article.categorySlug}`}>{article.category}</Link>
          <h1>{article.title}</h1>
          <p className="article-dek">{article.excerpt}</p>
          <div className="article-meta">
            <span>By {article.author}</span>
            <time dateTime={article.publishedAt}>{article.displayDate} · {article.time}</time>
            <span>3 min read, generously estimated</span>
          </div>
        </header>

        <figure className="article-hero">
          <img src={article.image} alt={article.imageAlt} />
          {article.imageCaption && <figcaption>{article.imageCaption}</figcaption>}
        </figure>

        <div className="article-layout">
          <aside className="share-rail" aria-label="Share this story">
            <p>Share</p>
            <a className="share-cta" href={article.instagramPostUrl} target="_blank" rel="noreferrer">
              Open Instagram
            </a>
          </aside>
          <article className="article-body">
            {article.body.map((block, index) => <Block key={typeof block === "string" ? `${article.slug}-${index}` : block._key || index} block={block} />)}
            <p className="article-disclaimer"><strong>This is satire.</strong> The Dunedin Herald publishes parody, commentary and invented stories. It is not affiliated with NZ Herald, NZME, or any government department that has stopped returning our calls.</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
