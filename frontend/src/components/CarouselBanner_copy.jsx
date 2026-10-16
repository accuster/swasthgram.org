import { useState, useEffect, useCallback } from "react";
import bannerHome1 from "../assets/home/home1.jpeg";
import bannerHome2 from "../assets/home/home2.jpeg";
import bannerHome3 from "../assets/home/home3.jpg";
import bannerHome4 from "../assets/home/home4.jpeg";
import imgSwasthmanthan from "../assets/programs/Swasthmanthan.webp";
import imgSaksham from "../assets/programs/saksham.webp";
import imgShudhvayu from "../assets/programs/Shudhvayu.webp";

const BANNER_INTERVAL = 6000;

const SLIDES = [
  {
    tag: "SWASTHMANTHAN · PUBLIC HEALTH",
    headline: "Cancer found early.\nLives saved completely.",
    sub: "The world's only Health Unit on Bike — solar-powered, jungle-ready — brings cancer screening, diabetes & maternal health tests directly to villages that hospitals never reach.",
    cta: { label: "Support SwasthManthan", href: "#donate" },
    stats: [{ n: "1,11,392", l: "People Reached" }, { n: "21,750+", l: "Cancer Tests" }, { n: "9,360+", l: "Health Camps" }],
    img: imgSwasthmanthan,
    accent: "#1B6B3A",
    accentLight: "rgba(27,107,58,0.18)",
  },
  {
    tag: "SAKSHAM · YOUTH EMPOWERMENT",
    headline: "4 years of skill.\nDelivered in 4 months.",
    sub: "8 years of R&D compressed rigorous medical training into an intensive 4-month programme. Graduates are placed at Medanta and leading hospitals — breaking the poverty cycle permanently.",
    cta: { label: "Support Saksham", href: "#donate" },
    stats: [{ n: "8 Years", l: "R&D" }, { n: "4 Months", l: "vs 4 Years" }, { n: "1,050+", l: "Placed" }],
    img: imgSaksham,
    accent: "#B45309",
    accentLight: "rgba(180,83,9,0.18)",
  },
  {
    tag: "SHUDHVAYU · ENVIRONMENT",
    headline: "Clean air.\nWhile you drive.",
    sub: "Patented vehicle-mounted air purification filter. No electricity. No AC. Cleans the air as cars move — the most democratic, scalable solution to urban air pollution. On Delhi roads since 2018.",
    cta: { label: "Support Shudhvayu", href: "#donate" },
    stats: [{ n: "Since 2018", l: "On Roads" }, { n: "Patented", l: "Technology" }, { n: "Delhi NCR", l: "& Beyond" }],
    img: imgShudhvayu,
    accent: "#1D4ED8",
    accentLight: "rgba(29,78,216,0.18)",
  },
  {
    tag: "OUR IMPACT · PROVEN AT SCALE",
    headline: "6 Lakh+ lives.\nOne motorbike at a time.",
    sub: "From Kumbh Mela to the Indian Army, from Washington D.C. to the most remote villages of Himachal — our health unit on bike is validated by PwC and trusted by governments worldwide.",
    cta: { label: "See Our Impact", href: "#impact" },
    stats: [{ n: "6,00,000+", l: "Beneficiaries" }, { n: "5,000+", l: "Units Deployed" }, { n: "18", l: "Countries Presented" }],
    img: bannerHome3,
    accent: "#C8963E",
    accentLight: "rgba(200,150,62,0.18)",
  },
];

export default function CarouselBanner() {
  const [active, setActive]     = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused]     = useState(false);
  const [animKey, setAnimKey]   = useState(0);

  const goTo = useCallback((i) => {
    setActive(i);
    setProgress(0);
    setAnimKey(k => k + 1);
  }, []);

  const goNext = useCallback(() => {
    setActive(p => (p + 1) % SLIDES.length);
    setProgress(0);
    setAnimKey(k => k + 1);
  }, []);

  const goPrev = useCallback(() => {
    setActive(p => (p - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
    setAnimKey(k => k + 1);
  }, []);

  useEffect(() => {
    if (paused) return;
    const tick = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { goNext(); return 0; }
        return p + (100 / (BANNER_INTERVAL / 50));
      });
    }, 50);
    return () => clearInterval(tick);
  }, [paused, goNext]);

  const slide = SLIDES[active];

  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroImgIn {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.08); }
        }
        .hero-slide-text { animation: heroFadeUp 0.65s cubic-bezier(.22,1,.36,1) both; }
        .hero-slide-img  { animation: heroImgIn 0.75s cubic-bezier(.22,1,.36,1) both; }
        .hero-dot-btn:hover { transform: scaleY(1.5); }
        @media (max-width: 768px) {
          .hero-inner { flex-direction: column !important; text-align: center !important; padding: 80px 20px 48px !important; }
          .hero-text-col { align-items: center !important; }
          .hero-img-col { width: 100% !important; max-width: 340px !important; margin: 0 auto !important; }
          .hero-stats { justify-content: center !important; }
          .hero-arrows { display: none !important; }
          .hero-headline { font-size: clamp(26px, 7vw, 36px) !important; }
        }
      `}</style>

      <section
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #050c07 0%, #0E2E18 40%, #0E4422 75%, #145A2F 100%)",
          overflow: "hidden",
        }}
      >
        {/* Background glow blob */}
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: "65vw", height: "65vw", borderRadius: "50%",
          background: `radial-gradient(circle, ${slide.accentLight} 0%, transparent 70%)`,
          transition: "background 0.8s ease",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", bottom: "-15%", left: "-5%",
          width: "40vw", height: "40vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(27,107,58,0.12) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, transparent 0%, ${slide.accent} 50%, transparent 100%)`,
          transition: "background 0.6s ease", zIndex: 2,
        }} />

        {/* Main content */}
        <div
          className="hero-inner"
          style={{
            flex: 1, display: "flex", alignItems: "center",
            gap: 48, maxWidth: 1080, margin: "0 auto", width: "100%",
            padding: "120px 24px 80px", position: "relative", zIndex: 1,
          }}
        >
          {/* Left: Text */}
          <div
            key={`text-${animKey}`}
            className="hero-slide-text hero-text-col"
            style={{ flex: "1 1 52%", display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Tag */}
            <div style={{
              alignSelf: "flex-start",
              fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase",
              color: slide.accent,
              background: slide.accentLight,
              border: `1px solid ${slide.accent}44`,
              padding: "5px 14px", borderRadius: 6,
            }}>
              {slide.tag}
            </div>

            {/* Headline */}
            <h1
              className="hero-headline"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "clamp(30px, 3.8vw, 52px)",
                fontWeight: 700, color: "#fff",
                lineHeight: 1.12,
                whiteSpace: "pre-line",
                margin: 0,
              }}
            >
              {slide.headline}
            </h1>

            {/* Sub */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(13px, 1.4vw, 15px)",
              lineHeight: 1.75, color: "rgba(255,255,255,0.58)",
              maxWidth: 460, margin: 0,
            }}>
              {slide.sub}
            </p>

            {/* Stats */}
            <div
              className="hero-stats"
              style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 4 }}
            >
              {slide.stats.map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700,
                    color: slide.accent === "#C8963E" ? "#C8963E" : slide.accent,
                    lineHeight: 1,
                  }}>{s.n}</span>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
                    textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
                  }}>{s.l}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              <a
                href={slide.cta.href}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14,
                  background: slide.accent, color: "#fff",
                  padding: "13px 28px", borderRadius: 10,
                  textDecoration: "none",
                  boxShadow: `0 8px 24px ${slide.accent}44`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 14px 32px ${slide.accent}66`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 24px ${slide.accent}44`; }}
              >
                {slide.cta.label} →
              </a>
              <a
                href="#about"
                style={{
                  display: "inline-flex", alignItems: "center",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "13px 24px", borderRadius: 10,
                  textDecoration: "none", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              >
                Our Story
              </a>
            </div>
          </div>

          {/* Right: Image */}
          <div
            key={`img-${animKey}`}
            className="hero-slide-img hero-img-col"
            style={{ flex: "0 0 420px", position: "relative" }}
          >
            {/* Glow behind image */}
            <div style={{
              position: "absolute", inset: -24,
              background: `radial-gradient(circle, ${slide.accentLight} 0%, transparent 70%)`,
              borderRadius: "50%", pointerEvents: "none",
            }} />

            {/* Image card */}
            <div style={{
              position: "relative", borderRadius: 20, overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${slide.accent}22`,
              aspectRatio: "4/3",
            }}>
              <img
                src={slide.img}
                alt={slide.tag}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Image overlay gradient */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(135deg, ${slide.accent}22 0%, transparent 60%, rgba(0,0,0,0.3) 100%)`,
              }} />
              {/* Bottom label */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
                padding: "20px 18px 14px",
                fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                color: "rgba(255,255,255,0.7)", letterSpacing: 0.5,
              }}>
                {slide.tag.split("·")[0].trim()}
              </div>
            </div>

            {/* Slide counter badge */}
            <div style={{
              position: "absolute", top: 14, right: 14,
              background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, padding: "4px 10px",
              fontFamily: "'Inter', sans-serif", fontSize: 10,
              color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: 1,
            }}>
              {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Arrow buttons */}
        <button
          className="hero-arrows"
          onClick={goPrev}
          style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            zIndex: 10, background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
            width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >‹</button>
        <button
          className="hero-arrows"
          onClick={goNext}
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            zIndex: 10, background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
            width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >›</button>

        {/* Dot nav + progress */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 8, paddingBottom: 32,
        }}>
          {SLIDES.map((s, i) => (
            <button
              key={i}
              className="hero-dot-btn"
              onClick={() => goTo(i)}
              style={{
                width: i === active ? 32 : 8,
                height: 4, borderRadius: 2, border: "none",
                cursor: "pointer", padding: 0,
                background: i === active ? s.accent : "rgba(255,255,255,0.18)",
                transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
                position: "relative", overflow: "hidden",
              }}
            >
              {i === active && (
                <div style={{
                  position: "absolute", top: 0, left: 0, height: "100%",
                  width: `${progress}%`,
                  background: "rgba(255,255,255,0.35)", borderRadius: 2,
                  transition: "width 0.05s linear",
                }} />
              )}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}