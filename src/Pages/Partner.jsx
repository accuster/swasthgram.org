import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { HeartHandshake, CheckCircle, AlertCircle, Loader } from "lucide-react";

const C = {
  forest: "#1B6B3A", forestDark: "#145A2F", forestDeep: "#0E4422",
  leaf: "#2E8B4F", gold: "#C8963E", goldLight: "#E8C76A",
  warmBg: "#FDFBF7", cream: "#F8F5EE", white: "#FFFFFF",
  text: "#1F2937", textMid: "#4B5563", textLight: "#6B7280", border: "#E8E4DC",
};

const PARTNER_TYPES = [
  "NGO / Non-profit",
  "Corporate",
  "Government Organization",
  "Individual",
  "Philanthropist",
  "Other",
];

const API_BASE = "/api";

export default function PartnerPage() {
  const [partnerType, setPartnerType] = useState("");
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [country, setCountry]   = useState("");
  const [email, setEmail]       = useState("");
  const [org, setOrg]           = useState("");
  const [website, setWebsite]   = useState("");
  const [notes, setNotes]       = useState("");

  const [errors, setErrors] = useState({});
  const [step, setStep]     = useState("form"); // form | submitting | success | error
  const [errMsg, setErrMsg] = useState("");

  function validate() {
    const e = {};
    if (!partnerType)      e.partnerType = true;
    if (!name.trim())      e.name = true;
    if (!phone.trim())     e.phone = true;
    if (!country.trim())   e.country = true;
    if (!email.trim())     e.email = true;
    if (!org.trim())       e.org = true;
    if (!notes.trim())     e.notes = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStep("submitting");
    setErrMsg("");
    try {
      const res = await fetch(`${API_BASE}/partner-inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerType, name, phone, country, email, organization: org, website, notes }),
      });
      const data = await res.json();
      if (res.ok && data.success) setStep("success");
      else { setErrMsg(data.error || "Something went wrong. Please try again."); setStep("error"); }
    } catch {
      setErrMsg("Could not reach the server. Please check your connection and try again.");
      setStep("error");
    }
  }

  const inp = (hasErr) => ({
    width: "100%", padding: "12px 14px",
    border: `1.5px solid ${hasErr ? "#dc2626" : C.border}`,
    borderRadius: 10, fontFamily: "'Inter', sans-serif", fontSize: 14,
    background: "#fff", color: C.text, outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  const label = {
    fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, color: C.textLight,
    display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
  };

  const Req = () => <span style={{ color: "#dc2626" }}> *</span>;

  const wrap = { fontFamily: "'Libre Baskerville',Georgia,serif", background: C.warmBg, minHeight: "100vh" };

  if (step === "success") return (
    <div style={wrap}>
      <Header />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "160px 24px 120px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0fdf4", border: `2px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle size={36} color={C.forest} />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10 }}>Thank you, {name}!</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.textMid, lineHeight: 1.7, marginBottom: 24 }}>
          We've received your partnership enquiry. Our team reviews every request personally and
          will get back to you at <strong>{email}</strong> within 2–3 business days.
        </p>
        <a href="/" style={{ textDecoration: "none" }}>
          <button style={{ fontFamily: "'Inter',sans-serif", background: C.forest, color: "#fff", fontWeight: 700, border: "none", padding: "13px 32px", borderRadius: 10, cursor: "pointer", fontSize: 15 }}>
            Back to Home
          </button>
        </a>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={wrap}>
      <Header />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.forestDeep}, ${C.forest})`, padding: "150px 24px 64px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)",
            color: C.goldLight, fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", padding: "6px 14px", borderRadius: 20, marginBottom: 20,
          }}>
            <HeartHandshake size={14} /> Partnerships
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#fff", marginBottom: 14, lineHeight: 1.25 }}>
            Partner with Swasthgram
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
            Non-profits, corporates, government bodies, philanthropists and individuals —
            if you want to help bring health camps and wellness programs to underserved
            communities, we'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 100px" }}>
        <form onSubmit={handleSubmit} noValidate style={{
          background: C.white, borderRadius: 16, padding: "32px", border: `1px solid ${C.border}`,
        }}>

          {/* Partner type */}
          <div style={{ marginBottom: 24 }}>
            <label style={label}>Partner Type<Req /></label>
            <select
              value={partnerType}
              onChange={(e) => setPartnerType(e.target.value)}
              style={{ ...inp(errors.partnerType), appearance: "auto", cursor: "pointer" }}
            >
              <option value="">Select partner type…</option>
              {PARTNER_TYPES.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>

          {/* Name / Phone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={label}>Your Name<Req /></label>
              <input style={inp(errors.name)} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <label style={label}>Phone<Req /></label>
              <input style={inp(errors.phone)} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
            </div>
          </div>

          {/* Country / Email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={label}>Country<Req /></label>
              <input style={inp(errors.country)} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
            </div>
            <div>
              <label style={label}>Email<Req /></label>
              <input type="email" style={inp(errors.email)} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>

          {/* Organization name */}
          <div style={{ marginBottom: 24 }}>
            <label style={label}>Organization Name<Req /></label>
            <input style={inp(errors.org)} value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Organization / Company / Agency" />
          </div>

          {/* Website */}
          <div style={{ marginBottom: 24 }}>
            <label style={label}>Website or Profile (optional)</label>
            <input style={inp(false)} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 28 }}>
            <label style={label}>Tell Us More / Where Did You Learn About Us<Req /></label>
            <textarea rows={4} style={{ ...inp(errors.notes), resize: "vertical", fontFamily: "'Inter',sans-serif" }}
              value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything that helps us understand the partnership you have in mind…" />
          </div>

          {step === "error" && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
              <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#991b1b" }}>{errMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={step === "submitting"}
            style={{
              width: "100%", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15,
              background: C.forest, color: "#fff", border: "none", padding: "14px 24px",
              borderRadius: 10, cursor: step === "submitting" ? "not-allowed" : "pointer",
              opacity: step === "submitting" ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {step === "submitting" ? (<><Loader size={16} className="spin" /> Submitting…</>) : "Submit Enquiry"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <Footer />
    </div>
  );
}
