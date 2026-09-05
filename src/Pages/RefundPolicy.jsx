import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";
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
    id: "general-policy",
    title: "General Refund Policy",
    content: [
      {
        subtitle: "Nature of Donations",
        text: "Swasthgram is a registered non-profit organisation. All donations made to Swasthgram are voluntary contributions toward our public health, youth skilling, and environmental programmes. As donations are deployed promptly toward programme delivery, they are generally considered non-refundable."
      },
      {
        subtitle: "Commitment to Fairness",
        text: "While donations are non-refundable as a general rule, Swasthgram is committed to fairness and transparency. We review all refund requests on a case-by-case basis and will make every reasonable effort to resolve genuine concerns promptly."
      },
    ]
  },
  {
    id: "eligible-refunds",
    title: "Eligible Refund Scenarios",
    content: [
      {
        subtitle: "Duplicate Transactions",
        text: "If your payment was processed more than once due to a technical error or accidental double submission, you are entitled to a full refund of the duplicate charge. Please contact us within 7 days of the transaction with your payment reference numbers."
      },
      {
        subtitle: "Unauthorised Transactions",
        text: "If you believe a donation was made from your account without your knowledge or authorisation, please notify us immediately at support@swasthgram.org. We will investigate and, if confirmed, process a full refund and assist you in securing your account."
      },
      {
        subtitle: "Technical Payment Failures",
        text: "In cases where your payment was debited but the transaction was not recorded or confirmed on our platform, we will investigate and either confirm receipt or process a full refund within 7 business days."
      },
      {
        subtitle: "Incorrect Donation Amount",
        text: "If a technical error on our platform caused an incorrect amount to be charged — different from the amount you intended to donate — we will refund the difference upon verification."
      },
    ]
  },
  {
    id: "non-eligible-refunds",
    title: "Non-Eligible Scenarios",
    content: [
      {
        subtitle: "Change of Mind",
        text: "Refunds will not be issued simply because you have changed your mind about donating. We encourage donors to carefully consider their contribution before completing a transaction."
      },
      {
        subtitle: "Tax Receipt Concerns",
        text: "If you are requesting a refund because you did not receive a tax receipt (80G, 12A, or 501(c)(3)), please contact us — we will re-issue the receipt promptly. A missing receipt does not necessitate a refund."
      },
      {
        subtitle: "Programme Disagreement",
        text: "Refunds will not be issued due to disagreement with how Swasthgram allocates or utilises funds across its programmes. Fund utilisation is disclosed transparently through our app and annual reports."
      },
    ]
  },
  {
    id: "how-to-request",
    title: "How to Request a Refund",
    content: [
      {
        subtitle: "Contact Us Within 7 Days",
        text: "To request a refund, please email support@swasthgram.org within 7 days of the transaction date. Requests submitted after this window may not be eligible for processing."
      },
      {
        subtitle: "Information Required",
        text: "Please include the following in your refund request: your full name, the email address used for the donation, the transaction/payment reference ID, the amount and date of donation, and the reason for your refund request."
      },
      {
        subtitle: "Review Process",
        text: "Our team will acknowledge your request within 2 business days and complete the review within 5–7 business days. We may request additional information to verify the transaction."
      },
    ]
  },
  {
    id: "processing",
    title: "Refund Processing",
    content: [
      {
        subtitle: "Refund Method",
        text: "Approved refunds will be credited back to the original payment method used at the time of donation — whether that is a credit/debit card, UPI, net banking, or international card via Stripe."
      },
      {
        subtitle: "Processing Time",
        text: "Once approved, refunds typically reflect in your account within 5–10 business days for Indian transactions (via Razorpay) and 7–14 business days for international transactions (via Stripe), depending on your bank or card issuer."
      },
      {
        subtitle: "Tax Receipt Reversal",
        text: "If a refund is processed for a donation for which a tax receipt was issued, the receipt will be considered void. Donors are responsible for updating their tax filings accordingly. Swasthgram will notify you if your receipt is cancelled."
      },
      {
        subtitle: "Currency & Conversion",
        text: "Refunds will be processed in the original currency of the donation. Swasthgram is not responsible for any exchange rate differences or bank fees incurred during the refund process for international transactions."
      },
    ]
  },
  {
    id: "payment-processors",
    title: "Payment Processor Policies",
    content: [
      {
        subtitle: "Razorpay (India)",
        text: "Donations made within India are processed through Razorpay. Razorpay's own refund and chargeback policies also apply. In the event of a dispute, Swasthgram will cooperate fully with Razorpay's resolution process."
      },
      {
        subtitle: "Stripe (International)",
        text: "Donations made from outside India are processed through Stripe. Stripe's terms of service and dispute resolution policies apply in addition to this policy. For chargeback requests through your card issuer, please contact us first so we can resolve the issue directly."
      },
      {
        subtitle: "Chargebacks",
        text: "We strongly encourage donors to contact us before initiating a chargeback with their bank or card issuer, as chargebacks can result in additional fees and delays. We are committed to resolving all genuine concerns directly and promptly."
      },
    ]
  },
  {
    id: "contact",
    title: "Contact for Refunds",
    content: [
      {
        subtitle: "Dedicated Support",
        text: "For all refund-related queries, please reach out to our support team at support@swasthgram.org. Include 'Refund Request' in the subject line for faster routing. You may also call us at +91 87507-40000 (India) during business hours (Mon–Fri, 10am–6pm IST)."
      },
      {
        subtitle: "Escalation",
        text: "If your concern is not resolved to your satisfaction within 14 days, you may escalate by writing to our Grievance Officer at the address below: Ground Floor, 424-CMR Building, Ghitorni, New Delhi. We are committed to resolving all escalations within 30 days."
      },
    ]
  },
];

export default function RefundPolicy() {
  useEffect(() => { document.title = "Refund Policy | Swasthgram"; }, []);
  const [activeSection, setActiveSection] = useState("general-policy");

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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8C76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M12 7v5l4 2" />
              </svg>
            </div>
            <div className="tag" style={{ color: cc.goldSoft }}>Legal</div>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>Refund Policy</h1>
          <p className="sans" style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.7 }}>
            We believe in complete transparency around donations. This policy explains when refunds apply and how to request one.
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
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Need help with a refund?</h3>
                <p className="sans" style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>Our support team will respond within 2 business days.</p>
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
