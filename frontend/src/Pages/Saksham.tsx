import { useState, useEffect, useRef } from "react";
import sk1a from "../assets/saksham/saksham (1).jpeg";
import sk1b from "../assets/saksham/saksham (1).jpg";
import sk1c from "../assets/saksham/saksham (1).png";
import sk1d from "../assets/saksham/saksham (1).webp";
import sk2a from "../assets/saksham/saksham (2).jpeg";
import sk2b from "../assets/saksham/saksham (2).jpg";
import sk2c from "../assets/saksham/saksham (2).png";
import sk3  from "../assets/saksham/saksham (3).jpg";
import sk4  from "../assets/saksham/saksham (4).jpg";
import sk5  from "../assets/saksham/saksham (5).jpg";
import sk6  from "../assets/saksham/saksham (6).jpg";
import sk7  from "../assets/saksham/saksham (7).jpg";
import sk8  from "../assets/saksham/saksham (8).jpg";
import sk9  from "../assets/saksham/saksham (9).jpg";
import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import { GraduationCap, Handshake, Briefcase, Hospital, Globe, Microscope, HeartHandshake } from "lucide-react";

const C = {
  forest: "#1B6B3A", forestDark: "#145A2F", forestDeep: "#0E4422",
  leaf: "#2E8B4F", gold: "#C8963E", goldSoft: "#D4A854", goldLight: "#E8C76A",
  warmBg: "#FDFBF7", cream: "#F8F5EE", white: "#FFFFFF",
  text: "#1F2937", textMid: "#4B5563", textLight: "#6B7280", border: "#E8E4DC",
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
const LOCKED_PROGRAM = "Saksham";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SakshamPage() {
  useEffect(() => { document.title = "Saksham – Youth Empowerment & Skilling | Swasthgram"; }, []);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const impactStats = [
    { end: 2500, suffix: "+", label: "Youth Trained" },
    { end: 1050, suffix: "+", label: "Placed in Medical Jobs" },
    { end: 95, suffix: " Cr", label: "Indians to Serve (Mission)" },
    { end: 500000, suffix: "+", label: "Lab Tech Jobs Target" },
  ];

  const pillars = [
    { icon: <GraduationCap size={28} color={C.forest} />, title: "Skill Development", desc: "Comprehensive training in basic health screening, first aid, community care, and basic health outreach — compressed from 4 years to 4 intensive months." },
    { icon: <Handshake size={28} color={C.forest} />, title: "Government Partner", desc: "Recognized by India's Dept. of Biotechnology. Endorsed on national TV. Officially validated as a nationally scalable healthcare skilling model." },
    { icon: <Briefcase size={28} color={C.forest} />, title: "Employment", desc: "Over 1,050 graduates placed in real medical jobs at partner hospitals. Building a pipeline of SwasthSaathis and SwasthRakshaks across rural India." },
    { icon: <Hospital size={28} color={C.forest} />, title: "Disaster Relief", desc: "Saksham volunteers provided round-the-clock medical aid during natural calamities in Uttarakhand, Nepal, and Kerala." },
    { icon: <Globe size={28} color={C.forest} />, title: "Community-Rooted", desc: "SwasthRakshaks are recruited from within local communities, ensuring solutions are culturally relevant and deeply impactful on the ground." },
    { icon: <Microscope size={28} color={C.forest} />, title: "Community Health Worker", desc: "Addressing the critical shortage of trained healthcare workers in rural India, targeting creation of 5 lakh lab technician jobs over the next 5 years." },
  ];

  const journey = [
    { step: "01", title: "Selection", desc: "Youth from underserved communities are identified and selected based on aptitude and commitment to healthcare service." },
    { step: "02", title: "4-Month Intensive Training", desc: "8 years of R&D compressed into 4 intensive months— health screening, first aid, community care, and basic health outreach." },
    { step: "03", title: "Certification", desc: "Graduates receive industry-recognized certification in healthcare skills, validated by partner institutions." },
    { step: "04", title: "Placement", desc: "Empowered with career opportunities & 1,050 lives transformed through meaningful placement." },
    { step: "05", title: "Community Deployment", desc: "SwasthRakshaks return to their communities delivering doorstep screening & community care access to millions." },
  ];

  const faqs = [
    { q: "Who can apply for the Saksham program?", a: "Youth from underserved and marginalized communities across rural India. No prior medical education is required — just aptitude and commitment." },
    { q: "How long is the training?", a: "4 intensive months. Swasthgram's 8 years of R&D compressed a traditional 4-year medical curriculum into this format without compromising quality." },
    { q: "Where are graduates placed?", a: "Empowered with career opportunities at partner hospitals and clinics. Over 1,050 lives transformed through meaningful placement." },
    { q: "What is Mission 95 Crore?", a: "Saksham's ambitious goal to train enough healthcare workers to provide doorstep healthcare access to 95 crore Indians within the next five years." },
    { q: "How can I support the Saksham program?", a: "Donate via Razorpay (India) or Stripe (US). Your contribution directly funds training, certification, and placement of youth healthcare workers." },
  ];

  return (
    <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", background: C.warmBg, color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .sans { font-family: 'Inter', sans-serif !important; }
        .tag { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
        @media (max-width: 900px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .donate-grid { grid-template-columns: 1fr !important; }
          .donate-form-row { grid-template-columns: 1fr !important; }
          .donate-impact-card { display: none !important; }
        }
      `}</style>
      <Header />

      {/* HERO */}
      <section style={{ background: `linear-gradient(160deg, ${C.forestDeep} 0%, ${C.forest} 60%, ${C.leaf} 100%)`, padding: "88px 24px 72px", textAlign: "center", position: "relative" }}>
        <Breadcrumb items={[{ label: "Programs" }, { label: "Saksham" }]} />
        <FadeIn>
          <div className="tag" style={{ color: C.goldSoft, marginBottom: 14 }}>Swasthgram Programme</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            Saksham<br /><span style={{ color: C.goldLight }}>Youth Empowerment & Skilling</span>
          </h1>
          <p className="sans" style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.75 }}>
            Transforming underserved youth into trained community health workers — delivering doorstep health screenings to 95 crore Indians..
          </p>
          <a href="/donate?program=Saksham" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.gold, color: "#1a1a1a", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15, padding: "14px 32px", borderRadius: 10, textDecoration: "none" }}>
            <HeartHandshake size={18} /> Support Saksham
          </a>
        </FadeIn>
      </section>

      {/* IMPACT STATS */}
      <FadeIn>
        <section style={{ background: C.cream, padding: "60px 24px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="grid-impact">
            {impactStats.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "24px 16px", background: C.white, borderRadius: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: "clamp(26px,3vw,34px)", fontWeight: 700, color: C.forest, marginBottom: 6 }}>
                  <AnimatedCounter end={s.end} suffix={s.suffix} />
                </div>
                <div className="sans" style={{ fontSize: 13, color: C.textMid }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* GALLERY */}
      <section style={{ background: C.warmBg, padding: "64px 0", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: 32, padding: "0 24px" }}>
          <div className="tag" style={{ color: C.forest, marginBottom: 8 }}>Saksham in Action</div>
          <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700 }}>Training. Placing. Empowering.</h2>
        </div>
        <style>{`
          @keyframes sk-fwd { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes sk-rev { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
          .sk-row1 { display: flex; gap: 12px; width: max-content; animation: sk-fwd 36s linear infinite; }
          .sk-row2 { display: flex; gap: 12px; width: max-content; animation: sk-rev 42s linear infinite; margin-top: 12px; }
          .sk-row1:hover, .sk-row2:hover { animation-play-state: paused; }
        `}</style>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #FDFBF7, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #FDFBF7, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="sk-row1">
            {[...Array(2)].map((_, r) =>
              [
                { src: sk1a, w: 240 }, { src: sk1b, w: 220 }, { src: sk1c, w: 260 },
                { src: sk2a, w: 220 }, { src: sk2b, w: 300 }, { src: sk3,  w: 220 },
                { src: sk4,  w: 260 },
              ].map((img, i) => (
                <div key={`sk-r1-${r}-${i}`} style={{ flexShrink: 0, width: img.w, height: 190, borderRadius: 12, overflow: "hidden", background: C.forest }}>
                  <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #FDFBF7, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #FDFBF7, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="sk-row2">
            {[...Array(2)].map((_, r) =>
              [
                { src: sk5,  w: 300 }, { src: sk6,  w: 220 }, { src: sk7,  w: 260 },
                { src: sk8,  w: 220 }, { src: sk9,  w: 300 }, { src: sk1d, w: 220 },
                { src: sk2c, w: 240 },
              ].map((img, i) => (
                <div key={`sk-r2-${r}-${i}`} style={{ flexShrink: 0, width: img.w, height: 190, borderRadius: 12, overflow: "hidden", background: C.forest }}>
                  <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <FadeIn>
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="tag" style={{ color: C.gold, marginBottom: 6 }}>What We Do</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700 }}>The six pillars of Saksham</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="grid-3">
            {pillars.map((p, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 14, padding: 24, border: `1px solid ${C.border}` }}>
                <div style={{ marginBottom: 14 }}>{p.icon}</div>
                <h3 className="sans" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                <p className="sans" style={{ fontSize: 13, lineHeight: 1.65, color: C.textMid }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* JOURNEY */}
      <FadeIn>
        <section style={{ background: C.cream, padding: "72px 24px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="tag" style={{ color: C.gold, marginBottom: 6 }}>The Process</div>
              <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700 }}>From selection to service</h2>
            </div>
            {journey.map((item, i) => (
              <div key={i}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "20px 0" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.forest, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{item.step}</div>
                  <div>
                    <h3 className="sans" style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                    <p className="sans" style={{ fontSize: 13, lineHeight: 1.55, color: C.textMid }}>{item.desc}</p>
                  </div>
                </div>
                {i < journey.length - 1 && <div style={{ textAlign: "center", padding: "4px 0", fontSize: 18, color: C.forest, fontWeight: 700 }}>↓</div>}
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* MISSION 95 CRORE */}
      <FadeIn>
        <section style={{ background: `linear-gradient(135deg, ${C.forestDeep}, ${C.forest})`, padding: "72px 24px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
            <div className="tag" style={{ color: C.goldSoft, marginBottom: 10 }}>Ambitious National Goal</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>Skill. Serve. Strengthen India.</h2>
            <p className="sans" style={{ fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.7)", maxWidth: 640, margin: "0 auto 32px" }}>
              The mission aims to serve 95 crore Indians at their doorsteps and create 5 lakh lab technician jobs over the next 5 years.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 600, margin: "0 auto" }}>
              {[{ n: "95 Crore", l: "Indians to Serve" }, { n: "5 Lakh", l: "Jobs to Create" }, { n: "5 Years", l: "Target Timeline" }].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "20px 12px", border: "1px solid rgba(255,255,255,0.12)", textAlign: "center" }}>
                  <div className="sans" style={{ fontSize: 22, fontWeight: 800, color: C.goldLight, marginBottom: 4 }}>{s.n}</div>
                  <div className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* LEADERSHIP */}
      <FadeIn>
        <section style={{ background: C.cream, padding: "72px 24px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="tag" style={{ color: C.gold, marginBottom: 6 }}>Leadership</div>
              <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700 }}>The people behind the mission</h2>
            </div>
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { name: "Amit Bhatnagar", role: "Chief Care Architect & Founder", quote: "In every corner of our nation, our teams bring a deep-seated commitment — a promise that no matter where you live, you will never be forgotten." },
                { name: "Deepti Bhatnagar", role: "Chief Compassion Officer & Director", quote: "We carry the belief that everyone, irrespective of where they live, deserves access to quality healthcare — a promise that ensures affordability, inclusivity, and scalability for all." },
              ].map((leader, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 14, padding: 30, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 28, color: C.forest, lineHeight: 1, marginBottom: 12 }}>"</div>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: C.textMid, fontStyle: "italic", marginBottom: 20 }}>{leader.quote}</p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                    <div className="sans" style={{ fontSize: 14, fontWeight: 700 }}>{leader.name}</div>
                    <div className="sans" style={{ fontSize: 12, color: C.forest, fontWeight: 500 }}>{leader.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* DONATE */}
      <section id="donate" style={{ background: C.warmBg, padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: 12 }}>
          Every donation trains one more healthcare worker.
        </h2>
        <p className="sans" style={{ fontSize: 15, color: C.textMid, maxWidth: 560, margin: "0 auto 28px" }}>
          One gift. One graduate. Thousands of lives reached at the doorstep.
        </p>
        <a href={`/donate?program=${LOCKED_PROGRAM}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.gold, color: "#1a1a1a", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, padding: "16px 40px", borderRadius: 12, textDecoration: "none" }}>
          <HeartHandshake size={18} /> Support Saksham
        </a>
      </section>

      {/* FAQ */}
      <FadeIn>
        <section style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="tag" style={{ color: C.gold, marginBottom: 6 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700 }}>Common questions</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}`, padding: "16px 0", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="sans" style={{ fontSize: 15, fontWeight: 600 }}>{faq.q}</h3>
                <span className="sans" style={{ fontSize: 18, color: C.forest, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 14 }}>+</span>
              </div>
              {openFaq === i && <p className="sans" style={{ fontSize: 13, lineHeight: 1.65, color: C.textMid, paddingTop: 10 }}>{faq.a}</p>}
            </div>
          ))}
        </section>
      </FadeIn>

      <Footer />
    </div>
  );
}