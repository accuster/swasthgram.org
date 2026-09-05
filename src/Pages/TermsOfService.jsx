import Header from "../components/Header";
import Footer from "../components/Footer";
import { ScrollText, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
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
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      {
        subtitle: "Agreement",
        text: "By accessing or using Swasthgram's website, mobile application, or any of our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
      },
      {
        subtitle: "Eligibility",
        text: "You must be at least 18 years of age to use our services or make donations independently. Minors may use the platform only with parental or guardian consent and supervision."
      },
    ]
  },
  {
    id: "our-services",
    title: "Our Services",
    content: [
      {
        subtitle: "What Swasthgram Provides",
        text: "Swasthgram is a registered non-profit organisation providing public health services, youth skilling, and environmental initiatives. Our digital platforms facilitate donation processing, impact tracking, and programme information."
      },
      {
        subtitle: "No Medical Advice",
        text: "Content on our website and app is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns."
      },
      {
        subtitle: "Service Availability",
        text: "We strive to maintain continuous service availability but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice."
      },
    ]
  },
  {
    id: "donations",
    title: "Donations & Payments",
    content: [
      {
        subtitle: "Donation Processing",
        text: "All donations are processed securely through Razorpay (India) and Stripe (USA). By making a donation, you authorise the respective payment processor to charge the specified amount to your payment method."
      },
      {
        subtitle: "Refund Policy",
        text: "Donations are generally non-refundable as they are deployed immediately toward programme delivery. In cases of duplicate transactions or technical errors, please contact support@swasthgram.org within 7 days and we will review your request."
      },
      {
        subtitle: "Tax Receipts",
        text: "Eligible donors will receive tax receipts automatically: 80G & 12A certificates for Indian donors, and 501(c)(3) receipts for US donors. Receipts are sent to the email address provided at the time of donation."
      },
      {
        subtitle: "Fund Utilisation",
        text: "Swasthgram commits to using 100% of programme donations for impact delivery. Administrative costs are funded separately. Donors may track fund utilisation through the Swasthgram App."
      },
    ]
  },
  {
    id: "user-conduct",
    title: "User Conduct",
    content: [
      {
        subtitle: "Prohibited Activities",
        text: "You agree not to use our services for any unlawful purpose, to transmit harmful or fraudulent content, to impersonate Swasthgram or its representatives, or to attempt to gain unauthorised access to our systems."
      },
      {
        subtitle: "Accurate Information",
        text: "You agree to provide accurate, current, and complete information when registering, donating, or interacting with our services. Providing false information may result in termination of your account."
      },
      {
        subtitle: "Respectful Engagement",
        text: "When participating in any Swasthgram community or communication channel, users must engage respectfully. Harassment, discrimination, or abusive behaviour will not be tolerated."
      },
    ]
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: [
      {
        subtitle: "Swasthgram Content",
        text: "All content on our website and app — including text, images, logos, videos, and programme materials — is the intellectual property of Swasthgram Global Foundation and is protected by applicable copyright and trademark laws."
      },
      {
        subtitle: "Limited Licence",
        text: "We grant you a limited, non-exclusive, non-transferable licence to access and use our content for personal, non-commercial purposes. Any other use requires prior written permission from Swasthgram."
      },
      {
        subtitle: "Innovations & Patents",
        text: "Swasthgram's technological innovations, including the Lab-on-Bike, Lab-in-a-Box, and Shudhvayu air purification system, are proprietary inventions. Reproduction, reverse engineering, or commercial use without authorisation is strictly prohibited."
      },
    ]
  },
  {
    id: "disclaimers",
    title: "Disclaimers & Liability",
    content: [
      {
        subtitle: "As-Is Basis",
        text: "Our services are provided on an 'as is' and 'as available' basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability or fitness for a particular purpose."
      },
      {
        subtitle: "Limitation of Liability",
        text: "To the fullest extent permitted by law, Swasthgram shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services, even if we have been advised of the possibility of such damages."
      },
      {
        subtitle: "Third-Party Links",
        text: "Our website may contain links to third-party websites. Swasthgram is not responsible for the content, privacy practices, or terms of those sites. Accessing third-party links is at your own risk."
      },
    ]
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: [
      {
        subtitle: "Jurisdiction",
        text: "These Terms shall be governed by and construed in accordance with the laws of India. For donors and users in the United States, applicable US federal and state laws shall also apply where relevant."
      },
      {
        subtitle: "Dispute Resolution",
        text: "Any disputes arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be subject to arbitration in New Delhi, India, in accordance with applicable arbitration rules."
      },
    ]
  },
  {
    id: "modifications",
    title: "Modifications to Terms",
    content: [
      {
        subtitle: "Right to Modify",
        text: "Swasthgram reserves the right to modify these Terms at any time. We will provide notice of significant changes through our website or by email to registered users. Your continued use of our services after changes constitutes acceptance of the revised Terms."
      },
    ]
  },
];

export default function TermsOfService() {
  useEffect(() => { document.title = "Terms of Service | Swasthgram"; }, []);
  const [activeSection, setActiveSection] = useState("acceptance");

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
              <ScrollText size={24} color={cc.goldLight} />
            </div>
            <div className="tag" style={{ color: cc.goldSoft }}>Legal</div>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>Terms of Service</h1>
          <p className="sans" style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.7 }}>
            Please read these terms carefully before using Swasthgram's website, app, or services. By using our platform, you agree to these terms.
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
                  <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${cc.border}` }}>
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
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Have questions about our Terms?</h3>
                <p className="sans" style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>Our team is happy to clarify any aspect of these terms.</p>
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