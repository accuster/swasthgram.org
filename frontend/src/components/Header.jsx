import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Heart } from "lucide-react";
import logoColor from "../assets/SwasthgramLogo.png";

const COLORS = {
  forest: "#1B6B3A",
  forestDark: "#145A2F",
  gold: "#C8963E",
  goldDark: "#B07F2E",
  text: "#1F2937",
  border: "#E8E4DC",
};

const programSubLinks = [
  { label: "Swasthmanthan", href: "/programs/swasthmanthan" },
  { label: "Saksham", href: "/programs/saksham" },
  { label: "Shudhvayu", href: "/programs/shudhvayu" },
];

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [mobilePrograms, setMobilePrograms] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

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
    { label: "Home",     href: "/" },
    { label: "About",    href: "/about" },
    { label: "Programs", dropdown: programSubLinks },
    { label: "Events",   href: "/events" },
  ];

  const isActive = (link) => {
    if (link.href) return location.pathname === link.href;
    if (link.dropdown) return link.dropdown.some((sub) => location.pathname.startsWith(sub.href));
    return false;
  };

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
          transition: color 0.2s, background 0.2s;
          padding: 0 16px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          background: none;
          border: none;
          position: relative;
        }
        .nav-link-active {
          color: ${COLORS.forest} !important;
          background: transparent;
          border-radius: 0;
          font-weight: 600;
        }
        .nav-link-active::after {
          content: '';
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 0;
          height: 2px;
          background: ${COLORS.forest};
        }
        .nav-link-active:hover {
          background: transparent;
        }
        .programs-wrapper {
          position: relative;
          display: flex;
          align-items: stretch;
        }
        .programs-wrapper::after {
          content: '';
          position: absolute;
          top: 100%;
          left: -10px;
          right: -10px;
          height: 6px;
        }
        .programs-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: stretch;
          background: #fff;
          border: 1px solid ${COLORS.border};
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          padding: 4px;
          z-index: 1000;
          animation: fadeDown 0.15s ease;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .programs-dropdown-col {
          display: block;
          padding: 10px 20px;
          border-radius: 7px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: ${COLORS.text};
          text-align: center;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .programs-dropdown-col:hover {
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
          padding: 14px 14px;
          border-radius: 6px;
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
        .btn-partner {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 12px;
          background: transparent;
          color: ${COLORS.forest};
          border: 1.5px solid ${COLORS.forest};
          padding: 13px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-partner:hover {
          background: ${COLORS.gold};
          border-color: ${COLORS.gold};
          color: #fff;
        }
        .btn-partner:active {
          background: ${COLORS.goldDark};
          border-color: ${COLORS.goldDark};
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .desktop-actions { display: none !important; }
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
        background: "rgba(253, 251, 247, 0.97)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${COLORS.border}`,
        height: 64,
      }}>
        <div style={{
          position: "relative",
          maxWidth: 1080, margin: "0 auto", padding: "0 24px",
          height: "100%",
          display: "flex", alignItems: "stretch", justifyContent: "space-between",
          overflow: "visible",
        }}>
          {/* Logo */}
          <a href="/" onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", alignSelf: "center" }}>
            <img src={logoColor} alt="Swasthgram" style={{ height: 36, width: "auto", display: "block" }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 20, fontWeight: 700, letterSpacing: -0.5,
                color: COLORS.text,
              }}>
                Swasth<span style={{ color: COLORS.forest }}>gram</span>
              </span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11, fontWeight: 600, letterSpacing: 0.6,
                textTransform: "uppercase",
                color: "#6B7280",
              }}>
                Global Foundation
              </span>
            </div>
          </a>

          {/* Desktop Nav — centered within the header regardless of logo/button widths */}
          <div className="desktop-nav" style={{
            position: "absolute", left: "50%", top: 0,
            transform: "translateX(-50%)",
            height: "100%",
            display: "flex", alignItems: "stretch", gap: 6, overflow: "visible",
          }}>
            {navLinks.map((link) =>
              link.label === "Home" ? (
                <a
                  key={link.label}
                  href="/"
                  onClick={handleLogoClick}
                  className={`nav-link${isActive(link) ? " nav-link-active" : ""}`}
                  style={{ color: isActive(link) ? COLORS.forest : COLORS.text }}
                >
                  {link.label}
                </a>
              ) : link.dropdown ? (
                <div key={link.label} className="programs-wrapper" style={{ alignSelf: "stretch" }}
                  onMouseEnter={() => setProgramsOpen(true)}
                  onMouseLeave={() => setProgramsOpen(false)}
                >
                  <span
                    className={`nav-link${isActive(link) ? " nav-link-active" : ""}`}
                    style={{ color: isActive(link) ? COLORS.forest : COLORS.text, display: "flex", alignItems: "center", gap: 4 }}
                  >
                    {link.label}
                    <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: programsOpen ? "rotate(180deg)" : "none" }} />
                  </span>
                  {programsOpen && (
                    <div className="programs-dropdown">
                      {link.dropdown.map((sub) => (
                        <a key={sub.label} href={sub.href} className="programs-dropdown-col" onClick={() => setProgramsOpen(false)}>
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
                  className={`nav-link${isActive(link) ? " nav-link-active" : ""}`}
                  style={{ color: isActive(link) ? COLORS.forest : COLORS.text }}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  className={`nav-link${isActive(link) ? " nav-link-active" : ""}`}
                  onClick={(e) => handleNavClick(e, link.section)}
                  style={{ color: isActive(link) ? COLORS.forest : COLORS.text }}
                >
                  {link.label}
                </button>
              )
            )}
          </div>

          {/* Partner / Donate buttons — pinned to the right */}
          <div className="desktop-actions" style={{ display: "flex", alignItems: "center", gap: 8, alignSelf: "center" }}>
            <a href="/partner-with-us" style={{ textDecoration: "none" }}>
              <button className="btn-partner">Partner With Us</button>
            </a>
            <a href="/donate" style={{ textDecoration: "none" }}>
              <button className="btn-donate"><Heart size={13} fill="#fff" />Donate Now</button>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", flexDirection: "column", gap: 4, alignSelf: "center" }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 20, height: 2, background: COLORS.text, borderRadius: 2 }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="mobile-dropdown" style={{
            background: "rgba(253,251,247,0.98)", padding: "16px 24px",
            display: "flex", flexDirection: "column", gap: 14,
            alignItems: "flex-start", borderTop: `1px solid ${COLORS.border}`
          }}>
            {navLinks.map((link) =>
              link.label === "Home" ? (
                <a
                  key={link.label}
                  href="/"
                  onClick={(e) => { handleLogoClick(e); setMobileMenu(false); }}
                  className={`nav-link${isActive(link) ? " nav-link-active" : ""}`}
                  style={{ color: isActive(link) ? COLORS.forest : COLORS.text }}
                >
                  {link.label}
                </a>
              ) : link.dropdown ? (
                <div key={link.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}
                    onClick={() => setMobilePrograms(!mobilePrograms)}>
                    <span className={`nav-link${isActive(link) ? " nav-link-active" : ""}`} style={{ color: isActive(link) ? COLORS.forest : COLORS.text }}>{link.label}</span>
                    <ChevronDown size={15} color={COLORS.text} style={{ opacity: 0.6, transition: "transform 0.2s", transform: mobilePrograms ? "rotate(180deg)" : "none" }} />
                  </div>
                  {mobilePrograms && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                      {link.dropdown.map((sub) => (
                        <a key={sub.label} href={sub.href} className="nav-link"
                          style={{ color: COLORS.forest, fontSize: 12 }}
                          onClick={() => { setMobileMenu(false); setMobilePrograms(false); }}>
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.href ? (
                <a key={link.label} href={link.href}
                  className={`nav-link${isActive(link) ? " nav-link-active" : ""}`}
                  style={{ color: isActive(link) ? COLORS.forest : COLORS.text }}
                  onClick={() => setMobileMenu(false)}>
                  {link.label}
                </a>
              ) : (
                <button key={link.label}
                  className={`nav-link${isActive(link) ? " nav-link-active" : ""}`}
                  style={{ color: isActive(link) ? COLORS.forest : COLORS.text }}
                  onClick={(e) => handleNavClick(e, link.section)}>
                  {link.label}
                </button>
              )
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <a href="/partner-with-us" style={{ textDecoration: "none" }} onClick={() => setMobileMenu(false)}>
                <button className="btn-partner" style={{ justifyContent: "center", padding: "12px 16px", fontSize: 13 }}>
                  Partner With Us
                </button>
              </a>
              <a href="/donate" style={{ textDecoration: "none" }}>
                <button className="btn-donate" style={{ justifyContent: "center", padding: "13px 16px", fontSize: 13 }}>
                  <Heart size={14} fill="#fff" />Donate Now
                </button>
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}