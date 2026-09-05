import Header from "../components/Header";
import Footer from "../components/Footer";
import { HelpCircle, Mail, Phone, Bike, GraduationCap, Leaf, Heart, Users, Globe } from "lucide-react";
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

const categories = [
  {
    id: "general",
    label: "General",
    icon: <HelpCircle size={18} />,
    color: cc.forest,
    faqs: [
      {
        q: "What is Swasthgram?",
        a: "Swasthgram is a registered non-profit organisation founded in 2011 by a biomedical engineer. We operate the world's only diagnostic lab on a motorbike — solar-powered, jungle-ready, validated by PwC. Our mission is sustainable empowerment, not charity, across three verticals: Public Health, Youth Empowerment, and Environment."
      },
      {
        q: "Where does Swasthgram operate?",
        a: "We operate primarily across rural India — reaching villages, tribal areas, and remote communities that lack access to hospitals or diagnostic labs. We have been presented to 18 countries in Washington D.C. and are endorsed by India's Department of Biotechnology. Our US operations are based in Falls Church, Virginia."
      },
      {
        q: "What makes Swasthgram unique?",
        a: "Three things set us apart: (1) The Lab-on-Bike — a solar-powered motorbike carrying 100+ diagnostic tests that can reach jungles, mountains, and flood zones where no hospital vehicle can. (2) PwC validation — out of 150 global solutions screened, Swasthgram was selected as the most impactful. (3) The Indian Army uses our Lab-in-a-Box for 5,000+ daily deployments."
      },
      {
        q: "Is Swasthgram a registered organisation?",
        a: "Yes. Swasthgram is registered in India under the Societies Registration Act and holds 80G & 12A tax exemption certifications. In the United States, we are a 501(c)(3) tax-exempt organisation. All registration details are available upon request at support@swasthgram.org."
      },
      {
        q: "How can I stay updated on Swasthgram's work?",
        a: "You can follow our impact through the Swasthgram App (available on iOS and Android), our website, and by subscribing to our newsletter. The app shows live camp locations, real-time beneficiary data, and how your donations are being deployed."
      },
    ]
  },
  {
    id: "donations",
    label: "Donations & Tax",
    icon: <Heart size={18} />,
    color: cc.gold,
    faqs: [
      {
        q: "How do I donate?",
        a: "You can donate directly from this website or through the Swasthgram App. Indian donors can give via Razorpay in INR. US donors can give via Stripe in USD. Both methods are secure, encrypted, and PCI-DSS compliant."
      },
      {
        q: "Is my donation tax-deductible?",
        a: "Yes. Indian donors receive 80G & 12A certificates which allow tax deductions under the Income Tax Act. US donors receive 501(c)(3) receipts for IRS deductions. Tax receipts are automatically sent to your email address after your donation is processed."
      },
      {
        q: "What percentage of my donation goes to the cause?",
        a: "100% of programme donations go directly to impact: health camps, Lab-on-Bike operations, youth training, and environmental work. Administrative and operational costs are funded through separate institutional grants and CSR partnerships — not from your donation."
      },
      {
        q: "Can I donate in a specific person's or company's name?",
        a: "Yes! Swasthgram actively publicises donor names as part of our mission — we believe donors deserve to be celebrated as heroes, not silent contributors. You can specify the name during donation and we will associate the health camp or programme deployment with that name in our records and app."
      },
      {
        q: "Can I get a refund on my donation?",
        a: "Donations are generally non-refundable as they are deployed immediately. However, in cases of duplicate transactions or technical errors, please contact support@swasthgram.org within 7 days of the transaction and we will review your request on a case-by-case basis."
      },
      {
        q: "Can organisations or companies donate via CSR?",
        a: "Absolutely. Swasthgram is an approved CSR partner for multiple corporates. We provide complete documentation, impact reports, and co-branding opportunities for CSR donations. Contact us at support@swasthgram.org to discuss a CSR partnership."
      },
    ]
  },
  {
    id: "programs",
    label: "Our Programs",
    icon: <Bike size={18} />,
    color: cc.leaf,
    faqs: [
      {
        q: "What is SwasthManthan?",
        a: "SwasthManthan is our public health programme delivering free cancer screening, diabetes testing, liver and kidney diagnostics, and maternal health checks via Lab-on-Bike to remote communities. To date, we have reached over 1,11,392 beneficiaries, conducted 21,750+ cancer tests, and operated 9,360+ health camps."
      },
      {
        q: "What is the Lab-on-Bike?",
        a: "The Lab-on-Bike is a solar-powered motorbike carrying a portable diagnostic lab with 100+ tests. It requires no air conditioning, no electricity grid, and can navigate jungle paths, mountain terrain, and flood-affected areas. It is the world's only solution of its kind — validated by PwC after screening 150 global innovations."
      },
      {
        q: "What is Saksham?",
        a: "Saksham is our youth empowerment programme that took 8 years of R&D to compress a 4-year medical laboratory science programme into an intensive 4-month certification course. Graduates are placed at top hospitals including Medanta. With a target of training 5 lakh youth and contributing ₹95 Crore to GDP, Saksham is India's most ambitious grassroots healthcare skilling initiative."
      },
      {
        q: "What is Shudhvayu?",
        a: "Shudhvayu is our environment programme featuring a patented vehicle-mounted air purification system. It cleans ambient air as vehicles drive — requiring no electricity, no charging, and no maintenance beyond basic servicing. It is the most democratic clean-air solution, designed for everyday vehicles in Delhi NCR and beyond."
      },
      {
        q: "How do I access Swasthgram's health camps?",
        a: "Health camps are free and open to all residents of the communities we serve. Camp schedules are published on the Swasthgram App and announced through local community networks. If you are in a community that lacks diagnostic access and wish to request a health camp, email support@swasthgram.org with your location details."
      },
    ]
  },
  {
    id: "volunteer",
    label: "Volunteering",
    icon: <Users size={18} />,
    color: "#6366F1",
    faqs: [
      {
        q: "How can I volunteer with Swasthgram?",
        a: "We welcome volunteers across multiple areas: field health camp support, data entry, digital marketing, fundraising, corporate outreach, and translation. Email support@swasthgram.org with your skills, location, and availability and our team will get back to you within 5 working days."
      },
      {
        q: "Can I volunteer remotely?",
        a: "Yes. Remote volunteering opportunities include content writing, social media management, grant writing, graphic design, software development, and community outreach support. We have an active team of remote volunteers from India, the US, and several other countries."
      },
      {
        q: "How can my company partner with Swasthgram?",
        a: "We partner with companies through CSR programmes, employee volunteering, product donations, and pro-bono services. Past partners include PwC, DLF Foundation, Reliance Foundation, Tata Trusts, and Lupin Foundation. Contact support@swasthgram.org to discuss a partnership that aligns with your company's goals."
      },
      {
        q: "Can I intern with Swasthgram?",
        a: "Yes. We offer internships for students in public health, social work, business, technology, and communications. Internships can be in-person (New Delhi) or remote. Send your CV and a brief statement of interest to support@swasthgram.org with the subject line 'Internship Application'."
      },
      {
        q: "How can I spread awareness about Swasthgram?",
        a: "Share our work on social media, tell friends and family, and encourage your company to consider Swasthgram for CSR. You can also download the Swasthgram App and share the live camp data — real numbers are the most powerful advocacy tool we have."
      },
    ]
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: cc.white, borderRadius: 12, border: `1px solid ${open ? cc.forest + "40" : cc.border}`,
        overflow: "hidden", transition: "border-color 0.2s", marginBottom: 10,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12,
        }}
      >
        <span className="sans" style={{ fontSize: 15, fontWeight: 600, color: cc.text, lineHeight: 1.4 }}>{faq.q}</span>
        <span style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: open ? cc.forest : cc.cream,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: open ? "#fff" : cc.forest, fontSize: 18, fontWeight: 700,
          transition: "all 0.25s", transform: open ? "rotate(45deg)" : "none",
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 22px 18px" }}>
          <div style={{ height: 1, background: cc.border, marginBottom: 14 }} />
          <p className="sans" style={{ fontSize: 14, lineHeight: 1.75, color: cc.textMid }}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQs() {
  const [activeCategory, setActiveCategory] = useState("general");

  const activeData = categories.find(c => c.id === activeCategory);

  return (
    <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", background: cc.warmBg, color: cc.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        .sans { font-family: 'Inter', -apple-system, sans-serif; }
        .tag { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; display: inline-block; }
        .cat-btn:hover { border-color: ${cc.forest} !important; color: ${cc.forest} !important; }
        @media (max-width: 640px) {
          .cat-tabs { flex-wrap: wrap !important; }
        }
      `}</style>

      <Header />

      {/* HERO */}
      <section style={{
        background: `linear-gradient(160deg, ${cc.forestDeep} 0%, ${cc.forest} 100%)`,
        padding: "80px 24px 56px", paddingTop: 100,
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <HelpCircle size={26} color={cc.goldLight} />
          </div>
          <div className="tag" style={{ color: cc.goldSoft, marginBottom: 12 }}>Help Centre</div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>Frequently Asked Questions</h1>
          <p className="sans" style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 500, lineHeight: 1.7, margin: "0 auto" }}>
            Everything you need to know about Swasthgram, our programmes, donations, and how to get involved.
          </p>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <div style={{ background: cc.white, borderBottom: `1px solid ${cc.border}`, position: "sticky", top: 64, zIndex: 10 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <div className="cat-tabs" style={{ display: "flex", gap: 4, overflowX: "auto", padding: "12px 0" }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className="cat-btn"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
                  borderRadius: 8, border: `1.5px solid ${activeCategory === cat.id ? cat.color : cc.border}`,
                  background: activeCategory === cat.id ? cat.color + "12" : "transparent",
                  color: activeCategory === cat.id ? cat.color : cc.textMid,
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: activeCategory === cat.id ? 600 : 400,
                  cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                }}
              >
                {cat.icon}{cat.label}
                <span style={{
                  background: activeCategory === cat.id ? cat.color : cc.cream,
                  color: activeCategory === cat.id ? "#fff" : cc.textLight,
                  fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, transition: "all 0.2s",
                }}>
                  {cat.faqs.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ CONTENT */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px" }}>
        <FadeIn key={activeCategory}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: activeData.color + "15", display: "flex", alignItems: "center", justifyContent: "center", color: activeData.color }}>
                {activeData.icon}
              </div>
              <div>
                <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700 }}>{activeData.label}</h2>
                <p className="sans" style={{ fontSize: 13, color: cc.textLight }}>{activeData.faqs.length} questions</p>
              </div>
            </div>
          </div>

          {activeData.faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </FadeIn>

        {/* Still have questions */}
        <FadeIn>
          <div style={{ background: `linear-gradient(135deg, ${cc.forestDeep}, ${cc.forest})`, borderRadius: 16, padding: "36px 32px", marginTop: 48, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Still have questions?</h3>
              <p className="sans" style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", maxWidth: 400 }}>
                Can't find the answer you're looking for? Our team responds within 24–48 hours.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              {[
                { icon: <Mail size={15} color={cc.goldLight} />, text: "support@swasthgram.org" },
                { icon: <Phone size={15} color={cc.goldLight} />, text: "+91 87507-40000" },
                { icon: <Globe size={15} color={cc.goldLight} />, text: "+1-213-510-0474 (US)" },
              ].map((item, i) => (
                <div key={i} className="sans" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                  {item.icon}{item.text}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <Footer />
    </div>
  );
}