import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAboutPage } from "@/lib/content";

export const metadata = { title: "About & disclaimer" };

export default async function AboutPage() {
  const aboutPage = await getAboutPage();

  return (
    <>
      <Header />
      <main id="main-content" className="about-page">
        <p className="eyebrow">{aboutPage.eyebrow}</p>
        <h1>{aboutPage.heading}</h1>
        <p className="standfirst">{aboutPage.standfirst}</p>
        <div className="body">
          {aboutPage.body.map((block, index) => {
            if (typeof block === "string") return <p key={index}>{block}</p>;

            const text = block.children?.map((child) => child.text || "").join("") || "";
            if (!text) return null;

            switch (block.style) {
              case "h2":
                return <h2 key={block._key || index}>{text}</h2>;
              case "blockquote":
                return <blockquote key={block._key || index}>{text}</blockquote>;
              default:
                return <p key={block._key || index}>{text}</p>;
            }
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
