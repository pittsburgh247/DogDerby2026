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
        <a className="brand" href="#top">🐾 {SITE_DATA.event.name}</a>
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
      <h1>{SITE_DATA.event.name}</h1>
      <p className="tagline">{SITE_DATA.event.tagline}</p>
      <div className="hero-meta">
        <span>{SITE_DATA.event.date}</span>
        <span className="dot">•</span>
        <span>{SITE_DATA.event.location}</span>
      </div>
    </header>
  );
}

function SponsorTier({ tier }) {
  return (
    <div className="sponsor-tier">
      <h3>
        {tier.tier}
        {tier.amount && <span className="tier-amount"> — {tier.amount}</span>}
      </h3>
      <div className="sponsor-grid">
        {tier.sponsors.map((s) => (
          <div className="sponsor-card" key={s.name}>
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function Sponsors() {
  return (
    <section id="sponsors" className="section">
      <h2>Our Sponsors</h2>
      <p className="section-intro">
        Dog Derby 2026 wouldn't be possible without the generosity of these local businesses.
      </p>
      {SITE_DATA.sponsorTiers.map((tier) => (
        <SponsorTier tier={tier} key={tier.tier} />
      ))}
    </section>
  );
}

function VendorCard({ vendor }) {
  return (
    <div className="vendor-card">
      <div className="vendor-card-header">
        <h4>{vendor.name}</h4>
        <span className="category-badge">{vendor.category}</span>
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
        {SITE_DATA.rescuePartners.map((name) => (
          <div className="rescue-card" key={name}>
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>Interested in becoming a sponsor or vendor next year? Reach out — we'd love to have you.</p>
      <p className="footer-small">🐾 {SITE_DATA.event.name}</p>
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
