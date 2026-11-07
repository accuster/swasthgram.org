import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import NewsletterSignup from "../components/NewsletterSignup";
import newsletterIllustration from "../assets/newsletterIllustration.svg";
import logoColor from "../assets/SwasthgramLogo.png";
import logoWhite from "../assets/SwasthgramWhite.png";
import { Palette, Download, Check, X, Mail } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const COLORS = {
  forest: "#1B6B3A", forestDark: "#145A2F", forestDeep: "#0E4422",
  leaf: "#2E8B4F", gold: "#C8963E", goldSoft: "#D4A854", goldLight: "#E8C76A",
  warmBg: "#FDFBF7", cream: "#F8F5EE", white: "#FFFFFF",
  text: "#1F2937", textMid: "#4B5563", textLight: "#6B7280", border: "#E8E4DC",
};
const cc = COLORS;

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

const COLOR_GROUPS = [
  {
    title: "Primary — Forest Green",
    swatches: [
      { name: "Forest", hex: cc.forest },
      { name: "Forest Dark", hex: cc.forestDark },
      { name: "Forest Deep", hex: cc.forestDeep },
      { name: "Leaf", hex: cc.leaf },
    ],
  },
  {
    title: "Accent — Gold",
    swatches: [
      { name: "Gold", hex: cc.gold },
      { name: "Gold Soft", hex: cc.goldSoft },
      { name: "Gold Light", hex: cc.goldLight },
    ],
  },
  {
    title: "Neutral",
    swatches: [
      { name: "Warm BG", hex: cc.warmBg, border: true },
      { name: "Cream", hex: cc.cream, border: true },
      { name: "White", hex: cc.white, border: true },
      { name: "Text", hex: cc.text },
      { name: "Text Mid", hex: cc.textMid },
      { name: "Text Light", hex: cc.textLight },
      { name: "Border", hex: cc.border, border: true },
    ],
  },
];

function Swatch({ name, hex, border }) {
  const [copied, setCopied] = useState(false);
  const isLight = ["#FDFBF7", "#F8F5EE", "#FFFFFF", "#E8E4DC"].includes(hex);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(hex).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="sans"
      style={{
        all: "unset", cursor: "pointer", borderRadius: 14, overflow: "hidden",
        border: `1px solid ${cc.border}`, background: cc.white, width: 150,
      }}
    >
      <div style={{
        height: 72, background: hex,
        border: border ? `1px solid ${cc.border}` : "none",
      }} />
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: cc.text }}>{name}</div>
        <div style={{ fontSize: 12, color: cc.textLight, marginTop: 2 }}>
          {copied ? "Copied!" : hex.toUpperCase()}
        </div>
      </div>
    </button>
  );
}

export default function Brand() {
  useEffect(() => { document.title = "Brand Kit | Swasthgram"; }, []);

  return (
    <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", background: cc.warmBg, color: cc.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        .sans { font-family: 'Inter', -apple-system, sans-serif; }
        .tag { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; display: inline-block; }
        .dl-btn:hover { background: ${cc.forestDark} !important; }
      `}</style>

      <Header />

      {/* HERO */}
      <section style={{
        background: `linear-gradient(160deg, ${cc.forestDeep} 0%, ${cc.forest} 100%)`,
        padding: "116px 24px 56px", position: "relative",
      }}>
        <Breadcrumb items={[{ label: "Brand Kit" }]} />
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Palette size={24} color={cc.goldLight} />
            </div>
            <div className="tag" style={{ color: cc.goldSoft }}>Media &amp; Press</div>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>Brand Kit</h1>
          <p className="sans" style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.7 }}>
            Logos, colors, and typography for partners, media, and donors who want to reference Swasthgram Global Foundation correctly.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 24px 0" }}>

        {/* LOGO */}
        <FadeIn>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${cc.border}` }}>Logo</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
            {/* On light */}
            <div style={{ flex: "1 1 320px", background: cc.white, border: `1px solid ${cc.border}`, borderRadius: 14, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 140 }}>
                <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={logoColor} alt="Swasthgram" style={{ height: 48, width: "auto" }} />
                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                    <span className="sans" style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, color: cc.text }}>
                      Swasth<span style={{ color: cc.forest }}>gram</span>
                    </span>
                    <span className="sans" style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: cc.textLight }}>
                      Global Foundation
                    </span>
                  </div>
                </a>
              </div>
              <div className="sans" style={{ fontSize: 13, color: cc.textMid, textAlign: "center", marginBottom: 14 }}>For light backgrounds</div>
              <a href={logoColor} download="Swasthgram-Logo.png" className="dl-btn sans" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: cc.forest, color: "#fff", fontWeight: 600, fontSize: 13,
                padding: "10px 16px", borderRadius: 8, transition: "background 0.2s",
              }}>
                <Download size={14} /> Download mark (PNG)
              </a>
            </div>

            {/* On dark */}
            <div style={{ flex: "1 1 320px", background: cc.forestDeep, borderRadius: 14, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 140 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={logoWhite} alt="Swasthgram" style={{ height: 48, width: "auto" }} />
                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                    <span className="sans" style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, color: "#fff" }}>
                      Swasth<span style={{ color: cc.goldLight }}>gram</span>
                    </span>
                    <span className="sans" style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                      Global Foundation
                    </span>
                  </div>
                </div>
              </div>
              <div className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", textAlign: "center", marginBottom: 14 }}>For dark backgrounds</div>
              <a href={logoWhite} download="Swasthgram-Logo-White.png" className="sans" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 600, fontSize: 13,
                padding: "10px 16px", borderRadius: 8,
              }}>
                <Download size={14} /> Download mark (PNG)
              </a>
            </div>
          </div>

          {/* Usage rules */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
            <div style={{ flex: "1 1 260px", background: cc.white, border: `1px solid ${cc.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <h3 className="sans" style={{ fontSize: 13, fontWeight: 700, color: cc.forest, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Check size={15} color={cc.forest} /> Do
              </h3>
              <ul className="sans" style={{ fontSize: 13.5, lineHeight: 1.9, color: cc.textMid, paddingLeft: 18 }}>
                <li>Use the full-color mark on light backgrounds</li>
                <li>Use the white mark on dark or forest-green backgrounds</li>
                <li>Keep clear space around the mark at least the height of the icon</li>
                <li>Scale proportionally — keep a minimum height of ~24px</li>
              </ul>
            </div>
            <div style={{ flex: "1 1 260px", background: cc.white, border: `1px solid ${cc.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <h3 className="sans" style={{ fontSize: 13, fontWeight: 700, color: "#C0392B", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <X size={15} color="#C0392B" /> Don't
              </h3>
              <ul className="sans" style={{ fontSize: 13.5, lineHeight: 1.9, color: cc.textMid, paddingLeft: 18 }}>
                <li>Recolor, recreate, or alter the mark</li>
                <li>Stretch, skew, or distort the proportions</li>
                <li>Place the color mark on a busy or low-contrast background</li>
                <li>Add shadows, outlines, or other effects</li>
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* COLOR PALETTE */}
        <FadeIn delay={0.05}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${cc.border}` }}>Color Palette</h2>
          {COLOR_GROUPS.map((group) => (
            <div key={group.title} style={{ marginBottom: 28 }}>
              <div className="sans" style={{ fontSize: 12, fontWeight: 700, color: cc.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>{group.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                {group.swatches.map((s) => <Swatch key={s.name} {...s} />)}
              </div>
            </div>
          ))}
          <p className="sans" style={{ fontSize: 13, color: cc.textLight, marginTop: 4, marginBottom: 48 }}>Click a swatch to copy its hex code.</p>
        </FadeIn>

        {/* TYPOGRAPHY */}
        <FadeIn delay={0.1}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${cc.border}` }}>Typography</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
            <div style={{ flex: "1 1 320px", background: cc.white, border: `1px solid ${cc.border}`, borderRadius: 14, padding: "24px 28px" }}>
              <div className="sans" style={{ fontSize: 11, fontWeight: 700, color: cc.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Headings</div>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 30, fontWeight: 700, color: cc.text, marginBottom: 8 }}>Libre Baskerville</div>
              <p className="sans" style={{ fontSize: 13.5, color: cc.textMid, lineHeight: 1.7 }}>A serif typeface used for all page titles and section headings — regular and bold weights, with italic for emphasis.</p>
            </div>
            <div style={{ flex: "1 1 320px", background: cc.white, border: `1px solid ${cc.border}`, borderRadius: 14, padding: "24px 28px" }}>
              <div className="sans" style={{ fontSize: 11, fontWeight: 700, color: cc.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Body &amp; UI</div>
              <div className="sans" style={{ fontSize: 30, fontWeight: 700, color: cc.text, marginBottom: 8 }}>Inter</div>
              <p className="sans" style={{ fontSize: 13.5, color: cc.textMid, lineHeight: 1.7 }}>A sans-serif typeface used for body copy, navigation, buttons, and all interface text — weights 400 through 800.</p>
            </div>
          </div>
        </FadeIn>

        {/* FULL GUIDELINES */}
        <FadeIn delay={0.15}>
          <div style={{ background: `linear-gradient(135deg, ${cc.forestDeep}, ${cc.forest})`, borderRadius: 16, padding: "32px 28px", marginBottom: 56 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Need something not covered here?</h3>
            <p className="sans" style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 20, maxWidth: 560 }}>
              A full downloadable brand guidelines document is in progress. For additional logo formats, co-branding approval, or other assets, reach out directly.
            </p>
            <a href="mailto:support@swasthgram.org" className="sans" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 600, fontSize: 13,
              padding: "10px 18px", borderRadius: 8,
            }}>
              <Mail size={14} /> support@swasthgram.org
            </a>
          </div>
        </FadeIn>
      </div>

      <FadeIn>
        <section style={{ background: cc.warmBg, padding: "0 24px 64px" }}>
          <div style={{ maxWidth: 920, margin: "0 auto", background: cc.white, border: `1px solid ${cc.border}`, borderRadius: 20, overflow: "hidden", display: "flex", flexWrap: "wrap", boxShadow: "0 12px 32px rgba(31,41,55,0.06)" }}>
            <div style={{ flex: "0 0 280px", minWidth: 240, background: cc.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
              <img src={newsletterIllustration} alt="" style={{ width: "100%", maxWidth: 280 }} />
            </div>
            <div style={{ flex: "1 1 320px", minWidth: 280, padding: "40px 36px" }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: cc.gold, marginBottom: 10 }}>Stay Connected</div>
              <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: cc.text, marginBottom: 10 }}>Subscribe to our newsletter</h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: cc.textMid, lineHeight: 1.7, marginBottom: 24, maxWidth: 420 }}>
                Camp schedules, new health-unit deployments, and stories from the communities we reach — straight to your inbox.
              </p>
              <div style={{ maxWidth: 360 }}>
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <Footer />
    </div>
  );
}
