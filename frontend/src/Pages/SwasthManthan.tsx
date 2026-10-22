import { useState, useEffect, useRef } from "react";
import sm1  from "../assets/swasthmanthan/Swasthmanthan (1).webp";
import sm2  from "../assets/swasthmanthan/Swasthmanthan (2).webp";
import sm3  from "../assets/swasthmanthan/Swasthmanthan (3).webp";
import sm4  from "../assets/swasthmanthan/Swasthmanthan (4).webp";
import sm5  from "../assets/swasthmanthan/Swasthmanthan (5).webp";
import sm6  from "../assets/swasthmanthan/Swasthmanthan (6).webp";
import sm7  from "../assets/swasthmanthan/Swasthmanthan (7).webp";
import sm8  from "../assets/swasthmanthan/Swasthmanthan (8).webp";
import sm9  from "../assets/swasthmanthan/Swasthmanthan (9).webp";
import sm10 from "../assets/swasthmanthan/Swasthmanthan (10).webp";
import sm11 from "../assets/swasthmanthan/Swasthmanthan (11).webp";
import sm12 from "../assets/swasthmanthan/Swasthmanthan (12).webp";
import sm13 from "../assets/swasthmanthan/Swasthmanthan (13).webp";
import sm14 from "../assets/swasthmanthan/Swasthmanthan (14).webp";
import sm15 from "../assets/swasthmanthan/Swasthmanthan (15).webp";
import sm16 from "../assets/swasthmanthan/Swasthmanthan (16).webp";
import sm17 from "../assets/swasthmanthan/Swasthmanthan (17).webp";
import sm18 from "../assets/swasthmanthan/Swasthmanthan (18).webp";
import sm19 from "../assets/swasthmanthan/Swasthmanthan (19).webp";
import sm20 from "../assets/swasthmanthan/Swasthmanthan (20).webp";
import sm21 from "../assets/swasthmanthan/Swasthmanthan (21).webp";
import sm22 from "../assets/swasthmanthan/Swasthmanthan (22).webp";
import sm23 from "../assets/swasthmanthan/Swasthmanthan (23).webp";
import sm24 from "../assets/swasthmanthan/Swasthmanthan (24).jpeg";
import sm25 from "../assets/swasthmanthan/Swasthmanthan (25).jpeg";
import sm26 from "../assets/swasthmanthan/Swasthmanthan (26).jpg";
import sm27 from "../assets/swasthmanthan/Swasthmanthan (27).jpg";
import sm28 from "../assets/swasthmanthan/Swasthmanthan (28).jpg";
import sm29 from "../assets/swasthmanthan/Swasthmanthan (29).jpg";
import sm30 from "../assets/swasthmanthan/Swasthmanthan (30).jpg";
import sm31 from "../assets/swasthmanthan/Swasthmanthan (31).jpeg";
import sm32 from "../assets/swasthmanthan/Swasthmanthan (32).jpeg";
import sm34 from "../assets/swasthmanthan/Swasthmanthan (34).jpeg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Users, Microscope, Tent, Baby, Megaphone, Droplets, Ribbon, HeartPulse, FlaskConical, Star, Bike, BarChart3, Pill, ClipboardList, Sun, Thermometer, Mountain, Leaf, Globe, HeartHandshake, Building2, Zap, Dna } from "lucide-react";
import partnerGoogle from "../assets/partners/google.jpg";
import partnerPwC from "../assets/partners/pwc.png";
import partnerICMR from "../assets/partners/icmr.png";
import partnerTata from "../assets/partners/tata_trust.png";
import partnerReliance from "../assets/partners/Reliance_Foundation.png";
import partnerLupin from "../assets/partners/Lupin_Foundation.png";
import partnerDLF from "../assets/partners/DLF_Foundation.png";
import partnerRoko from "../assets/partners/roko_cancer.png";
import partnerSeva from "../assets/partners/seva_bharti.png";
import partnerYWC from "../assets/partners/YouWeCan.png";
import partnerWish from "../assets/partners/Wish_Foundation.png";
import partnerDocOnline from "../assets/partners/DocOnline.png";
import partnerMediBuddy from "../assets/partners/MediBuddy.jpg";
import partnerPowerGrid from "../assets/partners/Powergrid.png";

const C = {
  forest: "#1B6B3A", forestDark: "#145A2F", forestDeep: "#0E4422",
  leaf: "#2E8B4F", gold: "#C8963E", goldSoft: "#D4A854", goldLight: "#E8C76A",
  warmBg: "#FDFBF7", cream: "#F8F5EE", white: "#FFFFFF",
  text: "#1F2937", textMid: "#4B5563", textLight: "#6B7280", border: "#E8E4DC",
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

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let current = 0; const step = Math.ceil(end / 50);
    const timer = setInterval(() => { current += step; if (current >= end) { setValue(end); clearInterval(timer); } else setValue(current); }, 30);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span ref={ref}>{value.toLocaleString("en-IN")}{suffix}</span>;
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
const LOCKED_PROGRAM = "Swasthmanthan";


// ─── Main Page ────────────────────────────────────────────────────────────────
const VIDEO_ID = "Qs3J7Ui5j5g";

export default function SwasthmanthanPage() {
  useEffect(() => { document.title = "Swasthmanthan - Last Mile Care | Swasthgram"; }, []);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const partners = [
    { name: "Indian Army", sub: "5,000+ Labs in Daily Use", icon: <Star size={20} color="#fff" /> },
    { name: "PwC", sub: "Technology Validated", icon: <BarChart3 size={20} color="#fff" /> },
    { name: "Medanta", sub: "Referral & Treatment Partner", icon: <Building2 size={20} color="#fff" /> },
    { name: "Powergrid Corp", sub: "CSR Partner", icon: <Zap size={20} color="#fff" /> },
    { name: "Reliance Foundation", sub: "Camp Partner", icon: <Globe size={20} color="#fff" /> },
    { name: "BIRAC / Dept. of Biotech", sub: "Innovation Endorsed", icon: <Dna size={20} color="#fff" /> },
  ];

  const impactStats = [
    { end: 111392, suffix: "+", label: "People Screened", icon: <Users size={22} color="#D4A854" /> },
    { end: 21750, suffix: "+", label: "Cancer Screenings Conducted", icon: <Microscope size={22} color="#D4A854" /> },
    { end: 9360, suffix: "+", label: "Health Camps Organized", icon: <Tent size={22} color="#D4A854" /> },
    { end: 14300, suffix: "+", label: "Total Community Screenings", icon: <FlaskConical size={22} color="#D4A854" /> },
    { end: 14500, suffix: "+", label: "Oral Examinations", icon: <ClipboardList size={22} color="#D4A854" /> },
    { end: 3800, suffix: "+", label: "Cancer Screening Camps", icon: <Ribbon size={22} color="#D4A854" /> },
    { end: 7000, suffix: "+", label: "Pregnant Women Screened", icon: <Baby size={22} color="#D4A854" /> },
    { end: 895, suffix: "+", label: "Awareness Programs", icon: <Megaphone size={22} color="#D4A854" /> },
  ];

  const diagnostics = [
    { cat: "Blood & Biochemistry", tests: "Complete Blood Count, Liver Function (LFT), Kidney Function (KFT), Lipid Profile, Blood Glucose, HbA1c, Electrolytes", icon: <Droplets size={28} color={C.forest} /> },
    { cat: "Cancer Screening", tests: "Oral cancer, Cervical cancer, Breast examination, Rapid Pap smear, Buccal mucosa analysis, Cancer markers", icon: <Ribbon size={28} color={C.forest} /> },
    { cat: "Urine & Serology", tests: "Complete urine analysis, Protein/Albumin, Serology screening, Pregnancy screening, Infection markers", icon: <FlaskConical size={28} color={C.forest} /> },
    { cat: "Cardio & Vitals", tests: "12-lead ECG, Blood Pressure, BMI, SpO2, Temperature, Heart rate monitoring", icon: <HeartPulse size={28} color={C.forest} /> },
    { cat: "Microscopy", tests: "Digital microscope, Peripheral blood smear, Sputum for TB, Fungal analysis, Sickle cell screening, Gram staining", icon: <Microscope size={28} color={C.forest} /> },
    { cat: "Special Programs", tests: "Pregnant women screening, Child nutrition assessment, Elderly health checkups, Disaster zone health screenings", icon: <Star size={28} color={C.forest} /> },
  ];

  const testimonials = [
    { quote: "My mother had early-stage oral cancer — discovered at a Swasthgram camp. With no hospital within 80 km, the Health Unit on bike arranged her care at Medanta just in time.", name: "Rajesh K.", location: "Village in Uttarakhand" },
    { quote: "I had no idea my kidney function was deteriorating. The free screening caught it before it became critical. I owe my health to this camp that rode into our village on a motorbike.", name: "Sunita D.", location: "Tribal area, Jharkhand" },
    { quote: "We've deployed over 5,000 Lab-in-a-Box units across operations. The reliability and accuracy in extreme field conditions is unmatched. This technology works where nothing else can.", name: "Senior Officer", location: "Indian Army Medical Corps" },
  ];

  const faqs = [
    { q: "What diseases does Swasthmanthan screen for?", a: "Cancer (oral, cervical, breast), diabetes, kidney disease, liver disease, heart conditions via ECG, blood disorders, pregnancy complications, and more — over 100 diagnostic parameters covered." },
    { q: "How does the Health Unit on Bike actually work?", a: "A complete health screening unitis retrofitted onto a motorbike — solar-powered, with a digital microscope, biochemistry analyzer, urine analyzer, ECG machine, and bio-waste management. It rides into terrain no ambulance or mobile van can reach." },
    { q: "Is the screening completely free?", a: "Yes, 100% free for all beneficiaries. Health camps are funded by donors and CSR partners. No one is ever charged." },
    { q: "What happens if a  health concern is identified?", a: "Critical community members are immediately referred to partner hospitals like Medanta for subsidized or free care. All data is digitally recorded for follow-up. Community health workers ensure continuity of care." },
    { q: "Where are the health camps held?", a: "Remote villages, tribal areas, urban slums, residential welfare associations, schools, factories, disaster zones — anywhere there is a community without easy access to health screening services." },
    { q: "How can I verify Swasthgram's credibility?", a: "We are 80G & 12A certified in India, 501(c)(3) in the USA. PwC validated our technology after screening 150 global solutions. The Indian Army uses 5,000+ of our units daily. We presented to 18 countries in Washington D.C." },
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
        .btn-primary { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; background: ${C.forest}; color: #fff; border: none; padding: 13px 28px; border-radius: 8px; cursor: pointer; transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: ${C.forestDark}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(27,107,58,0.25); }
        .btn-outline { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px; background: transparent; color: ${C.forest}; border: 2px solid ${C.forest}; padding: 11px 24px; border-radius: 8px; cursor: pointer; transition: all 0.25s; }
        .btn-outline:hover { background: ${C.forest}; color: #fff; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (max-width: 900px) {
          .hero-flex { flex-direction: column !important; text-align: center !important; }
          .hero-flex > div:first-child { align-items: center !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-impact { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-cta { justify-content: center !important; }
          .partner-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .photo-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .donate-grid { grid-template-columns: 1fr !important; }
          .donate-form-row { grid-template-columns: 1fr !important; }
          .donate-impact-card { display: none !important; }
        }
        @media (min-width: 901px) {
          .mobile-only { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <Header />

      {/* HERO */}
      <section style={{ minHeight: "85vh", display: "flex", alignItems: "center", background: `linear-gradient(170deg, #080c0a 0%, ${C.forestDeep} 60%, ${C.forestDark} 100%)`, paddingTop: 72, position: "relative", overflow: "hidden" }}>
        <Breadcrumb items={[{ label: "Programs" }, { label: "Swasthmanthan" }]} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px", width: "100%", position: "relative", zIndex: 2 }}>
          <div className="hero-flex" style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <div style={{ flex: "1 1 50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
              <div className="tag" style={{ color: C.goldSoft, background: "rgba(200,150,62,0.2)", padding: "5px 12px", borderRadius: 16, fontSize: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Bike size={12} color={C.goldSoft} /> Swasthmanthan · Flagship Program
              </div>
              <h1 style={{ fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 700, lineHeight: 1.12, color: "#fff" }}>
                We've screened<br /><span style={{ color: C.goldLight }}>1,11,392 people</span><br />no hospital could reach.
              </h1>
              <p className="sans" style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.65)", maxWidth: 460 }}>
                Cancer. Diabetes. Kidney failure. All detected at the doorstep — in jungles, mountains, and tribal villages — by the world's only Health Unit on Bike. Solar-powered. 100+  health checks Zero electricity needed.
              </p>
              <div className="hero-cta" style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                <a href="/donate?program=Swasthmanthan" className="btn-primary" style={{ background: C.gold, color: "#1a1a1a", padding: "14px 32px", fontSize: 15 }}>Fund a Health Camp</a>
                <a href="#how" className="btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}>How It Works →</a>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
                {["PwC Validated", "Indian Army Approved", "80G & 501(c)(3)", "Since 2018"].map((text, i) => (
                  <div key={i} className="sans" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.goldSoft }} />{text}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 50%", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "min(480px, 90vw)", borderRadius: 16, overflow: "hidden", position: "relative", border: "2px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                <img src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`} alt="Watch The Health Unit on Bike Story" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
                <div onClick={() => window.open(`https://www.youtube.com/watch?v=${VIDEO_ID}`, "_blank")} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "rgba(0,0,0,0.35)" }}>
                  <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(0,0,0,0.3)", animation: "pulse 2s ease-in-out infinite", transition: "transform 0.2s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.transform = "scale(1)")}>
                    <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: `22px solid ${C.forest}`, marginLeft: 5 }} />
                  </div>
                  <div className="sans" style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginTop: 12, letterSpacing: 1 }}>WATCH: THE HEALTH UNIT ON BIKE STORY</div>
                  <div className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Real camps, real lives</div>
                </div>
                <div className="sans" style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.8)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <Bike size={18} color="#fff" />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Health Unit on Bike</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Solar · 100+ Health Screenings · Jungle-ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER LOGOS */}
      <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "36px 0", overflow: "hidden" }}>
        <p className="sans" style={{ fontSize: 10, color: C.textLight, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24, textAlign: "center" }}>Swasthmanthan is Trusted &amp; Validated By</p>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: "linear-gradient(to right, #fff, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: "linear-gradient(to left, #fff, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ display: "flex", gap: 14, animation: "marquee 35s linear infinite", width: "max-content" }}>
            {[
              { name: "Google for Nonprofits", img: partnerGoogle },
              { name: "PwC", img: partnerPwC },
              { name: "ICMR", img: partnerICMR },
              { name: "Tata Trusts", img: partnerTata },
              { name: "Reliance Foundation", img: partnerReliance },
              { name: "Lupin Foundation", img: partnerLupin },
              { name: "DLF Foundation", img: partnerDLF },
              { name: "Roko Cancer", img: partnerRoko },
              { name: "Seva Bharti", img: partnerSeva },
              { name: "YouWeCan", img: partnerYWC },
              { name: "Wish Foundation", img: partnerWish },
              { name: "DocOnline", img: partnerDocOnline },
              { name: "MediBuddy", img: partnerMediBuddy },
              { name: "PowerGrid", img: partnerPowerGrid },
              { name: "Google for Nonprofits", img: partnerGoogle },
              { name: "PwC", img: partnerPwC },
              { name: "ICMR", img: partnerICMR },
              { name: "Tata Trusts", img: partnerTata },
              { name: "Reliance Foundation", img: partnerReliance },
              { name: "Lupin Foundation", img: partnerLupin },
              { name: "DLF Foundation", img: partnerDLF },
              { name: "Roko Cancer", img: partnerRoko },
              { name: "Seva Bharti", img: partnerSeva },
              { name: "YouWeCan", img: partnerYWC },
              { name: "Wish Foundation", img: partnerWish },
              { name: "DocOnline", img: partnerDocOnline },
              { name: "MediBuddy", img: partnerMediBuddy },
              { name: "PowerGrid", img: partnerPowerGrid },
            ].map((p, i) => (
              <div key={i} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 180, height: 76, borderRadius: 12, background: C.white, border: `1px solid ${C.border}`, padding: "10px 24px", transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = C.gold; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = C.border; }}>
                <img src={p.img} alt={p.name} style={{ maxHeight: 44, maxWidth: 130, objectFit: "contain", filter: "grayscale(20%)", opacity: 0.8 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <FadeIn>
        <section style={{ maxWidth: 840, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div className="tag" style={{ color: C.red, marginBottom: 12, background: "rgba(220,38,38,0.06)", padding: "5px 14px", borderRadius: 16 }}>The Problem</div>
          <h2 style={{ fontSize: "clamp(24px, 3.8vw, 38px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
            70% of India lives in rural areas.<br /><span style={{ color: C.red }}>Most have never had a single health check.</span>
          </h2>
          <p className="sans" style={{ fontSize: 16, lineHeight: 1.8, color: C.textMid, maxWidth: 620, margin: "0 auto 24px" }}>
            No primary care centre. No paved roads. No electricity. The nearest health centre can be a full day's journey away. Cancer, diabetes, kidney failure — all go undetected until it's too late.
          </p>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 700, margin: "0 auto" }}>
            {[{ stat: "56%", label: "of rural residents have no health insurance" }, { stat: "1 Day", label: "average travel time to nearest primary care centre" }, { stat: "0", label: "community health facilities in most tribal villages" }].map((s, i) => (
              <div key={i} style={{ background: C.cream, borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                <div className="sans" style={{ fontSize: 28, fontWeight: 800, color: C.red }}>{s.stat}</div>
                <div className="sans" style={{ fontSize: 11, color: C.textMid, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* HOW IT WORKS */}
      <FadeIn>
        <section id="how" style={{ background: C.cream, padding: "80px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="tag" style={{ color: C.forest, marginBottom: 8 }}>How Swasthmanthan Works</div>
              <h2 style={{ fontSize: "clamp(24px, 3.2vw, 34px)", fontWeight: 700 }}>A health screening unit that rides to you </h2>
              <p className="sans" style={{ fontSize: 15, color: C.textMid, marginTop: 10, maxWidth: 560, margin: "10px auto 0" }}>Past efforts — mobile vans, outreach camps — failed because they couldn't navigate India's terrain. The Health Unit on Bike solves every one of these challenges.</p>
            </div>
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { icon: <Bike size={24} color="#fff" />, title: "Health Unit Deploys", desc: "A solar-powered health screening unitrides into remote villages, jungles, and tribal areas — terrain no ambulance can reach. Over 100+ health screenings performed on-site, at the doorstep." },
                { icon: <ClipboardList size={24} color="#fff" />, title: "Free Screening Begins", desc: "Cancer screening (oral, cervical, breast), blood, kidney & liver function, diabetes, ECG, BMI — all completely free. No one is ever turned away or charged." },
                { icon: <BarChart3 size={24} color="#fff" />, title: "Digital Records Created", desc: "Every result is digitally recorded with GPS coordinates. Critical community members are immediately flagged and referred to partner hospitals like Medanta for subsidized care." },
                { icon: <Pill size={24} color="#fff" />, title: "Care Guidance & Follow-up", desc: "Charitable dispensaries provide medicines. Community health workers trained by Saksham ensure ongoing awareness and follow-up care. No one is left behind." },
              ].map((step, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 14, padding: "28px 24px", border: `1px solid ${C.border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: `linear-gradient(135deg, ${C.forest}, ${C.leaf})`, display: "flex", alignItems: "center", justifyContent: "center" }}>{step.icon}</div>
                  <div>
                    <h4 className="sans" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{step.title}</h4>
                    <p className="sans" style={{ fontSize: 13, lineHeight: 1.65, color: C.textMid }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, maxWidth: 700, margin: "32px auto 0" }}>
              {[{ icon: <Sun size={20} color={C.forest} />, label: "Solar-Powered" }, { icon: <Thermometer size={20} color={C.forest} />, label: "No AC Needed" }, { icon: <Mountain size={20} color={C.forest} />, label: "Jungle & Mountain Ready" }, { icon: <Leaf size={20} color={C.forest} />, label: "Carbon Net Zero" }].map((f, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 10, padding: "14px 10px", textAlign: "center", border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{f.icon}</div>
                  <div className="sans" style={{ fontSize: 11, fontWeight: 600, color: C.textMid }}>{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* IMPACT */}
      <section id="impact" style={{ background: C.forest, padding: "64px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="tag" style={{ color: C.goldSoft, marginBottom: 8 }}>Real Impact, Real Numbers</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, color: "#fff" }}>Every number is a life touched</h2>
          </div>
          <div className="grid-impact" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {impactStats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center", padding: "22px 12px", background: "rgba(255,255,255,0.06)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{stat.icon}</div>
                <div className="sans" style={{ fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: 700, color: C.goldSoft, lineHeight: 1 }}><AnimatedCounter end={stat.end} suffix={stat.suffix} /></div>
                <div className="sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section style={{ background: C.warmBg, padding: "64px 0", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: 32, padding: "0 24px" }}>
          <div className="tag" style={{ color: C.forest, marginBottom: 8 }}>Swasthmanthan in Action</div>
          <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700 }}>From villages to lives saved.</h2>
        </div>
        <style>{`
          @keyframes sm-fwd { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes sm-rev { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
          .sm-row1 { display: flex; gap: 12px; width: max-content; animation: sm-fwd 38s linear infinite; }
          .sm-row2 { display: flex; gap: 12px; width: max-content; animation: sm-rev 44s linear infinite; margin-top: 12px; }
          .sm-row1:hover, .sm-row2:hover { animation-play-state: paused; }
        `}</style>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #FDFBF7, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #FDFBF7, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="sm-row1">
            {[...Array(2)].map((_, r) =>
              [
                { src: sm1,  w: 220 }, { src: sm2,  w: 300 }, { src: sm3,  w: 220 },
                { src: sm4,  w: 260 }, { src: sm5,  w: 220 }, { src: sm6,  w: 300 },
                { src: sm7,  w: 220 }, { src: sm8,  w: 240 }, { src: sm9,  w: 220 },
                { src: sm10, w: 280 }, { src: sm11, w: 220 }, { src: sm12, w: 260 },
                { src: sm13, w: 220 }, { src: sm14, w: 200 }, { src: sm15, w: 240 },
                { src: sm16, w: 260 }, { src: sm17, w: 220 },
              ].map((img, i) => (
                <div key={`sm-r1-${r}-${i}`} style={{ flexShrink: 0, width: img.w, height: 190, borderRadius: 12, overflow: "hidden", background: "#1B6B3A" }}>
                  <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #FDFBF7, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #FDFBF7, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="sm-row2">
            {[...Array(2)].map((_, r) =>
              [
                { src: sm18, w: 300 }, { src: sm19, w: 220 }, { src: sm20, w: 200 },
                { src: sm21, w: 260 }, { src: sm22, w: 220 }, { src: sm23, w: 300 },
                { src: sm24, w: 220 }, { src: sm25, w: 260 }, { src: sm26, w: 300 },
                { src: sm27, w: 220 }, { src: sm28, w: 260 }, { src: sm29, w: 300 },
                { src: sm30, w: 220 }, { src: sm31, w: 240 }, { src: sm32, w: 220 },
                { src: sm34, w: 260 },
              ].map((img, i) => (
                <div key={`sm-r2-${r}-${i}`} style={{ flexShrink: 0, width: img.w, height: 190, borderRadius: 12, overflow: "hidden", background: "#1B6B3A" }}>
                  <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* WHAT WE TEST */}
      <FadeIn>
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="tag" style={{ color: C.gold, marginBottom: 8 }}>Health Screening Capabilities</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700 }}>100+  health checks One motorbike. Your doorstep.</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {diagnostics.map((d, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div style={{ background: C.white, borderRadius: 14, padding: "26px 22px", border: `1px solid ${C.border}`, height: "100%" }}>
                  <div style={{ marginBottom: 10 }}>{d.icon}</div>
                  <h4 className="sans" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{d.cat}</h4>
                  <p className="sans" style={{ fontSize: 12, lineHeight: 1.7, color: C.textMid }}>{d.tests}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* TESTIMONIALS */}
      <FadeIn>
        <section style={{ background: C.cream, padding: "80px 24px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="tag" style={{ color: C.forest, marginBottom: 8 }}>Stories from the Ground</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700 }}>Real people. Real impact.</h2>
            </div>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {testimonials.map((t, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div style={{ background: C.white, borderRadius: 14, padding: "30px 24px", border: `1px solid ${C.border}`, height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 28, color: C.forest, lineHeight: 1, marginBottom: 14 }}>"</div>
                    <p style={{ fontSize: 15, lineHeight: 1.75, color: C.textMid, fontStyle: "italic", flex: 1, marginBottom: 20 }}>{t.quote}</p>
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                      <div className="sans" style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                      <div className="sans" style={{ fontSize: 12, color: C.forest, fontWeight: 500 }}>{t.location}</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* DONATE */}
      <section id="donate" style={{ background: C.warmBg, padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: 12 }}>
          Every donation deploys a Health Unit on Bike.
        </h2>
        <p className="sans" style={{ fontSize: 15, color: C.textLight, maxWidth: 560, margin: "0 auto 28px" }}>
          One bike. One village. Hundreds of lives screened for the first time.
        </p>
        <a href={`/donate?program=${LOCKED_PROGRAM}`} className="btn-primary" style={{ background: C.gold, color: "#1a1a1a", padding: "16px 40px", fontSize: 16 }}>Fund a Health Camp Now</a>
      </section>

      {/* FAQ */}
      <FadeIn>
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="tag" style={{ color: C.gold, marginBottom: 8 }}>Frequently Asked Questions</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700 }}>About Swasthmanthan</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}`, padding: "18px 0", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="sans" style={{ fontSize: 15, fontWeight: 600, paddingRight: 16 }}>{faq.q}</h3>
                <span className="sans" style={{ fontSize: 20, color: C.forest, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
              </div>
              {openFaq === i && <p className="sans" style={{ fontSize: 14, lineHeight: 1.7, color: C.textMid, paddingTop: 12 }}>{faq.a}</p>}
            </div>
          ))}
        </section>
      </FadeIn>

      {/* BOTTOM CTA */}
      <FadeIn>
        <section style={{ background: C.cream, padding: "60px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, marginBottom: 12 }}>Every donation deploys a Health Unit on Bike.</h2>
          <p className="sans" style={{ fontSize: 15, color: C.textMid, marginBottom: 24 }}>One bike. One village. Hundreds of lives screened for the first time.</p>
          <a href="/donate?program=Swasthmanthan" className="btn-primary" style={{ background: C.gold, color: "#1a1a1a", padding: "16px 40px", fontSize: 16 }}>Fund a Health Camp Now</a>
        </section>
      </FadeIn>

      <Footer />
    </div>
  );
}