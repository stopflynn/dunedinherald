import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid shell">
        <div>
          <Link href="/" className="footer-brand">
            <img src="/brand-mark.jpg" alt="" />
            <span>The Dunedin Herald</span>
          </Link>
          <p className="footer-copy">Independent satire from Ōtepoti. If a story seems unbelievable, that is because we wrote it. If it seems believable, that is somebody else&apos;s problem.</p>
        </div>
        <div>
          <h2>Sections</h2>
          <ul className="footer-links">
            <li><Link href="/category/local">Local</Link></li>
            <li><Link href="/category/politics">Politics</Link></li>
            <li><Link href="/category/campus">Student life</Link></li>
            <li><Link href="/search">Search</Link></li>
          </ul>
        </div>
        <div>
          <h2>The fine print</h2>
          <ul className="footer-links">
            <li><Link href="/about">About &amp; disclaimer</Link></li>
            <li><a href="https://www.instagram.com/dunedinherald/" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="mailto:editor@dunedinherald.com">Contact the editor</a></li>
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
