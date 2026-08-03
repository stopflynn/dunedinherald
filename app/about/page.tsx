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
            if (block._type === "block") {
              switch (block.style) {
                case "h2":
                  return <h2 key={index}>{block.children[0].text}</h2>;
                case "blockquote":
                  return <blockquote key={index}>{block.children[0].text}</blockquote>;
                default:
                  return <p key={index}>{block.children[0].text}</p>;
              }
            }
            return null;
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
