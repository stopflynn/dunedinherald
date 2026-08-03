import Link from "next/link";
import {
  getSiteSettings,
  getCategories,
} from "@/lib/content";

export async function Footer() {
  const siteSettings = await getSiteSettings();
  const categories = await getCategories();
  return (
    <footer className="site-footer">
      <div className="footer-grid shell">
        <div>
          <Link href="/" className="footer-brand">
            <img src="/brand-mark.jpg" alt="" />
            <span>The Dunedin Herald</span>
          </Link>
          <p className="footer-copy">{siteSettings.footerText}</p>
        </div>
        <div>
          <h2>Sections</h2>
          <ul className="footer-links">
            {categories.slice(0, 3).map((category) => (
              <li key={category.slug}>
                <Link href={`/category/${category.slug}`}>{category.title}</Link>
              </li>
            ))}
            <li><Link href="/search">Search</Link></li>
          </ul>
        </div>
        <div>
          <h2>Other Stuff</h2>
          <ul className="footer-links">
            <li><Link href="/about">About</Link></li>
            <li><a href={siteSettings.instagramUrl} target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href={`mailto:${siteSettings.contactEmail}`}>Get in touch</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom shell">
        <p>© 2026 The Dunedin Herald</p>
        <p>Satire / parody — not affiliated with NZ Herald or NZME.</p>
      </div>
    </footer>
  );
}
