import { useState, useEffect, useRef } from "react";
import sv1  from "../assets/shudhvayu/shudhvayu (1).png";
import sv2  from "../assets/shudhvayu/shudhvayu (2).jpg";
import sv3  from "../assets/shudhvayu/shudhvayu (3).webp";
import sv4  from "../assets/shudhvayu/shudhvayu (4).jpeg";
import sv5  from "../assets/shudhvayu/shudhvayu (5).jpeg";
import sv6  from "../assets/shudhvayu/shudhvayu (6).jpeg";
import sv7  from "../assets/shudhvayu/shudhvayu (7).jpeg";
import sv8  from "../assets/shudhvayu/shudhvayu (8).jpeg";
import sv9  from "../assets/shudhvayu/shudhvayu (9).jpeg";
import sv10 from "../assets/shudhvayu/shudhvayu (10).jpeg";
import sv11 from "../assets/shudhvayu/shudhvayu (11).jpg";
import sv12 from "../assets/shudhvayu/shudhvayu (12).jpeg";
import sv13 from "../assets/shudhvayu/shudhvayu (13).jpg";
import sv14 from "../assets/shudhvayu/shudhvayu (14).jpg";
import sv15 from "../assets/shudhvayu/shudhvayu (15).jpeg";
import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import { Wind, Car, Wrench, Leaf, Sun, VolumeX, RefreshCw, FileCheck, MapPin, Zap, Gift, Globe, Mail, Phone, HeartHandshake } from "lucide-react";

const C = {
  forest: "#1B6B3A", forestDark: "#145A2F",
  sky: "#0369A1", skyDark: "#075985", skyDeep: "#0C4A6E",
  skyLight: "#38BDF8", skyPale: "#7DD3FC",
  gold: "#C8963E", goldSoft: "#D4A854", goldLight: "#E8C76A",
  warmBg: "#F8FAFC", cream: "#F0F9FF", white: "#FFFFFF",
  text: "#1F2937", textMid: "#4B5563", textLight: "#6B7280", border: "#E2E8F0",
  red: "#DC2626",
};


const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "— Union Territories —",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu",
  "Delhi (NCT)","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function AnimatedCounter({ end, suffix = "", noGroup = false }: { end: number; suffix?: string; noGroup?: boolean }) {
  const [value, setValue] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let current = 0; const step = Math.ceil(end / 50);
    const timer = setInterval(() => { current += step; if (current >= end) { setValue(end); clearInterval(timer); } else setValue(current); }, 30);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span ref={ref}>{noGroup ? value : value.toLocaleString("en-IN")}{suffix}</span>;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

// Program donations are handled on the shared /donate page now — see the
// DONATE section below, which links there with this program pre-selected.
const LOCKED_PROGRAM = "Shudhvayu";


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShudhvayuPage() {
  useEffect(() => { document.title = "Shudhvayu – Clean Air | Swasthgram"; }, []);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const VIDEO_ID = "7bVT-0s_c-s";

  const credentials = [
    { name: "Patented Technology", sub: "Unique to Swasthgram", icon: <FileCheck size={20} color="#fff" /> },
    { name: "Active Since 2018", sub: "On Indian Roads", icon: <Car size={20} color="#fff" /> },
    { name: "Delhi NCR", sub: "Primary Deployment Zone", icon: <MapPin size={20} color="#fff" /> },
    { name: "Zero Electricity", sub: "100% Passive System", icon: <Zap size={20} color="#fff" /> },
    { name: "Free Installation", sub: "No Cost to Citizens", icon: <Gift size={20} color="#fff" /> },
  ];

  const faqs = [
    { q: "How does Shudhvayu actually clean the air?", a: "A patented filtration device is mounted on the car's rooftop. As the vehicle moves, natural airflow pushes ambient air through the filter, capturing particulate matter (PM2.5, PM10), dust, and pollutants. No electricity, no motor, no power source needed — it's entirely passive." },
    { q: "Does it really work without electricity?", a: "Yes, 100%. The system harnesses the kinetic energy of the moving vehicle to force air through the filtration medium. It's the same principle as wind passing through a screen — but engineered for pollution capture at driving speeds." },
    { q: "How much does it cost to install?", a: "Nothing. Shudhvayu filters are installed completely free of charge. The programme is funded by donors and CSR partners. Citizens simply volunteer their vehicle rooftop." },
    { q: "Does it damage my car?", a: "No. The installation is non-invasive — the filter unit mounts on the rooftop without any modifications to the vehicle. It can be removed at any time without leaving any marks or damage." },
    { q: "How much pollution can one car filter?", a: "Each vehicle-mounted unit filters the equivalent of the air breathed by approximately 800 people per day of driving. Scale that across thousands of cars and the impact on city-level air quality becomes significant." },
    { q: "Where is Shudhvayu currently active?", a: "Primarily in Delhi NCR — India's most polluted metropolitan region. The programme is expanding to other cities as more citizens and donors join the movement." },
    { q: "How can I get Shudhvayu on my car?", a: "Contact us at support@swasthgram.org or call +91 87507-40000. We'll schedule a free installation at a location convenient for you." },
  ];

  const testimonials = [
    { quote: "I drive 40 km daily in Delhi traffic. Knowing that my car is actually cleaning the air while I commute — instead of just adding to the problem — gives me a sense of purpose every morning.", name: "Ankit R.", role: "IT Professional, Gurgaon" },
    { quote: "My auto-rickshaw is now a mobile air purifier. My passengers notice the device and ask about it. I've become an ambassador for clean air in my neighbourhood without even trying.", name: "Suresh K.", role: "Auto Driver, East Delhi" },
    { quote: "We installed Shudhvayu on our entire fleet of 12 delivery vans. Zero cost, zero maintenance, zero disruption to operations. Our vehicles now clean the air on every delivery route.", name: "Priya S.", role: "Operations Head, Logistics Company" },
  ];

  return (
    <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", background: C.warmBg, color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        .sans { font-family: 'Inter', -apple-system, sans-serif; }
        .tag { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; display: inline-block; }
        .btn-primary { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; background: ${C.sky}; color: #fff; border: none; padding: 13px 28px; border-radius: 8px; cursor: pointer; transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: ${C.skyDark}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(3,105,161,0.25); }
        .btn-outline { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px; background: transparent; color: ${C.sky}; border: 2px solid ${C.sky}; padding: 11px 24px; border-radius: 8px; cursor: pointer; transition: all 0.25s; }
        .btn-outline:hover { background: ${C.sky}; color: #fff; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes breathe { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.3); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .hero-flex { flex-direction: column !important; text-align: center !important; }
          .hero-flex > div:first-child { align-items: center !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-cta { justify-content: center !important; }
          .partner-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .step-grid { grid-template-columns: 1fr !important; }
          .donate-grid { grid-template-columns: 1fr !important; }
          .donate-form-row { grid-template-columns: 1fr !important; }
          .donate-impact-card { display: none !important; }
        }
        @media (min-width: 901px) {
          .mobile-only { display: none !important; }
        }
      `}</style>

      <Header />

      {/* HERO */}
      <section style={{ minHeight: "85vh", display: "flex", alignItems: "center", background: "linear-gradient(170deg, #0a1520 0%, #0C4A6E 55%, #0369A1 100%)", paddingTop: 72, position: "relative", overflow: "hidden" }}>
        <Breadcrumb items={[{ label: "Programs" }, { label: "Shudhvayu" }]} />
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "rgba(56,189,248,0.06)", animation: "breathe 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 200, height: 200, borderRadius: "50%", background: "rgba(56,189,248,0.04)", animation: "breathe 8s ease-in-out infinite 2s" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px", width: "100%", position: "relative", zIndex: 2 }}>
          <div className="hero-flex" style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <div style={{ flex: "1 1 50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
              <div className="tag" style={{ color: C.skyPale, background: "rgba(56,189,248,0.15)", padding: "5px 12px", borderRadius: 16, fontSize: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Leaf size={12} color={C.skyPale} /> Shudhvayu · Clean Air Initiative
              </div>
              <h1 style={{ fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 700, lineHeight: 1.12, color: "#fff" }}>
                Clean air isn't<br />a privilege.<br /><span style={{ color: C.skyPale }}>It's a right to life.</span>
              </h1>
              <p className="sans" style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.65)", maxWidth: 460 }}>
                Shudhvayu is a patented, vehicle-mounted air purification system that cleans the air as you drive. No electricity. No infrastructure. No cost to you.
              </p>
              <div className="hero-cta" style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                <a href="/donate?program=Shudhvayu" className="btn-primary" style={{ background: C.skyLight, color: "#0C4A6E", padding: "14px 32px", fontSize: 15 }}>Support Clean Air</a>
                <a href="#how" className="btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}>How It Works →</a>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
                {["Patented Technology", "Zero Electricity", "Free Installation", "Active Since 2018"].map((text, i) => (
                  <div key={i} className="sans" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.skyPale }} />{text}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 50%", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "min(480px, 90vw)", borderRadius: 16, overflow: "hidden", position: "relative", border: "2px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                <img src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`} alt="Watch Shudhvayu in action" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
                <div onClick={() => window.open(`https://www.youtube.com/watch?v=${VIDEO_ID}`, "_blank")} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "rgba(0,0,0,0.35)" }}>
                  <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(0,0,0,0.3)", animation: "pulse 2s ease-in-out infinite" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.transform = "scale(1)")}>
                    <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: `22px solid ${C.sky}`, marginLeft: 5 }} />
                  </div>
                  <div className="sans" style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginTop: 12, letterSpacing: 1 }}>WATCH: DRIVE YOUR CAR, CLEAN THE AIR</div>
                  <div className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>See Shudhvayu in action</div>
                </div>
                <div className="sans" style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.8)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <Wind size={18} color="#fff" />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Shudhvayu</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Patented · Passive · Free</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "28px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <p className="sans" style={{ fontSize: 10, color: C.textLight, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 18 }}>Shudhvayu credentials</p>
          <div className="partner-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, alignItems: "center", justifyItems: "center" }}>
            {credentials.map((p, i) => (
              <div key={i} style={{ textAlign: "center", padding: "8px 4px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #0369A1, #38BDF8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>{p.icon}</div>
                <div className="sans" style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                <div className="sans" style={{ fontSize: 9, color: C.textLight, marginTop: 1 }}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE CRISIS */}
      <FadeIn>
        <section style={{ maxWidth: 840, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div className="tag" style={{ color: C.red, marginBottom: 12, background: "rgba(220,38,38,0.06)", padding: "5px 14px", borderRadius: 16 }}>The Crisis</div>
          <h2 style={{ fontSize: "clamp(24px, 3.8vw, 38px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
            Air pollution kills<br /><span style={{ color: C.red }}>2 million Indians every year.</span>
          </h2>
          <p className="sans" style={{ fontSize: 16, lineHeight: 1.8, color: C.textMid, maxWidth: 620, margin: "0 auto 28px" }}>
            Delhi's air quality regularly hits hazardous levels. Traditional solutions require billions in infrastructure, years of planning, and government will. Shudhvayu needs none of that — just citizens with cars.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, maxWidth: 560, margin: "0 auto" }} className="grid-4">
            {[{ icon: <Sun size={20} color="#0369A1" />, label: "No Electricity Needed" }, { icon: <VolumeX size={20} color="#0369A1" />, label: "Completely Silent" }, { icon: <Wrench size={20} color="#0369A1" />, label: "Zero Maintenance" }, { icon: <RefreshCw size={20} color="#0369A1" />, label: "Carbon Net Zero" }].map((f, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 10, padding: "14px 10px", textAlign: "center", border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{f.icon}</div>
                <div className="sans" style={{ fontSize: 11, fontWeight: 600, color: C.textMid }}>{f.label}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* WHY DIFFERENT */}
      <FadeIn>
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="tag" style={{ color: C.gold, marginBottom: 8 }}>Why Shudhvayu Is Different</div>
            <h2 style={{ fontSize: "clamp(24px, 3.2vw, 34px)", fontWeight: 700 }}>Not a purifier. A movement.</h2>
            <p className="sans" style={{ fontSize: 15, color: C.textMid, marginTop: 10 }}>Every other solution requires infrastructure, power, and government action. Shudhvayu requires only citizens.</p>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {[
              { title: "Patented Innovation", desc: "A unique filtration technology designed in India, specifically for India's pollution profile. Not available anywhere else in the world.", icon: <FileCheck size={28} color="#0369A1" /> },
              { title: "Completely Free for Citizens", desc: "No purchase. No subscription. No hidden costs. The filter is installed on your vehicle at zero charge. You volunteer your rooftop; we supply the technology.", icon: <Gift size={28} color="#0369A1" /> },
              { title: "No Electricity, Ever", desc: "100% passive system. Uses the natural airflow created by a moving vehicle. Works on highways, in traffic, on rural roads — anywhere a vehicle drives.", icon: <Zap size={28} color="#0369A1" /> },
              { title: "Scales with Participation", desc: "More cars = cleaner air. Unlike centralized purifiers that cover one room, every new Shudhvayu vehicle expands the clean-air network across the city.", icon: <Globe size={28} color="#0369A1" /> },
              { title: "Democratic by Design", desc: "No government permits needed. No infrastructure required. Citizens cleaning their own air, one vehicle at a time.", icon: <RefreshCw size={28} color="#0369A1" /> },
              { title: "Any Vehicle, Any City", desc: "Cars, auto-rickshaws, delivery vans, trucks — any vehicle with a rooftop. Currently active in Delhi NCR. Expanding to every polluted city in India.", icon: <Car size={28} color="#0369A1" /> },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div style={{ background: C.white, borderRadius: 14, padding: "28px 24px", border: `1px solid ${C.border}`, height: "100%", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>{item.icon}</div>
                  <h4 className="sans" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{item.title}</h4>
                  <p className="sans" style={{ fontSize: 12, lineHeight: 1.7, color: C.textMid }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* IMPACT */}
      <section style={{ background: "linear-gradient(160deg, #0C4A6E 0%, #0369A1 50%, #0284C7 100%)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="tag" style={{ color: C.goldSoft, marginBottom: 8 }}>The Impact So Far</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, color: "#fff" }}>Cleaning Delhi's air, one vehicle at a time</h2>
          </div>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[{ end: 2018, suffix: "", noGroup: true, label: "Year Programme Started", icon: <FileCheck size={22} color={C.skyPale} /> }, { end: 500, suffix: "+", label: "Vehicles with Shudhvayu", icon: <Car size={22} color={C.skyPale} /> }, { end: 10, suffix: "+", label: "Patents & Certifications", icon: <FileCheck size={22} color={C.skyPale} /> }, { end: 365, suffix: "", label: "Days Active Per Year", icon: <RefreshCw size={22} color={C.skyPale} /> }].map((stat, i) => (
              <div key={i} style={{ textAlign: "center", padding: "24px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{stat.icon}</div>
                <div className="sans" style={{ fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 700, color: C.skyPale, lineHeight: 1 }}><AnimatedCounter end={stat.end} suffix={stat.suffix} noGroup={stat.noGroup} /></div>
                <div className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <FadeIn>
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="tag" style={{ color: C.sky, marginBottom: 8 }}>Citizens Speak</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700 }}>From commuters to clean-air champions</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 14, padding: "30px 24px", border: `1px solid ${C.border}`, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 28, color: C.sky, lineHeight: 1, marginBottom: 14 }}>"</div>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: C.textMid, fontStyle: "italic", flex: 1, marginBottom: 20 }}>{t.quote}</p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                    <div className="sans" style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div className="sans" style={{ fontSize: 12, color: C.sky, fontWeight: 500 }}>{t.role}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* GALLERY */}
      <section style={{ background: C.warmBg, padding: "64px 0", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: 32, padding: "0 24px" }}>
          <div className="tag" style={{ color: C.sky, marginBottom: 8 }}>Shudhvayu in Action</div>
          <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700 }}>On the streets. In the air.</h2>
        </div>
        <style>{`
          @keyframes marquee-fwd { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes marquee-rev { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
          .sg-row1 { display: flex; gap: 12px; width: max-content; animation: marquee-fwd 35s linear infinite; }
          .sg-row2 { display: flex; gap: 12px; width: max-content; animation: marquee-rev 40s linear infinite; margin-top: 12px; }
          .sg-row1:hover, .sg-row2:hover { animation-play-state: paused; }
        `}</style>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #F8FAFC, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #F8FAFC, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="sg-row1">
            {[...Array(2)].map((_, repeat) =>
              [
                { src: sv1,  w: 220 },
                { src: sv2,  w: 300 },
                { src: sv3,  w: 220 },
                { src: sv4,  w: 260 },
                { src: sv5,  w: 220 },
                { src: sv6,  w: 300 },
                { src: sv7,  w: 220 },
                { src: sv8,  w: 240 },
              ].map((img, i) => (
                <div key={`r1-${repeat}-${i}`} style={{ flexShrink: 0, width: img.w, height: 180, borderRadius: 12, overflow: "hidden", background: "#0C4A6E" }}>
                  <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #F8FAFC, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #F8FAFC, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="sg-row2">
            {[...Array(2)].map((_, repeat) =>
              [
                { src: sv9,  w: 300 },
                { src: sv10, w: 220 },
                { src: sv11, w: 260 },
                { src: sv12, w: 220 },
                { src: sv13, w: 300 },
                { src: sv14, w: 220 },
                { src: sv15, w: 240 },
              ].map((img, i) => (
                <div key={`r2-${repeat}-${i}`} style={{ flexShrink: 0, width: img.w, height: 180, borderRadius: 12, overflow: "hidden", background: "#0C4A6E" }}>
                  <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* THE MATH */}
      <FadeIn>
        <section style={{ background: C.cream, padding: "72px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <div className="tag" style={{ color: C.sky, marginBottom: 12 }}>The Simple Math</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, lineHeight: 1.25, marginBottom: 24 }}>
              Delhi has <span style={{ color: C.sky }}>1.2 crore registered vehicles.</span>
            </h2>
            <p className="sans" style={{ fontSize: 16, lineHeight: 1.8, color: C.textMid, maxWidth: 600, margin: "0 auto 24px" }}>
              If just 10% install Shudhvayu, that's 1,200,000 mobile air purifiers cleaning the city every day. No power grid. No government budget. Just citizens who decided to act.
            </p>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 600, margin: "0 auto 32px" }}>
              {[{ n: "1 Car", desc: "Filters air for ~800 people daily" }, { n: "1,000 Cars", desc: "One neighbourhood breathing cleaner" }, { n: "1,200,000 Cars", desc: "An entire city transformed" }].map((item, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 12, padding: "20px 16px", textAlign: "center", border: `1px solid ${C.border}` }}>
                  <div className="sans" style={{ fontSize: 22, fontWeight: 800, color: C.sky }}>{item.n}</div>
                  <div className="sans" style={{ fontSize: 11, color: C.textMid, marginTop: 4 }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <a href="#install" className="btn-primary" style={{ padding: "14px 36px", fontSize: 15 }}>Get Shudhvayu on Your Vehicle — Free</a>
          </div>
        </section>
      </FadeIn>

      {/* GET INSTALLED */}
      <FadeIn>
        <section id="install" style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ background: C.white, borderRadius: 20, padding: "48px 40px", border: `1px solid ${C.border}`, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Leaf size={48} color={C.sky} /></div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, marginBottom: 12 }}>Want Shudhvayu on your vehicle?</h2>
            <p className="sans" style={{ fontSize: 15, lineHeight: 1.7, color: C.textMid, maxWidth: 500, margin: "0 auto 28px" }}>
              It's free. It takes 15 minutes. And every kilometre you drive after that cleans the air for everyone around you.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginBottom: 28 }}>
              <div className="sans" style={{ fontSize: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <Mail size={18} color={C.sky} /><strong>support@swasthgram.org</strong>
              </div>
              <div className="sans" style={{ fontSize: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <Phone size={18} color={C.sky} /><strong>+91 87507-40000</strong>
              </div>
            </div>
            <p className="sans" style={{ fontSize: 13, color: C.textLight }}>Currently installing in Delhi NCR. Expanding to more cities soon.</p>
          </div>
        </section>
      </FadeIn>

      {/* DONATE */}
      <section id="donate" style={{ background: C.warmBg, padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: 12 }}>
          Every donation funds cleaner air for someone who needs it.
        </h2>
        <p className="sans" style={{ fontSize: 15, color: C.textMid, maxWidth: 560, margin: "0 auto 28px" }}>
          Clean air is a right. Your gift helps us protect it for the communities breathing the worst of it.
        </p>
        <a href={`/donate?program=${LOCKED_PROGRAM}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.gold, color: "#1a1a1a", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, padding: "16px 40px", borderRadius: 12, textDecoration: "none" }}>
          <HeartHandshake size={18} /> Support Clean Air
        </a>
      </section>

      {/* FAQ */}
      <FadeIn>
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="tag" style={{ color: C.sky, marginBottom: 8 }}>Frequently Asked Questions</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700 }}>About Shudhvayu</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}`, padding: "18px 0", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="sans" style={{ fontSize: 15, fontWeight: 600, paddingRight: 16 }}>{faq.q}</h3>
                <span className="sans" style={{ fontSize: 20, color: C.sky, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
              </div>
              {openFaq === i && <p className="sans" style={{ fontSize: 14, lineHeight: 1.7, color: C.textMid, paddingTop: 12 }}>{faq.a}</p>}
            </div>
          ))}
        </section>
      </FadeIn>

      {/* BOTTOM CTA */}
      <FadeIn>
        <section style={{ background: C.cream, padding: "60px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, marginBottom: 12 }}>Every vehicle is a chance to clean the air.</h2>
          <p className="sans" style={{ fontSize: 15, color: C.textMid, marginBottom: 24 }}>Donate to put more filters on more vehicles. Or get one installed on yours — for free.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/donate?program=Shudhvayu" className="btn-primary" style={{ padding: "14px 36px", fontSize: 15 }}>Donate for Clean Air</a>
            <a href="#install" className="btn-outline" style={{ padding: "12px 28px", fontSize: 14 }}>Get Free Installation</a>
          </div>
        </section>
      </FadeIn>

      <Footer />
    </div>
  );
}