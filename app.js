const { useState, useMemo } = React;

function Nav() {
  const links = [
    ["#sponsors", "Sponsors"],
    ["#vendors", "Vendors"],
    ["#raffle", "Raffle"],
    ["#rescues", "Rescue Partners"],
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="brand" href="#top">
          {SITE_DATA.event.name}
        </a>
        <div className="nav-links">
          {links.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero" id="top">
      <img
        src="assets/hero-presented-banner.png"
        alt="Say It Once Dog Derby 2026 — Presented by Stanley Steemer"
        className="hero-presented-banner"
      />
      <div className="hero-meta">
        <span>{SITE_DATA.event.date}</span>
        <span className="dot">•</span>
        <span>{SITE_DATA.event.location}</span>
      </div>
      <div className="hero-ctas">
        <a
          className="hero-cta hero-cta-primary"
          href={SITE_DATA.event.registerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Register for the Derby
        </a>
        <a
          className="hero-cta hero-cta-secondary"
          href={SITE_DATA.event.honorSponsorUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Sponsor a Dog in Honor or Memory
        </a>
      </div>
    </header>
  );
}

function SponsorCard({ sponsor }) {
  let logo;
  if (sponsor.showNameCaption) {
    logo = (
      <div className="sponsor-logo-wrap">
        <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo" />
        <span className="sponsor-caption">{sponsor.name}</span>
      </div>
    );
  } else if (sponsor.logo) {
    logo = <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo" />;
  } else {
    logo = <span className="sponsor-name">{sponsor.name}</span>;
  }

  const content = sponsor.hasTent ? (
    <div className="sponsor-tent-content">
      {logo}
      <span className="tent-badge">📍 Visit our tent!</span>
      {sponsor.offering && <p className="sponsor-offering">{sponsor.offering}</p>}
    </div>
  ) : (
    logo
  );

  const cardClass = `sponsor-card${sponsor.hasTent ? " sponsor-card-tent" : ""}`;
  const style = { "--accent": sponsor.accentColor || "#1b2a4a" };

  if (sponsor.website) {
    return (
      <a
        className={cardClass}
        style={style}
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={sponsor.name}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={cardClass} style={style}>
      {content}
    </div>
  );
}

function Sponsors() {
  return (
    <section id="sponsors" className="section">
      <div className="sponsors-heading">
        <span className="sponsors-eyebrow">With Gratitude</span>
        <h2>Our Sponsors</h2>
        <div className="sponsors-divider">
          <span className="dot-pink"></span>
          <span className="dot-yellow"></span>
          <span className="dot-sky"></span>
          <span className="dot-green"></span>
        </div>
        <p className="section-intro">
          A heartfelt thank-you to the incredible local businesses making Dog Derby 2026 possible.
        </p>
      </div>
      <div className="sponsor-grid">
        {SITE_DATA.sponsors.map((s) => (
          <SponsorCard sponsor={s} key={s.name} />
        ))}
      </div>
    </section>
  );
}

const BADGE_COLORS = ["badge-pink", "badge-sky", "badge-yellow", "badge-green"];

function badgeColorFor(category) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  return BADGE_COLORS[hash % BADGE_COLORS.length];
}

function VendorCard({ vendor }) {
  return (
    <div className="vendor-card">
      {vendor.logo &&
        (vendor.logoOnDark ? (
          <div className="vendor-logo-navy-wrap">
            <img src={vendor.logo} alt={vendor.name} className="vendor-logo" />
          </div>
        ) : (
          <img src={vendor.logo} alt={vendor.name} className="vendor-logo" />
        ))}
      <div className="vendor-card-header">
        <h4>{vendor.name}</h4>
        <span className={`category-badge ${badgeColorFor(vendor.category)}`}>{vendor.category}</span>
      </div>
      {vendor.description && <p className="vendor-desc">{vendor.description}</p>}
      {(vendor.website || vendor.instagram) && (
        <div className="vendor-links">
          {vendor.website && (
            <a href={vendor.website} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          )}
          {vendor.instagram && (
            <a
              href={`https://instagram.com/${vendor.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {vendor.instagram}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function Vendors() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(SITE_DATA.vendors.map((v) => v.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    return SITE_DATA.vendors.filter((v) => {
      const matchesCategory = activeCategory === "All" || v.category === activeCategory;
      const matchesQuery = v.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <section id="vendors" className="section">
      <h2>Vendors</h2>
      <p className="section-intro">
        Meet the vendors joining us this year — food, pet products, services, and more.
      </p>
      <div className="vendor-controls">
        <input
          type="text"
          placeholder="Search vendors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="vendor-grid">
        {filtered.map((v) => (
          <VendorCard vendor={v} key={v.name} />
        ))}
      </div>
      {filtered.length === 0 && <p className="empty-state">No vendors match your search.</p>}
    </section>
  );
}

function Raffle() {
  return (
    <section id="raffle" className="section">
      <h2>Raffle Items</h2>
      <p className="section-intro">
        A huge thank-you to everyone who donated a raffle item this year!
      </p>
      <div className="raffle-grid">
        {SITE_DATA.raffleItems.map((r, i) => (
          <div className="raffle-card" key={`${r.donor}-${i}`}>
            <div className="raffle-item">{r.item}</div>
            <div className="raffle-donor">donated by {r.donor}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RescuePartners() {
  return (
    <section id="rescues" className="section">
      <h2>Rescue Partners</h2>
      <p className="section-intro">
        Proceeds from Dog Derby 2026 support these rescue organizations.
      </p>
      <div className="rescue-grid">
        {SITE_DATA.rescuePartners.map((r) => (
          <div className="rescue-card" key={r.name}>
            {r.logo && <img src={r.logo} alt={r.name} className="rescue-logo" />}
            <span>{r.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <img src="assets/rescue-league-logo.png" alt="Say It Once Rescue League" className="footer-logo" />
      <p>Interested in becoming a sponsor or vendor next year? Reach out — we'd love to have you.</p>
      <p className="footer-small">All proceeds benefit the Say It Once Rescue League</p>
    </footer>
  );
}

function App() {
  return (
    <React.Fragment>
      <Nav />
      <Hero />
      <main>
        <Sponsors />
        <Vendors />
        <Raffle />
        <RescuePartners />
      </main>
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
