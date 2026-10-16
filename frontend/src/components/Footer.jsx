import swasthgramLogo from "../assets/SwasthgramWhite.png";
import appStoreBadge from "../assets/app_store.png";
import playStoreBadge from "../assets/play_store.png";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .sans { font-family: 'Inter', -apple-system, sans-serif; }
        .footer-link:hover { color: #fff !important; }
        .footer-prog:hover { color: #fff !important; }
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }
        .social-icon:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }
        .store-badge {
          display: inline-block;
          transition: opacity 0.2s, transform 0.2s;
        }
        .store-badge:hover {
          opacity: 0.85;
          transform: translateY(-2px);
        }
        @media (max-width: 1000px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr !important; text-align: left !important; }
          .footer-bottom { flex-direction: column !important; align-items: flex-start !important; text-align: left !important; }
        }
      `}</style>

      <footer
        style={{
          background: "#1A1A1A",
          padding: "48px 24px 24px",
          color: "rgba(255, 255, 255, 0.6)",
        }}
      >
        <div
          className="footer-grid"
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 0.9fr 0.9fr 1fr 1.2fr",
            gap: 28,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 14 }}>
              <img
                src={swasthgramLogo}
                alt="Swasthgram"
                style={{ height: 44, width: "auto", objectFit: "contain" }}
              />
            </div>
            <p
              className="sans"
              style={{ fontSize: 12, lineHeight: 1.7, maxWidth: 320, marginBottom: 16 }}
            >
              "Swasthgram Global Foundation is a registered 501(c)(3) non-profit organization in the USA and a 12A/80G certified trust in India. Contributions are tax-deductible to the extent allowed by law.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: 8 }}>
              <a href="https://www.facebook.com/SwasthGram" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/swasthgram" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://x.com/SwasthGram" target="_blank" rel="noopener noreferrer" className="social-icon" title="X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/swasthgram" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@SwasthGram" target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1A1A1A"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4
              className="sans"
              style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: 1.5, color: "rgba(255,255,255,0.3)", marginBottom: 12,
              }}
            >
              Programs
            </h4>
            {[
              { name: "SwasthManthan", href: "/programs/swasthmanthan" },
              { name: "Saksham", href: "/programs/saksham" },
              { name: "Shudhvayu", href: "/programs/shudhvayu" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="footer-prog sans"
                style={{
                  display: "block", fontSize: 12, marginBottom: 8,
                  color: "rgba(255,255,255,0.6)", textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4
              className="sans"
              style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: 1.5, color: "rgba(255,255,255,0.3)", marginBottom: 12,
              }}
            >
              Contact
            </h4>
            <a href="mailto:support@swasthgram.org" className="footer-link sans"
              style={{ display: "block", fontSize: 12, marginBottom: 6, color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.2s" }}>
              support@swasthgram.org
            </a>
            <a href="tel:+918527895900" className="footer-link sans"
              style={{ display: "block", fontSize: 12, marginBottom: 6, color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.2s" }}>
              +91 85278-95900
            </a>
            <a href="tel:+12024718287" className="footer-link sans"
              style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.2s" }}>
              +1-202-471-8287
            </a>
          </div>

          {/* Offices */}
          <div>
            <h4
              className="sans"
              style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: 1.5, color: "rgba(255,255,255,0.3)", marginBottom: 12,
              }}
            >
              Offices
            </h4>
            <p className="sans" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>
              Ground Floor, 424-CMR Building, Ghitorni, New Delhi
            </p>
            <p className="sans" style={{ fontSize: 12, lineHeight: 1.5 }}>
              78 - Union Avenue, Edison, NJ-08821, USA
            </p>
          </div>

          {/* Get the App */}
          <div>
            <h4
              className="sans"
              style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: 1.5, color: "rgba(255,255,255,0.3)", marginBottom: 12,
              }}
            >
              Get the App
            </h4>
            <p className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12, lineHeight: 1.5 }}>
              Download our app
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a
                href="https://apps.apple.com/in/app/swasthgram/id6746193769"
                target="_blank"
                rel="noopener noreferrer"
                className="store-badge"
              >
                <img
                  src={appStoreBadge}
                  alt="Download on the App Store"
                  style={{ height: 34, display: "block", objectFit: "contain" }}
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.app.swasthgram"
                target="_blank"
                rel="noopener noreferrer"
                className="store-badge"
              >
                <img
                  src={playStoreBadge}
                  alt="Get it on Google Play"
                  style={{ height: 34, display: "block", objectFit: "contain" }}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            maxWidth: 1080, margin: "32px auto 0", paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 10,
          }}
        >
          <span className="sans" style={{ fontSize: 11 }}>
            © 2026 Swasthgram Global Foundation. All rights reserved.
          </span>
          <div className="sans" style={{ display: "flex", gap: 16, fontSize: 11 }}>
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
              { label: "Refund Policy", href: "/refund-policy" },
              { label: "FAQs", href: "/faqs" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-link"
                style={{
                  color: "rgba(255,255,255,0.4)", textDecoration: "none",
                  transition: "color 0.2s", cursor: "pointer",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}