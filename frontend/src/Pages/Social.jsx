import swasthgramLogo from "../assets/SwasthgramLogo.png";

const LINKS = [
  {
    platform: "Facebook",
    handle: "facebook.com/SwasthGram",
    href: "https://www.facebook.com/SwasthGram",
    bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    platform: "Instagram",
    handle: "@swasthgram",
    href: "https://www.instagram.com/swasthgram",
    bg: "linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.8"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
      </svg>
    ),
  },
  {
    platform: "YouTube",
    handle: "@SwasthGram",
    href: "https://www.youtube.com/@SwasthGram",
    bg: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    platform: "X (Twitter)",
    handle: "@SwasthGram",
    href: "https://x.com/SwasthGram",
    bg: "#000",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.638 5.903-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    platform: "LinkedIn",
    handle: "linkedin.com/company/swasthgram",
    href: "https://www.linkedin.com/company/swasthgram",
    bg: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

export default function LinksPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#FDFBF7", minHeight: "100vh", color: "#1F2937" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 130% 55% at 50% -5%, rgba(27,107,58,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 70% 40% at 90% 110%, rgba(200,150,62,0.07) 0%, transparent 55%);
          pointer-events: none;
          z-index: 0;
        }
        .link-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 15px 18px;
          background: #fff;
          border: 1px solid #E8E4DC;
          border-radius: 16px;
          text-decoration: none;
          color: #1F2937;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          position: relative;
          animation: fadeUp 0.4s ease both;
        }
        .link-card::after {
          content: '';
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231B6B3A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M12 5l7 7-7 7'/%3E%3C/svg%3E") center/contain no-repeat;
          opacity: 0.4;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .link-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(27,107,58,0.10);
          border-color: rgba(27,107,58,0.25);
        }
        .link-card:hover::after { opacity: 1; transform: translateY(-50%) translateX(3px); }
        .link-card:active { transform: translateY(0); box-shadow: none; }
        .link-card:nth-child(1) { animation-delay: 0.05s; }
        .link-card:nth-child(2) { animation-delay: 0.10s; }
        .link-card:nth-child(3) { animation-delay: 0.15s; }
        .link-card:nth-child(4) { animation-delay: 0.20s; }
        .link-card:nth-child(5) { animation-delay: 0.25s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeHeader {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "52px 0 36px", animation: "fadeHeader 0.5s ease both" }}>
          <div style={{
            width: 80, height: 80,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 22px",
          }}>
            <img src={swasthgramLogo} alt="Swasthgram" style={{ width: 80, height: 80, objectFit: "contain" }} />
          </div>

          <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 30, fontWeight: 700, color: "#1B6B3A", letterSpacing: -0.3, marginBottom: 5 }}>
            <span style={{ color: "#1F2937" }}>Swasth</span>gram
          </h1>
          <p style={{ fontSize: 12, color: "#6B7280", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 14 }}>
            Nation Building Through Empowerment
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 4 }}>
            {[
              { label: "12A Certified", color: "#1B6B3A", bg: "#e8f5ee" },
              { label: "80G Certified", color: "#1B6B3A", bg: "#e8f5ee" },
              { label: "501(c)(3) USA", color: "#1d4ed8", bg: "#eff6ff" },
            ].map((c, i) => (
              <div key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: c.bg, border: `1px solid ${c.color}30`,
                borderRadius: 20, padding: "4px 12px",
                fontSize: 11, color: c.color, fontWeight: 600,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, display: "inline-block" }} />
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 20px", color: "#6B7280", fontSize: 11, letterSpacing: "1.2px", textTransform: "uppercase" }}>
          <div style={{ flex: 1, height: 1, background: "#E8E4DC" }} />
          Follow Us
          <div style={{ flex: 1, height: 1, background: "#E8E4DC" }} />
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LINKS.map((link) => (
            <a key={link.platform} href={link.href} target="_blank" rel="noopener noreferrer" className="link-card">
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: link.bg,
              }}>
                {link.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 2 }}>{link.platform}</span>
                <span style={{ fontSize: 12, color: "#6B7280", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{link.handle}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 36, paddingTop: 24, borderTop: "1px solid #E8E4DC" }}>
          <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>
            © 2026 Swasthgram Global Foundation<br/>
            <a href="mailto:support@swasthgram.org" style={{ color: "#1B6B3A", fontWeight: 500, textDecoration: "none" }}>support@swasthgram.org</a>
          </p>
          <a href="https://swasthgram.org" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13, color: "#1B6B3A", fontWeight: 700, marginTop: 10, display: "block", opacity: 0.65, textDecoration: "none" }}>
            ← swasthgram.org
          </a>
        </div>

      </div>
    </div>
  );
}