import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoColor from "../assets/SwasthgramLogo.png";
import logoWhite from "../assets/SwasthgramWhite.png";


const COLORS = {
  forest: "#1B6B3A",
  forestDark: "#145A2F",
  text: "#1F2937",
  border: "#E8E4DC",
};

const programSubLinks = [
  { label: "SwasthManthan", href: "/programs/swasthmanthan" },
  { label: "Saksham", href: "/programs/saksham" },
  { label: "Shudhvayu", href: "/programs/shudhvayu" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [mobilePrograms, setMobilePrograms] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // If on home page, scroll to section. If on another page, go home first then scroll.
  const handleNavClick = (e, section) => {
    e.preventDefault();
    setMobileMenu(false);
    if (isHome) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Programs", section: "programs" },
    { label: "Impact", section: "impact" },
    { label: "App", section: "app" },
    { label: "Contact", section: "contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .sans { font-family: 'Inter', -apple-system, sans-serif; }
        .nav-link {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: color 0.2s;
          padding: 4px 0;
          cursor: pointer;
          background: none;
          border: none;
        }
        .nav-link:hover { color: ${COLORS.forest}; }
        .programs-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .programs-wrapper::after {
          content: '';
          position: absolute;
          top: 100%;
          left: -10px;
          right: -10px;
          height: 20px;
        }
        .programs-dropdown {
          position: absolute;
          top: calc(100% + 20px);
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border: 1px solid ${COLORS.border};
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          min-width: 168px;
          padding: 6px 0;
          z-index: 1000;
          animation: fadeDown 0.15s ease;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .programs-dropdown a {
          display: block;
          padding: 9px 18px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: ${COLORS.text};
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .programs-dropdown a:hover {
          background: #f5f3ef;
          color: ${COLORS.forest};
        }
        .btn-donate {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 12px;
          background: ${COLORS.forest};
          color: #fff;
          border: none;
          padding: 9px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-donate:hover {
          background: ${COLORS.forestDark};
          transform: translateY(-1px);
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-toggle { display: none !important; }
          .mobile-dropdown { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 999,
        overflow: "visible",
        background: scrolled ? "rgba(253, 251, 247, 0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "none",
        transition: "all 0.3s",
        padding: scrolled ? "8px 0" : "14px 0",
      }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          overflow: "visible",
        }}>

          <a href="/" onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img
              src={scrolled ? logoColor : logoWhite}
              alt="Swasthgram"
              style={{
                height: scrolled ? 36 : 42,
                width: "auto",
                display: "block",
                transition: "height 0.3s",
              }}
            />
            <span style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: -0.5,
              color: scrolled ? COLORS.text : "#fff",
              transition: "color 0.3s",
            }}>
              Swasth<span style={{ color: COLORS.forest }}>gram</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 24, overflow: "visible" }}>
            {navLinks.map((link) =>
              link.label === "Programs" ? (
                <div
                  key={link.label}
                  className="programs-wrapper"
                  onMouseEnter={() => setProgramsOpen(true)}
                  onMouseLeave={() => setProgramsOpen(false)}
                >
                  <button
                    className="nav-link"
                    onClick={(e) => handleNavClick(e, link.section)}
                    style={{ color: scrolled ? COLORS.text : "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    {link.label}
                    <span style={{ fontSize: 13, opacity: 0.7, marginTop: 1 }}>▾</span>
                  </button>
                  {programsOpen && (
                    <div className="programs-dropdown">
                      {programSubLinks.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setProgramsOpen(false)}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link"
                  style={{ color: scrolled ? COLORS.text : "rgba(255,255,255,0.8)" }}
                >
                  {link.label}
                </a>
              ) : link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link"
                  style={{ color: scrolled ? COLORS.text : "rgba(255,255,255,0.8)" }}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  className="nav-link"
                  onClick={(e) => handleNavClick(e, link.section)}
                  style={{ color: scrolled ? COLORS.text : "rgba(255,255,255,0.8)" }}
                >
                  {link.label}
                </button>
              )
            )}
            <a href="https://donate.swasthgram.org" style={{ textDecoration: "none" }}>
              <button className="btn-donate">Donate Now
              </button>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", flexDirection: "column", gap: 4 }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 20, height: 2, background: scrolled ? COLORS.text : "#fff", borderRadius: 2 }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div
            className="mobile-dropdown"
            style={{ background: "rgba(253,251,247,0.98)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14, alignItems: "center", borderTop: `1px solid ${COLORS.border}` }}
          >
            {navLinks.map((link) =>
              link.label === "Programs" ? (
                <div key={link.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}
                    onClick={() => setMobilePrograms(!mobilePrograms)}
                  >
                    <span className="nav-link" style={{ color: COLORS.text }}>Programs</span>
                    <span style={{ fontSize: 13, color: COLORS.text, opacity: 0.6, display: "inline-block", transition: "transform 0.2s", transform: mobilePrograms ? "rotate(180deg)" : "none" }}>▾</span>
                  </div>
                  {mobilePrograms && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      {programSubLinks.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="nav-link"
                          style={{ color: COLORS.forest, fontSize: 12 }}
                          onClick={() => { setMobileMenu(false); setMobilePrograms(false); }}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link"
                  style={{ color: COLORS.text }}
                  onClick={() => setMobileMenu(false)}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  className="nav-link"
                  style={{ color: COLORS.text }}
                  onClick={(e) => handleNavClick(e, link.section)}
                >
                  {link.label}
                </button>
              )
            )}
            <a href="https://donate.swasthgram.org" style={{ textDecoration: "none", width: "100%" }}>
              <button className="btn-donate" style={{ width: "100%", justifyContent: "center", padding: "13px 20px", fontSize: 13 }}>Donate Now</button>
            </a>
          </div>
        )}
      </nav>
    </>
  );
}