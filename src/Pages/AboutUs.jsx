import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Heart, Bike, Package, GraduationCap, Sprout, Wind, Microscope,
  MapPin, Mail, Phone, Shield, FileText, Users, Building2,
  CheckCircle, Award, Globe, HeartHandshake,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import imgSwasthmanthan from "../assets/programs/Swasthmanthan.webp";
import imgSaksham       from "../assets/programs/saksham.webp";
import imgShudhvayu     from "../assets/programs/Shudhvayu.webp";
import swasthgramLogo   from "../assets/SwasthgramLogo.png";

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
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function Section({ children, bg = cc.warmBg, id }) {
  return (
    <section id={id} style={{ background: bg, padding: "64px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}

function SectionHeading({ tag, title, center = false }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 36 }}>
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: cc.gold, marginBottom: 8 }}>{tag}</div>
      <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: cc.text, lineHeight: 1.25 }}>{title}</h2>
    </div>
  );
}

function InfoCard({ icon, label, value, highlight = false }) {
  return (
    <div style={{ background: cc.white, borderRadius: 12, padding: "18px 20px", border: `1px solid ${cc.border}`, borderLeft: highlight ? `4px solid ${cc.forest}` : `1px solid ${cc.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: cc.textLight, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: cc.text, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

export default function AboutNGOPage() {
  return (
    <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", background: cc.warmBg, color: cc.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        .sans { font-family: 'Inter', -apple-system, sans-serif; }
        @media (max-width: 900px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <Header />

      {/* HERO */}
      <section style={{ background: `linear-gradient(160deg, ${cc.forestDeep} 0%, ${cc.forest} 60%, ${cc.leaf} 100%)`, padding: "140px 24px 72px", marginTop: 0 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            <img src={swasthgramLogo} alt="Swasthgram Logo" style={{ width: 60, height: 60, objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 10 }}>About Our Organisation</div>
            <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 10 }}>
              Swasthgram Global Foundation
            </h1>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 600 }}>
              "A registered non-profit organisation empowering underserved communities through community wellness programs, scientific skilling, and environmental solutions — since 2011.
            </p>
          </div>
        </div>
      </section>

      {/* ── LEGAL REGISTRATION ── */}
      <FadeIn>
        <Section id="registration" bg={cc.white}>
          <SectionHeading tag="Legal Identity" title="Registration & Compliance Details" />

          {/* IMPORTANT DISCLAIMER */}
          <div style={{ background: "#f0fdf4", border: `2px solid ${cc.forest}`, borderRadius: 14, padding: "18px 22px", marginBottom: 32, display: "flex", alignItems: "flex-start", gap: 14 }}>
            <Shield size={22} color={cc.forest} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: cc.forest, marginBottom: 4 }}>
                "We are a registered non-profit NGO.
              </div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.textMid, lineHeight: 1.6 }}>
                Swasthgram Global Global Foundation is entirely focused on community wellness, youth skilling, and environmental solutions. Every rupee we receive goes directly toward our field programs, health camps, and community outreach. We are not a commercial organisation of any kind.
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <InfoCard
              icon={<FileText size={16} color={cc.forest} />}
              label="Legal Name"
              value="Swasthgram Global Foundation"
              highlight
            />
            <InfoCard
              icon={<Building2 size={16} color={cc.forest} />}
              label="Type of Organisation"
              value="Public Charitable Trust / Non-Profit Organisation"
              highlight
            />
            <InfoCard
              icon={<Award size={16} color={cc.forest} />}
              label="12A Certificate"
              value="Registered under Section 12A of the Income Tax Act, 1961 — Exemption for charitable organisations"
              highlight
            />
            <InfoCard
              icon={<Award size={16} color={cc.forest} />}
              label="80G Certificate"
              value="Registered under Section 80G of the Income Tax Act — Donations eligible for tax deduction for Indian donors"
              highlight
            />
            <InfoCard
              icon={<Globe size={16} color={cc.forest} />}
              label="501(c)(3) Certified-USA"
              value="Donations from US donors may be tax-deductible through an IRS 501(c)(3) affiliated organisation"
              highlight
            />
            <InfoCard
              icon={<MapPin size={16} color={cc.forest} />}
              label="Registered Address"
              value="Ground Floor, 424-CMR Building, Ghitorni, New Delhi — 110030, India"
              highlight
            />
          </div>

          <div style={{ background: cc.cream, borderRadius: 12, padding: "16px 20px", border: `1px solid ${cc.border}` }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: cc.textMid, lineHeight: 1.7 }}>
              <strong style={{ color: cc.text }}>Note for donors:</strong> Upon donation, an official receipt will be emailed to you. Indian donors will receive their 12A/80G certificate within 7 working days to claim domestic income tax deductions. US donors will receive 501(c)(3) compliant documentation suitable for IRS tax-deductible records.
            </div>
          </div>
        </Section>
      </FadeIn>

      {/* ── MISSION STATEMENT ── */}
      <FadeIn>
        <Section id="mission" bg={cc.cream}>
          <SectionHeading tag="Our Mission" title="Nation building through empowerment. Not welfare." />
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.8, color: cc.textMid, marginBottom: 18 }}>
                Founded in 2011 by a biomedical engineer who left Hollywood to solve India's deepest community wellness access gap, Swasthgram builds wellness access that goes where hospitals can't — solar-powered, jungle-ready, validated by PwC after screening 150 global solutions.
              </p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.8, color: cc.textMid, marginBottom: 24 }}>
                We are not a charity. We are a technology-led, community-driven organisation that creates sustainable, self-sufficient systems for last-mile community care, youth empowerment, and environmental innovation. Our solutions have been presented to 18 countries in Washington D.C. and are used daily by the Indian Army.
              </p>
              <div style={{ background: cc.white, borderRadius: 12, padding: "18px 20px", border: `1px solid ${cc.border}`, borderLeft: `4px solid ${cc.gold}` }}>
                <p style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 15, fontStyle: "italic", color: cc.text, lineHeight: 1.7 }}>
                  "We empower people for sustainable development. Every rupee donated goes directly to building systems that outlast our presence."
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: <Bike size={20} color={cc.forest} />,          title: "Health Unit on Bike",            desc: "The world's only solar-powered health unit on a motorbike. 100+ health screenings. Jungle and mountain ready. Used by the Indian Army." },
                { icon: <Package size={20} color={cc.forest} />,       title: "Health Unit in a Box",           desc: "5,000+ community health kits deployed across India. Enables stationary health camps in remote locations." },
                { icon: <GraduationCap size={20} color={cc.forest} />, title: "Scientific Skilling",    desc: "8 years of R&D compressed a 4-year community care programme into 4 months. Curriculum endorsed by leading institutions." },
                { icon: <Sprout size={20} color={cc.forest} />,        title: "Carbon Net Zero",        desc: "All solutions are designed with zero electricity, zero AC, and zero environmental footprint." },
              ].map((item, i) => (
                <div key={i} style={{ background: cc.white, borderRadius: 10, padding: "14px 16px", border: `1px solid ${cc.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, color: cc.text, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: cc.textMid, lineHeight: 1.55 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </FadeIn>

      {/* ── PROGRAMS ── */}
      <FadeIn>
        <Section id="programs" bg={cc.warmBg}>
          <SectionHeading tag="Our Programs" title="Three missions. One purpose." center />
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              {
                name: "SwasthManthan",
                color: cc.forest,
                img: imgSwasthmanthan,
                tagline: "Early Detection. Saved Lives.",
                desc: "Preventive health screening and early awareness for diseases, diabetes, and vital organ health — delivered through Health Unit on Bike to remote communities across India.",
                stats: [{ n: "1,11,392", l: "People Reached" }, { n: "21,750+", l: "Screenings Done" }, { n: "9,360+", l: "Health Camps" }],
              },
              {
                name: "Saksham",
                color: cc.leaf,
                img: imgSaksham,
                tagline: "Scientific Skilling. Real Careers.",
                desc: "8 years of deep research compressed 4-year community care skilling programmes into 4 intensive months. Graduates are skilled, certified, and placed at partner community care institutions.",
                stats: [{ n: "8 Years", l: "R&D Investment" }, { n: "4 Months", l: "vs. 4 Years" }, { n: "5,050+", l: "Youth Empowered" }],
              },
              {
                name: "Shudhvayu",
                color: cc.goldSoft,
                img: imgShudhvayu,
                tagline: "Clean Air. Right to Life.",
                desc: "Patented vehicle-mounted air purification filter. Cleans air as vehicles drive through urban streets. No electricity required. The most democratic and scalable clean air solution.",
                stats: [{ n: "Since 2018", l: "On Roads" }, { n: "Patented", l: "Innovation" }, { n: "Delhi NCR", l: "& Beyond" }],
              },
            ].map((prog, i) => (
              <div key={i} style={{ background: cc.white, borderRadius: 14, overflow: "hidden", border: `1px solid ${cc.border}`, display: "flex", flexDirection: "column" }}>
                <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                  <img src={prog.img} alt={prog.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />
                  <div style={{ position: "absolute", bottom: 12, left: 14 }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff", opacity: 0.85 }}>{prog.name}</div>
                  </div>
                </div>
                <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: prog.color, lineHeight: 1.3 }}>{prog.tagline}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.65, color: cc.textMid, marginBottom: 18, flex: 1 }}>{prog.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {prog.stats.map((s, j) => (
                      <div key={j} style={{ background: cc.cream, borderRadius: 8, padding: "6px 10px", flex: "1 1 auto", textAlign: "center" }}>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: cc.text }}>{s.n}</div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: cc.textLight, marginTop: 2 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </FadeIn>

      {/* ── IMPACT NUMBERS ── */}
      <FadeIn>
        <Section bg={cc.forest}>
          <SectionHeading tag="Our Footprint" title="Impact at scale — verified and tracked" center />
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[
              { n: "57 Lakh+",  l: "Beneficiaries Served" },
              { n: "67,660+",   l: "Health Camps Conducted" },
              { n: "21,750+",   l: "Diseases Awareness & Screenings" },
              { n: "5,000+",    l: "Community Health Kits Deployed" },
              { n: "5,050+",    l: "Youth Skilled & Empowered" },
              { n: "9,000+",    l: "Pregnant Women Screened" },
              { n: "18",        l: "Countries Presented To (Washington D.C.)" },
              { n: "Since 2011", l: "Years of Community Impact" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "18px 14px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(18px,2vw,22px)", fontWeight: 800, color: cc.goldLight, marginBottom: 6 }}>{s.n}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Section>
      </FadeIn>

      {/* ── TRUSTEES / BOARD ── */}
      <FadeIn>
        <Section id="board" bg={cc.cream}>
          <SectionHeading tag="Governance" title="Trustees & Board Members" />
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
            {[
              {
                name: "Amit Bhatnagar",
                role: "Chief Care Architect & Founder",
                bio: "Biomedical engineer who left Hollywood to solve India's last-mile community wellness access gap. Founded Swasthgram in 2011. Creator of the Health Unit on Bike — the world's only solar-powered community health screening unit on a motorbike.",
                quote: "At Swasthgram, we are transforming the landscape of community care, creating a future where access to high-quality, affordable care is a right, not a privilege.",
              },
              {
                name: "Deepti Bhatnagar",
                role: "Chief Compassion Officer & Director",
                bio: "Co-founder and Director of Swasthgram Global Foundation. Leads programme operations, community outreach, and donor relations. Drives the foundation's mission of sustainable, empowerment-based development.",
                quote: "We are dedicated to making community care not just a service, but a promise — one that ensures affordability, inclusivity, and scalability for all.",
              },
            ].map((person, i) => (
              <div key={i} style={{ background: cc.white, borderRadius: 14, padding: 28, border: `1px solid ${cc.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${cc.forest}, ${cc.leaf})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>{person.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, color: cc.text }}>{person.name}</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: cc.forest, fontWeight: 500 }}>{person.role}</div>
                  </div>
                </div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.65, color: cc.textMid, marginBottom: 14 }}>{person.bio}</p>
                <div style={{ borderTop: `1px solid ${cc.border}`, paddingTop: 14 }}>
                  <div style={{ fontSize: 24, color: cc.forest, lineHeight: 1, marginBottom: 6 }}>"</div>
                  <p style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 13, fontStyle: "italic", color: cc.textMid, lineHeight: 1.65 }}>{person.quote}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: cc.white, borderRadius: 12, padding: "16px 20px", border: `1px solid ${cc.border}` }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.textMid, lineHeight: 1.6 }}>
              For a complete list of trustees, board resolutions, and governance documents, please write to{" "}
              <a href="mailto:support@swasthgram.org" style={{ color: cc.forest, textDecoration: "underline" }}>support@swasthgram.org</a>.
              Scanned copies of registration certificates, 12A, 80G, and USA 501(c)(3) affiliation documents are available upon request for grant and compliance purposes.
            </p>
          </div>
        </Section>
      </FadeIn>

      {/* ── CERTIFICATIONS & VALIDATIONS ── */}
      <FadeIn>
        <Section id="certifications" bg={cc.warmBg}>
          <SectionHeading tag="Certifications & Validations" title="Recognised, validated, and trusted" />
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { icon: <Award size={22} color={cc.forest} />,        title: "12A & 80G Tax Certification",     desc: "Registered under the Income Tax Act, 1961. This status ensures tax-exempt operations and provides tax-deduction benefits for all Indian donors." },
              { icon: <Award size={22} color={cc.forest} />,        title: "USA Tax Compliance 501(c)3",      desc: "Registered 501(c)(3) Global Foundation. All US donations are tax-deductible to the extent permitted by law through our affiliated partner." },
              { icon: <CheckCircle size={22} color={cc.forest} />,  title: "PwC Validated",                   desc: "Validated by PricewaterhouseCoopers after screening 150+ global community health solutions. Selected as the most scalable model." },
              { icon: <Shield size={22} color={cc.forest} />,       title: "Indian Army Partner",             desc: "5,000+ Health Unit on Bike units deployed and used daily by the Indian Army in field operations." },
              { icon: <Globe size={22} color={cc.forest} />,        title: "Washington D.C. Presentation",    desc: "Solution presented to representatives of 18 countries as a replicable model for last-mile community wellness access." },
              { icon: <HeartHandshake size={22} color={cc.forest} />, title: "Kumbh Mela 2025",              desc: "3,000+ community screenings per day at Kumbh Mela 2025 — the world's largest gathering. Zero downtime." },
            ].map((item, i) => (
              <div key={i} style={{ background: cc.white, borderRadius: 12, padding: "18px 18px", border: `1px solid ${cc.border}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, color: cc.text, marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: cc.textMid, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </FadeIn>

      {/* ── CONTACT ── */}
      <FadeIn>
        <Section id="contact" bg={cc.cream}>
          <SectionHeading tag="Get In Touch" title="Contact the Foundation" />
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: cc.textMid, lineHeight: 1.75, marginBottom: 24 }}>
                For grant applications, compliance documentation, partnership enquiries, or certificate requests, please reach out directly. We are committed to full transparency.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: <Mail size={16} color={cc.forest} />,   label: "Email",          value: "support@swasthgram.org" },
                  { icon: <Phone size={16} color={cc.forest} />,  label: "India",          value: "+91 85278-95900" },
                  { icon: <Phone size={16} color={cc.forest} />,  label: "USA",            value: "+1-202-471-8287" },
                  { icon: <MapPin size={16} color={cc.forest} />, label: "India Office",   value: "G/F, 424-CMR Building, Ghitorni, New Delhi—110030, India" },
                  { icon: <MapPin size={16} color={cc.forest} />, label: "USA Office",     value: "78 Union Avenue, Edison, NJ-08821, USA" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: cc.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: cc.text }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: cc.white, borderRadius: 14, padding: 24, border: `1px solid ${cc.border}` }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: cc.text, marginBottom: 16 }}>Website</div>
              <a href="https://swasthgram.org" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 15, color: cc.forest, fontWeight: 600, marginBottom: 20 }}>
                <Globe size={16} color={cc.forest} /> swasthgram.org
              </a>
              <div style={{ borderTop: `1px solid ${cc.border}`, paddingTop: 16 }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, color: cc.text, marginBottom: 10 }}>Legal & Compliance Documents</div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: cc.textMid, lineHeight: 1.65 }}>
                  Registration certificate, 12A certificate, 80G certificate, USA 501(c)(3) affiliation documents, audited financial statements, and board resolutions are available upon written request to <a href="mailto:support@swasthgram.org" style={{ color: cc.forest }}>support@swasthgram.org</a>.
                </p>
              </div>
              <div style={{ borderTop: `1px solid ${cc.border}`, paddingTop: 16, marginTop: 16 }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, color: cc.text, marginBottom: 8 }}>Disclaimer</div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: cc.textMid, lineHeight: 1.65 }}>
                  Swasthgram Global Foundation does not sell pharmaceutical products, medical devices, or clinical services. All activities are charitable in nature, focused exclusively on community wellness access, youth empowerment, and environmental solutions.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </FadeIn>

      <Footer />
    </div>
  );
}