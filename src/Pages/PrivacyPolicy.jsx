import Header from "../components/Header";
import Footer from "../components/Footer";
import { Shield, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
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

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: [
      {
        subtitle: "Personal Information",
        text: "When you donate, register, or contact us, we collect information such as your name, email address, phone number, and payment details. This information is necessary to process donations and provide receipts."
      },
      {
        subtitle: "Usage Data",
        text: "We automatically collect information about how you interact with our website and app, including IP address, browser type, pages visited, and time spent. This helps us improve our services."
      },
      {
        subtitle: "Health Camp Data",
        text: "For beneficiaries of our health camps, we collect anonymised diagnostic data for programme monitoring and impact reporting. No personally identifiable health data is stored without explicit consent."
      },
    ]
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Donation Processing",
        text: "Your personal and payment information is used solely to process donations, issue tax receipts (80G, 12A, 501(c)(3)), and communicate donation confirmations."
      },
      {
        subtitle: "Programme Delivery",
        text: "Aggregated and anonymised data helps us track impact, plan health camp locations, and report transparently to donors about fund utilisation."
      },
      {
        subtitle: "Communications",
        text: "With your consent, we may send updates about Swasthgram's programmes, impact stories, and fundraising campaigns. You can opt out at any time."
      },
    ]
  },
  {
    id: "data-sharing",
    title: "Data Sharing & Disclosure",
    content: [
      {
        subtitle: "Payment Processors",
        text: "We share necessary payment information with Razorpay (India) and Stripe (USA) solely for donation processing. These processors maintain their own privacy policies and security standards."
      },
      {
        subtitle: "No Sale of Data",
        text: "Swasthgram does not sell, rent, or trade your personal information to third parties for marketing purposes. Your data is never monetised."
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose information if required by law, court order, or government authority, or to protect the rights and safety of Swasthgram, our staff, or the public."
      },
    ]
  },
  {
    id: "data-security",
    title: "Data Security",
    content: [
      {
        subtitle: "Security Measures",
        text: "We implement industry-standard security measures including SSL encryption, secure servers, and access controls to protect your personal information from unauthorised access or disclosure."
      },
      {
        subtitle: "Payment Security",
        text: "All payment transactions are encrypted and processed through PCI-DSS compliant payment gateways. Swasthgram does not store credit card or banking details on our servers."
      },
      {
        subtitle: "Data Retention",
        text: "We retain personal data only as long as necessary for the purposes outlined in this policy, or as required by law. Donor records are retained for a minimum of 7 years for tax compliance."
      },
    ]
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: [
      {
        subtitle: "Access & Correction",
        text: "You have the right to access the personal information we hold about you and to request corrections if it is inaccurate or incomplete. Contact support@swasthgram.org to make such requests."
      },
      {
        subtitle: "Deletion",
        text: "You may request deletion of your personal data, subject to our legal obligations to retain certain records. We will respond to deletion requests within 30 days."
      },
      {
        subtitle: "Opt-Out",
        text: "You can opt out of marketing communications at any time by clicking 'unsubscribe' in any email or by contacting us directly. Transactional communications such as donation receipts cannot be opted out of."
      },
    ]
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    content: [
      {
        subtitle: "Cookie Usage",
        text: "Our website uses cookies to enhance your browsing experience, remember preferences, and analyse site traffic. Essential cookies are necessary for the site to function; analytics cookies are optional."
      },
      {
        subtitle: "Managing Cookies",
        text: "You can control cookie settings through your browser preferences. Disabling certain cookies may affect the functionality of our website."
      },
    ]
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: [
      {
        subtitle: "Age Restriction",
        text: "Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13 without parental consent. If you believe we have collected such data, please contact us immediately."
      },
    ]
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      {
        subtitle: "Policy Updates",
        text: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website. Your continued use of our services after changes constitutes acceptance of the revised policy."
      },
    ]
  },
];

export default function PrivacyPolicy() {
  useEffect(() => { document.title = "Privacy Policy | Swasthgram"; }, []);
  const [activeSection, setActiveSection] = useState("information-we-collect");

  return (
    <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", background: cc.warmBg, color: cc.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        .sans { font-family: 'Inter', -apple-system, sans-serif; }
        .tag { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; display: inline-block; }
        .toc-link:hover { color: ${cc.forest} !important; }
        @media (max-width: 860px) {
          .policy-layout { flex-direction: column !important; }
          .toc-sidebar { position: static !important; width: 100% !important; }
        }
      `}</style>

      <Header />

      {/* HERO */}
      <section style={{
        background: `linear-gradient(160deg, ${cc.forestDeep} 0%, ${cc.forest} 100%)`,
        padding: "80px 24px 56px", paddingTop: 100,
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={24} color={cc.goldLight} />
            </div>
            <div className="tag" style={{ color: cc.goldSoft }}>Legal</div>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>Privacy Policy</h1>
          <p className="sans" style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.7 }}>
            Your privacy matters to us. This policy explains how Swasthgram collects, uses, and protects your personal information.
          </p>
          <div className="sans" style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Last updated: March 2026 · Swasthgram Global Foundation</div>
        </div>
      </section>

      {/* CONTENT */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 24px 80px" }}>
        <div className="policy-layout" style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>

          {/* Sidebar TOC */}
          <aside className="toc-sidebar" style={{ width: 240, flexShrink: 0, position: "sticky", top: 90 }}>
            <div style={{ background: cc.white, borderRadius: 14, border: `1px solid ${cc.border}`, padding: "20px 0", overflow: "hidden" }}>
              <div className="sans" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: cc.textLight, textTransform: "uppercase", padding: "0 20px 12px" }}>Contents</div>
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="toc-link"
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 20px", fontSize: 13, fontFamily: "'Inter', sans-serif",
                    fontWeight: activeSection === s.id ? 600 : 400,
                    color: activeSection === s.id ? cc.forest : cc.textMid,
                    background: activeSection === s.id ? `${cc.forest}10` : "transparent",
                    borderLeft: activeSection === s.id ? `3px solid ${cc.forest}` : "3px solid transparent",
                    transition: "all 0.2s",
                  }}>
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {sections.map((section, i) => (
              <FadeIn key={section.id} delay={i * 0.05}>
                <div id={section.id} style={{ marginBottom: 48, scrollMarginTop: 100 }}>
                  <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${cc.border}`, color: cc.text }}>
                    {section.title}
                  </h2>
                  {section.content.map((item, j) => (
                    <div key={j} style={{ marginBottom: 20, background: cc.white, borderRadius: 12, padding: "20px 24px", border: `1px solid ${cc.border}` }}>
                      <h3 className="sans" style={{ fontSize: 14, fontWeight: 700, color: cc.forest, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <ChevronRight size={14} color={cc.forest} />{item.subtitle}
                      </h3>
                      <p className="sans" style={{ fontSize: 14, lineHeight: 1.75, color: cc.textMid }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ))}

            {/* Contact */}
            <FadeIn>
              <div style={{ background: `linear-gradient(135deg, ${cc.forestDeep}, ${cc.forest})`, borderRadius: 16, padding: "32px 28px", marginTop: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Questions about this policy?</h3>
                <p className="sans" style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>Reach out to our team and we'll respond within 48 hours.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: <Mail size={15} color={cc.goldLight} />, text: "support@swasthgram.org" },
                    { icon: <Phone size={15} color={cc.goldLight} />, text: "+91 85278-95900 (India)" },
                    { icon: <MapPin size={15} color={cc.goldLight} />, text: "Ground Floor, 424-CMR Building, Ghitorni, New Delhi — 110030" },
                    { icon: <Phone size={15} color={cc.goldLight} />, text: "+1 202-471-8287 (USA)" },
                    { icon: <MapPin size={15} color={cc.goldLight} />, text: "78 Union Avenue, Edison, NJ-08821, USA" },
                  ].map((item, i) => (
                    <div key={i} className="sans" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                      {item.icon}{item.text}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}