import { CheckCircle, ArrowLeft } from "lucide-react";

const COLORS = {
  forest: "#1B6B3A", forestDark: "#145A2F",
  warmBg: "#FDFBF7",
  text: "#1F2937", textMid: "#4B5563",
};
const cc = COLORS;

export default function NewsletterThankYouPage() {
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: cc.warmBg, color: cc.text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
      <div style={{ maxWidth: 440 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#E7F0E9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
          <CheckCircle size={32} color={cc.forest} strokeWidth={1.8} />
        </div>
        <h1 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(22px,3vw,26px)", fontWeight: 700, color: cc.text, marginBottom: 14 }}>
          Welcome to Swasthgram Global Foundation
        </h1>
        <p style={{ fontSize: 14, color: cc.textMid, lineHeight: 1.7, marginBottom: 10 }}>
          You've successfully subscribed to our newsletter.
        </p>
        <p style={{ fontSize: 14, color: cc.textMid, lineHeight: 1.7, marginBottom: 32 }}>
          We've sent a confirmation link to your email. Please confirm your subscription to start receiving our latest updates from the field.
        </p>
        <a
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 14, color: "#fff", background: cc.forest, padding: "13px 26px", borderRadius: 8, textDecoration: "none" }}
        >
          <ArrowLeft size={16} /> Back to Home
        </a>
      </div>
    </div>
  );
}
