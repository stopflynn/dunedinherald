import Link from "next/link";

const nav = [
  ["Local", "/category/local"],
  ["Politics", "/category/politics"],
  ["National", "/category/national"],
  ["Student life", "/category/campus"],
  ["Sport", "/category/sport"],
  ["Weather", "/category/weather"],
];

export function Header() {
  return (
    <header>
      <a className="skip-link" href="#main-content">Skip to stories</a>
      <div className="utility-bar">
        <div className="utility-inner shell">
          <span>Critic&apos;s critic <span className="live-dot" /> live-ish updates</span>
          <span>Ōtepoti&apos;s least reliable</span>
        </div>
      </div>
      <div className="masthead">
        <div className="masthead-inner shell">
          <div className="masthead-tools">
            <details className="mobile-menu">
              <summary aria-label="Open menu"><span className="tool-circle">☰</span></summary>
              <nav className="mobile-menu-panel" aria-label="Mobile navigation">
                <Link href="/">Home</Link>
                {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
                <Link href="/about">About</Link>
              </nav>
            </details>
            <Link className="tool-link" href="/about"><span className="tool-circle">☰</span><span className="tool-label">Menu</span></Link>
            <Link className="tool-link" href="/search"><span className="tool-circle">⌕</span><span className="tool-label">Search</span></Link>
          </div>
          <Link href="/" className="wordmark" aria-label="The Dunedin Herald home">
            <img className="brand-mark" src="/brand-mark.jpg" alt="" />
            <span className="wordmark-text">The Dunedin Herald</span>
          </Link>
          <a className="masthead-cta" href="https://www.instagram.com/dunedinherald/" target="_blank" rel="noreferrer">
            <span>Follow</span> ★
          </a>
        </div>
      </div>
      <nav className="primary-nav" aria-label="Primary navigation">
        <div className="nav-inner shell">
          <Link href="/">Home</Link>
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
      </nav>
      <div className="ticker" aria-label="Satire disclaimer">
        <div className="ticker-track">
          <span>Alternative truths</span>
          <span>Parody, not reporting</span>
          <span>No paywall because no one asked</span>
          <span>Dunedin, allegedly</span>
        </div>
      </div>
    </header>
  );
}
