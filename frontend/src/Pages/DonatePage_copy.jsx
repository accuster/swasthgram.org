import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import { Heart, Lock, CheckCircle, AlertCircle, Loader, HeartHandshake, Shield, Users, Tent, Microscope } from "lucide-react";

const C = {
  forest: "#1B6B3A", forestDark: "#145A2F", forestDeep: "#0E4422",
  leaf: "#2E8B4F", gold: "#C8963E", goldLight: "#E8C76A",
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

const PROGRAMS = [
  { value: "SwasthManthan", label: "SwasthManthan", sub: "Last-mile health screening" },
  { value: "Saksham",       label: "Saksham",       sub: "Youth skilling & empowerment" },
  { value: "Shudhvayu",     label: "Shudhvayu",     sub: "Clean air initiative" },
  { value: "General",       label: "Where needed most", sub: "Allocated by Swasthgram" },
];

const API_BASE = "/api";
let stripePromise = null;

async function getStripe() {
  if (!stripePromise) {
    const { stripeKey } = await fetch("/api/config").then(r => r.json());
    stripePromise = window.Stripe
      ? Promise.resolve(window.Stripe(stripeKey))
      : new Promise(resolve => {
          const s = document.createElement("script");
          s.src = "https://js.stripe.com/v3/";
          s.onload = () => resolve(window.Stripe(stripeKey));
          document.head.appendChild(s);
        });
  }
  return stripePromise;
}

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

export default function DonatePage() {
  useEffect(() => { document.title = "Donate — Swasthgram"; }, []);

  // Form state
  const [region, setRegion]       = useState("domestic");
  const [program, setProgram]     = useState("General");
  const [frequency, setFrequency] = useState("once");
  const [amount, setAmount]       = useState("");
  const [customAmt, setCustomAmt] = useState("");
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [state, setState]         = useState("");
  const [agreed, setAgreed]       = useState(false);
  const [errors, setErrors]       = useState({});
  const [step, setStep]           = useState("form");
  const [errMsg, setErrMsg]       = useState("");
  const [stripeReady, setStripeReady] = useState(false);
  const [confirming, setConfirming]   = useState(false);
  const [stateOpen, setStateOpen]     = useState(false);

  const stripeRef   = useRef(null);
  const elementsRef = useRef(null);
  const mountedRef  = useRef(false);
  const stateRef    = useRef(null);

  const isDomestic = region === "domestic";
  const finalAmount = amount === "custom" ? customAmt : amount;

  const domesticPresets = ["500", "1000", "5000", "10000", "25000"];
  const usaPresets      = ["25", "50", "100", "250", "500"];
  const presets = isDomestic ? domesticPresets : usaPresets;

  useEffect(() => {
    function handler(e) {
      if (stateRef.current && !stateRef.current.contains(e.target)) setStateOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (step !== "stripe-card" || mountedRef.current) return;
    mountedRef.current = true;
    (async () => {
      const stripe = await getStripe();
      stripeRef.current = stripe;
      const res = await fetch(`${API_BASE}/create-stripe-intent`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(finalAmount), name, email, phone, state, program, frequency }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) { setErrMsg(data.error || "Could not initialise payment."); setStep("error"); return; }
      const elements = stripe.elements({ clientSecret: data.clientSecret, appearance: { theme: "stripe" } });
      elementsRef.current = elements;
      const paymentElement = elements.create("payment");
      paymentElement.on("ready", () => setStripeReady(true));
      paymentElement.mount("#stripe-payment-element-donate");
    })();
    return () => { mountedRef.current = false; };
  }, [step]);

  const handleStripeConfirm = async () => {
    if (!stripeRef.current || !elementsRef.current) return;
    setConfirming(true);
    try {
      const { error, paymentIntent } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: { return_url: `${window.location.origin}/thank-you` },
        redirect: "if_required",
      });
      if (error) { setErrMsg(error.message); setStep("error"); }
      else if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
        setStep("processing");
        const confirmRes = await fetch(`${API_BASE}/confirm-stripe-payment`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id, name, email, phone, state, amount: finalAmount, program, frequency }),
        });
        const confirmData = await confirmRes.json();
        if (confirmData.token) { window.location.href = `/thank-you?token=${confirmData.token}`; return; }
        setStep("success");
      } else { setErrMsg("Payment could not be completed."); setStep("error"); }
    } catch (err) { setErrMsg(err.message || "Unexpected error."); setStep("error"); }
    finally { setConfirming(false); }
  };

  const handleRazorpay = async () => {
    setStep("processing");
    const loaded = await loadRazorpay();
    if (!loaded) { setErrMsg("Could not load Razorpay."); setStep("error"); return; }
    const res = await fetch(`${API_BASE}/create-razorpay-order`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(finalAmount), name, email, phone, state, program, frequency }),
    });
    const data = await res.json();
    if (!res.ok || !data.orderId) { setErrMsg(data.error || "Could not create order."); setStep("error"); return; }
    new window.Razorpay({
      key: data.keyId, amount: data.amount, currency: data.currency,
      name: "Swasthgram", description: `${program} donation`,
      order_id: data.orderId, prefill: { name, email, contact: phone },
      theme: { color: C.forest },
      handler: async (response) => {
        const verify = await fetch(`${API_BASE}/verify-razorpay-payment`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, name, email, phone, state, amount: finalAmount, program, frequency }),
        });
        const vd = await verify.json();
        if (vd.success && vd.token) { window.location.href = `/thank-you?token=${vd.token}`; }
        else if (vd.success) { setStep("success"); }
        else { setErrMsg(vd.error || "Verification failed."); setStep("error"); }
      },
      modal: { ondismiss: () => setStep("form") },
    }).open();
  };

  function validate() {
    const e = {};
    if (!name.trim())  e.name  = true;
    if (!email.trim()) e.email = true;
    if (!phone.trim()) e.phone = true;
    if (!finalAmount || isNaN(Number(finalAmount)) || Number(finalAmount) <= 0) e.amount = true;
    if (!agreed) e.agreed = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setErrMsg("");
    if (isDomestic) handleRazorpay();
    else { mountedRef.current = false; setStep("stripe-card"); }
  }

  const inp = (hasErr) => ({
    width: "100%", padding: "12px 14px",
    border: `1.5px solid ${hasErr ? "#dc2626" : C.border}`,
    borderRadius: 10, fontFamily: "'Inter', sans-serif", fontSize: 14,
    background: "#fff", color: C.text, outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  const label = { fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, color: C.textLight, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 };

  // ── Step screens ──
  if (step === "success") return (
    <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", background: C.warmBg, minHeight: "100vh" }}>
      <Header />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "160px 24px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0fdf4", border: `2px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle size={36} color={C.forest} />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10 }}>Thank you, {name}!</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.textMid, lineHeight: 1.7, marginBottom: 24 }}>
          Your donation to <strong>{program}</strong> has been received. A receipt will be sent to {email}.
        </p>
        <button onClick={() => { setStep("form"); setAmount(""); setCustomAmt(""); setName(""); setEmail(""); setPhone(""); setState(""); setAgreed(false); }}
          style={{ fontFamily: "'Inter',sans-serif", background: C.forest, color: "#fff", fontWeight: 700, border: "none", padding: "13px 32px", borderRadius: 10, cursor: "pointer", fontSize: 15 }}>
          Donate Again
        </button>
      </div>
      <Footer />
    </div>
  );

  if (step === "error") return (
    <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", background: C.warmBg, minHeight: "100vh" }}>
      <Header />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "160px 24px", textAlign: "center" }}>
        <AlertCircle size={48} color="#dc2626" style={{ marginBottom: 16 }} />
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Something went wrong</h3>
        <p style={{ fontFamily: "'Inter',sans-serif", color: C.textMid, marginBottom: 24, fontSize: 14 }}>{errMsg}</p>
        <button onClick={() => { setStep("form"); setErrMsg(""); }}
          style={{ fontFamily: "'Inter',sans-serif", background: C.forest, color: "#fff", fontWeight: 700, border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 14 }}>
          ← Try Again
        </button>
      </div>
      <Footer />
    </div>
  );

  if (step === "processing") return (
    <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", background: C.warmBg, minHeight: "100vh" }}>
      <Header />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "160px 24px", textAlign: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <Loader size={48} color={C.forest} style={{ marginBottom: 16, animation: "spin 1s linear infinite" }} />
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.textMid }}>Processing your donation…</p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", background: C.warmBg, color: C.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        .sans { font-family: 'Inter', sans-serif; }
        .preset-btn { transition: all 0.15s; }
        .preset-btn:hover { border-color: ${C.forest} !important; }
        .prog-btn { transition: all 0.2s; cursor: pointer; }
        .prog-btn:hover { border-color: ${C.forest} !important; }
        @media (max-width: 900px) {
          .donate-layout { flex-direction: column !important; }
          .donate-sidebar { display: none !important; }
          .preset-grid { grid-template-columns: repeat(3,1fr) !important; }
          .prog-grid { grid-template-columns: 1fr 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Header />

      {/* Hero strip */}
      <div style={{ background: `linear-gradient(135deg, ${C.forestDeep} 0%, ${C.forest} 100%)`, padding: "100px 24px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 12 }}>Support the Mission</div>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 14 }}>
            One donation.<br />Hundreds of lives changed.
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 520, lineHeight: 1.75 }}>
            Your contribution funds health screenings, youth training, and clean air solutions that reach communities hospitals never do.
          </p>
          {/* Trust chips */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24, marginBottom: 32 }}>
            {[
              { icon: <Shield size={13} />, text: "80G & 12A Certified" },
              { icon: <Shield size={13} />, text: "501(c)(3) USA" },
              { icon: <Lock size={13} />,   text: "Secured by Razorpay & Stripe" },
            ].map((c, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "5px 12px", fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                {c.icon} {c.text}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a
              href="https://www.every.org/swasthgram-global-foundation?theme_color=4169E1&designation=Donation&utm_campaign=donate-link#/donate"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#fff", color: "#1B6B3A",
                fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15,
                padding: "16px 32px", borderRadius: 12, textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)"; }}
            >
              <Heart size={18} color="#1B6B3A" fill="#1B6B3A" />
              Donate via Every.org
              <span style={{ fontSize: 11, fontWeight: 500, color: "#2E8B4F", background: "#e8f5ee", padding: "2px 8px", borderRadius: 6 }}>USA · Tax Deductible</span>
            </a>
            <a
              href="https://donate.stripe.com/cNi7sL95i3YV3Yl97Aew800"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.12)", color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.3)",
                fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15,
                padding: "16px 32px", borderRadius: 12, textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Donate via Stripe
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)" }}>Global · Card</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div id="donate-form" style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div className="donate-layout" style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>

          {/* ── FORM ── */}
          <div style={{ flex: "1 1 600px" }}>

            {step === "stripe-card" ? (
              <div style={{ background: C.white, borderRadius: 16, padding: 32, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                  Complete your donation
                </h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.textLight, marginBottom: 24 }}>
                  {program} · {frequency === "once" ? "One-time" : frequency} · ${Number(finalAmount).toLocaleString()} USD
                </p>
                <div id="stripe-payment-element-donate" style={{ background: "#f9fafb", borderRadius: 10, padding: 16, marginBottom: 20, minHeight: 180 }} />
                {!stripeReady && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.textLight, marginBottom: 12, textAlign: "center" }}>Loading payment form…</p>}
                <button onClick={handleStripeConfirm} disabled={!stripeReady || confirming}
                  style={{ width: "100%", padding: "15px", border: "none", borderRadius: 12, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, cursor: (stripeReady && !confirming) ? "pointer" : "not-allowed", background: (stripeReady && !confirming) ? C.forest : "#e5e7eb", color: (stripeReady && !confirming) ? "#fff" : C.textLight, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
                  <HeartHandshake size={18} />
                  {confirming ? "Processing…" : stripeReady ? `Confirm Donation — $${Number(finalAmount).toLocaleString()} USD` : "Loading…"}
                </button>
                <button onClick={() => { setStep("form"); mountedRef.current = false; setStripeReady(false); setConfirming(false); }}
                  style={{ width: "100%", marginTop: 10, padding: 10, background: "transparent", border: "none", fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.textLight, cursor: "pointer" }}>
                  ← Back
                </button>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textLight }}>
                  <Lock size={11} /> Secured by Stripe · IRS 501(c)(3) tax-deductible
                </div>
              </div>
            ) : (
            <form onSubmit={handleSubmit} noValidate>

              {/* ── Region toggle ── */}
              <div style={{ background: C.white, borderRadius: 16, padding: "20px 24px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <div style={{ ...label, marginBottom: 12 }}>I am donating from</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[{ key: "domestic", flag: "🇮🇳", label: "India" }, { key: "us", flag: "🇺🇸", label: "USA" }].map(opt => (
                    <button key={opt.key} type="button"
                      onClick={() => { setRegion(opt.key); setAmount(""); setCustomAmt(""); setErrors({}); }}
                      style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid ${region === opt.key ? C.forest : C.border}`, background: region === opt.key ? "#f0fdf4" : "#fff", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: region === opt.key ? C.forest : C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
                      <span style={{ fontSize: 20 }}>{opt.flag}</span> {opt.label}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 12, fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textLight }}>
                  {isDomestic
                    ? <span>Tax benefits under <strong style={{ color: C.text }}>Section 80G & 12A</strong> (India)</span>
                    : <span>Tax-deductible via <strong style={{ color: C.text }}>IRS 501(c)(3)</strong> (USA)</span>}
                </div>
              </div>

              {/* ── Program ── */}
              <div style={{ background: C.white, borderRadius: 16, padding: "20px 24px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <div style={{ ...label, marginBottom: 12 }}>Choose a program</div>
                <div className="prog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                  {PROGRAMS.map(p => (
                    <div key={p.value} className="prog-btn"
                      onClick={() => setProgram(p.value)}
                      style={{ padding: "12px 10px", borderRadius: 10, border: `2px solid ${program === p.value ? C.forest : C.border}`, background: program === p.value ? "#f0fdf4" : "#fff", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12, color: program === p.value ? C.forest : C.text, marginBottom: 3 }}>{p.label}</div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: C.textLight, lineHeight: 1.4 }}>{p.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Frequency ── */}
              <div style={{ background: C.white, borderRadius: 16, padding: "20px 24px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <div style={{ ...label, marginBottom: 12 }}>Frequency</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                  {[{ v: "once", l: "One-time" }, { v: "monthly", l: "Monthly" }, { v: "quarterly", l: "Quarterly" }, { v: "yearly", l: "Yearly" }].map(f => (
                    <button key={f.v} type="button" onClick={() => setFrequency(f.v)}
                      style={{ padding: "11px 8px", borderRadius: 10, border: `2px solid ${frequency === f.v ? C.forest : C.border}`, background: frequency === f.v ? C.forest : "#fff", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12, color: frequency === f.v ? "#fff" : C.text, cursor: "pointer", transition: "all 0.2s" }}>
                      {f.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Amount ── */}
              <div style={{ background: C.white, borderRadius: 16, padding: "20px 24px", border: `1px solid ${errors.amount ? "#dc2626" : C.border}`, marginBottom: 16 }}>
                <div style={{ ...label, marginBottom: 12 }}>Donation amount <span style={{ color: "#dc2626" }}>*</span></div>
                <div className="preset-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 12 }}>
                  {presets.map(v => (
                    <button key={v} type="button" className="preset-btn"
                      onClick={() => { setAmount(v); setCustomAmt(""); setErrors(er => ({ ...er, amount: false })); }}
                      style={{ padding: "11px 6px", borderRadius: 10, border: `2px solid ${amount === v ? C.forest : C.border}`, background: amount === v ? "#f0fdf4" : "#fff", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, color: amount === v ? C.forest : C.text, cursor: "pointer" }}>
                      {isDomestic ? "₹" : "$"}{Number(v).toLocaleString()}
                    </button>
                  ))}
                </div>
                {/* Custom amount */}
                <div style={{ display: "flex", alignItems: "stretch", border: `1.5px solid ${amount === "custom" ? C.forest : C.border}`, borderRadius: 10, overflow: "hidden" }}
                  onFocusCapture={e => { setAmount("custom"); e.currentTarget.style.borderColor = C.forest; }}
                  onBlurCapture={e => { if (!customAmt) setAmount(""); e.currentTarget.style.borderColor = amount === "custom" ? C.forest : C.border; }}>
                  <div style={{ background: "#f9fafb", padding: "0 14px", display: "flex", alignItems: "center", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15, color: C.forest, borderRight: `1.5px solid ${C.border}` }}>
                    {isDomestic ? "₹" : "$"}
                  </div>
                  <input type="number" min="1" value={customAmt}
                    onChange={e => { setCustomAmt(e.target.value); setAmount("custom"); setErrors(er => ({ ...er, amount: false })); }}
                    placeholder="Enter custom amount"
                    style={{ flex: 1, border: "none", padding: "12px 14px", fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.text, outline: "none", background: "transparent" }} />
                </div>
              </div>

              {/* ── Personal details ── */}
              <div style={{ background: C.white, borderRadius: 16, padding: "20px 24px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <div style={{ ...label, marginBottom: 16 }}>Your details</div>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <div style={label}>Full Name <span style={{ color: "#dc2626" }}>*</span></div>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp(errors.name)}
                      onFocus={e => { e.target.style.borderColor = C.forest; e.target.style.boxShadow = "0 0 0 3px rgba(27,107,58,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = errors.name ? "#dc2626" : C.border; e.target.style.boxShadow = "none"; }} />
                  </div>
                  <div>
                    <div style={label}>Email <span style={{ color: "#dc2626" }}>*</span></div>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" style={inp(errors.email)}
                      onFocus={e => { e.target.style.borderColor = C.forest; e.target.style.boxShadow = "0 0 0 3px rgba(27,107,58,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = errors.email ? "#dc2626" : C.border; e.target.style.boxShadow = "none"; }} />
                  </div>
                </div>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <div style={label}>Phone <span style={{ color: "#dc2626" }}>*</span></div>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number" style={inp(errors.phone)}
                      onFocus={e => { e.target.style.borderColor = C.forest; e.target.style.boxShadow = "0 0 0 3px rgba(27,107,58,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = errors.phone ? "#dc2626" : C.border; e.target.style.boxShadow = "none"; }} />
                  </div>
                  <div ref={stateRef}>
                    <div style={label}>State / UT <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></div>
                    <div style={{ position: "relative" }}>
                      <button type="button" onClick={() => setStateOpen(o => !o)}
                        style={{ width: "100%", height: 46, padding: "0 14px", border: `1.5px solid ${stateOpen ? C.forest : C.border}`, borderRadius: 10, background: "#fff", fontFamily: "'Inter',sans-serif", fontSize: 14, color: state ? C.text : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                        <span>{state || "Select your state"}</span>
                        <span style={{ fontSize: 12, color: C.forest, transition: "transform 0.2s", transform: stateOpen ? "rotate(180deg)" : "none" }}>▾</span>
                      </button>
                      {stateOpen && (
                        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: "0 12px 28px rgba(0,0,0,0.1)", padding: 6, zIndex: 30, maxHeight: 220, overflowY: "auto" }}>
                          {INDIAN_STATES.map((s, idx) => {
                            const isSep = s.startsWith("—");
                            if (isSep) return <div key={idx} style={{ padding: "6px 12px", fontSize: 10, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, borderTop: `1px solid ${C.border}`, marginTop: 4, pointerEvents: "none", fontFamily: "'Inter',sans-serif" }}>{s}</div>;
                            return (
                              <div key={s} onClick={() => { setState(s); setStateOpen(false); }}
                                style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.text, background: state === s ? "#f0fdf4" : "transparent", fontWeight: state === s ? 600 : 400 }}
                                onMouseEnter={e => { if (state !== s) e.currentTarget.style.background = "#f0fdf4"; }}
                                onMouseLeave={e => { if (state !== s) e.currentTarget.style.background = "transparent"; }}>
                                {s}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Agree ── */}
              <div style={{ background: C.white, borderRadius: 16, padding: "18px 24px", border: `1px solid ${errors.agreed ? "#dc2626" : C.border}`, marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(er => ({ ...er, agreed: false })); }}
                    style={{ marginTop: 2, width: 17, height: 17, accentColor: C.forest, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: errors.agreed ? "#dc2626" : C.textMid }}>
                    By donating, I agree to the{" "}
                    <a href="/terms-of-service" target="_blank" style={{ color: C.forest, textDecoration: "underline" }}>Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy-policy" target="_blank" style={{ color: C.forest, textDecoration: "underline" }}>Privacy Policy</a>.
                  </span>
                </label>
              </div>

              {errMsg && (
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#dc2626", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                  {errMsg}
                </div>
              )}

              {/* ── Summary + Submit ── */}
              <div style={{ background: C.forest, borderRadius: 16, padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>{program} · {frequency === "once" ? "One-time" : frequency}</div>
                    <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 26, fontWeight: 700, color: "#fff" }}>
                      {finalAmount && Number(finalAmount) > 0
                        ? `${isDomestic ? "₹" : "$"}${Number(finalAmount).toLocaleString()}`
                        : <span style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>Select an amount above</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>via</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
                      {isDomestic ? "Razorpay" : "Stripe"}
                    </div>
                  </div>
                </div>
                <button type="submit"
                  style={{ width: "100%", padding: "16px", border: "none", borderRadius: 12, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, background: "#fff", color: C.forest, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <Heart size={18} color={C.forest} />
                  {isDomestic ? "Donate via Razorpay" : "Continue to Card Payment"}
                </button>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  <Lock size={11} /> Secure & tax-deductible as per applicable laws
                </div>
              </div>

            </form>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="donate-sidebar" style={{ flex: "0 0 280px", position: "sticky", top: 100 }}>

            {/* Impact preview */}
            <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Your Impact</div>
              {[
                { icon: <Users size={16} color={C.forest} />,      n: "6L+",    l: "Beneficiaries served" },
                { icon: <Tent size={16} color={C.forest} />,       n: "9,360+", l: "Health camps conducted" },
                { icon: <Microscope size={16} color={C.forest} />, n: "21,750+",l: "Screenings done" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 16, color: C.forest }}>{s.n}</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textLight }}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Certifications</div>
              {[
                { label: "12A Certified", color: C.forest, bg: "#f0fdf4" },
                { label: "80G Certified", color: C.forest, bg: "#f0fdf4" },
                { label: "501(c)(3) USA",  color: "#1d4ed8", bg: "#eff6ff" },
                { label: "PwC Validated",  color: "#7c3aed", bg: "#f5f3ff" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 3 ? 10 : 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: C.text }}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div style={{ background: `linear-gradient(135deg, ${C.forestDeep}, ${C.forest})`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 28, color: "rgba(255,255,255,0.4)", lineHeight: 1, marginBottom: 10 }}>"</div>
              <p style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 14 }}>
                We are not a charity. We empower people for sustainable development.
              </p>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>— Amit Bhatnagar, Founder</div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
