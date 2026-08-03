import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = { title: "About & disclaimer" };

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="about-page">
        <p className="eyebrow">About this questionable institution</p>
        <h1>News, without the burden of accuracy.</h1>
        <p className="standfirst">The Dunedin Herald is an independent satire publication from Ōtepoti. We write parody about local life, politics, student culture and the recurring civic emergency known as George Street.</p>
        <h2>The serious disclaimer</h2>
        <p>Articles on this site are satire and parody. Unless explicitly marked otherwise, quotations, events and situations may be invented. Do not rely on this site as a factual news source. The Dunedin Herald is not affiliated with NZ Herald, NZME or other news organisations.</p>
        <p>Occasionally we discuss real people, organisations and events. The satirical framing should be clear, but if we have made a factual error in something presented as fact, contact <a href="mailto:editor@dunedinherald.com"><u>editor@dunedinherald.com</u></a>.</p>
        <h2>Images and corrections</h2>
        <p>Images should be owned, licensed or used with permission and credited in the CMS. Requests for correction, attribution or removal can be sent to the editor. We aim to respond before the heat death of the universe.</p>
      </main>
      <Footer />
    </>
  );
}
