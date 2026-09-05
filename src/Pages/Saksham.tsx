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
import Footer from "../components/Footer";
import { GraduationCap, Handshake, Briefcase, Hospital, Globe, Microscope, Lock, HeartHandshake, CheckCircle, AlertCircle, Loader } from "lucide-react";

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

// ─── Stripe + Razorpay helpers ────────────────────────────────────────────────
const API_BASE = "/api";

let stripePromise: Promise<any> | null = null;
async function getStripe() {
  if (!stripePromise) {
    const { stripeKey } = await fetch("/api/config").then(r => r.json());
    stripePromise = (window as any).Stripe
      ? Promise.resolve((window as any).Stripe(stripeKey))
      : new Promise((resolve) => {
          const s = document.createElement("script"); s.src = "https://js.stripe.com/v3/";
          s.onload = () => resolve((window as any).Stripe(stripeKey));
          document.head.appendChild(s);
        });
  }
  return stripePromise;
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

// ─── Donation Form (Saksham locked) ──────────────────────────────────────────
const LOCKED_PROGRAM = "Saksham";

function DonationForm() {
  const [region, setRegion]       = useState("domestic");
  const [amount, setAmount]       = useState("");
  const [frequency, setFrequency] = useState("once");
  const [freqOpen, setFreqOpen]   = useState(false);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [agreed, setAgreed]       = useState(false);
  const [errors, setErrors]       = useState<any>({});
  const [step, setStep]           = useState("form");
  const [stripeReady, setStripeReady] = useState(false);
  const [errMsg, setErrMsg]       = useState("");

  const stripeRef   = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  const mountedRef  = useRef(false);
  const freqRef     = useRef<HTMLDivElement>(null);
  const stateRef    = useRef<HTMLDivElement>(null);
  const [state, setState]           = useState("");
  const [stateOpen, setStateOpen]   = useState(false);

  const isDomestic = region === "domestic";
  const presets    = { us: [200, 500, 1000], domestic: [10000, 50000, 100000] };
  const freqOptions = [{ value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }, { value: "yearly", label: "Yearly" }];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (freqRef.current && !freqRef.current.contains(e.target as Node)) setFreqOpen(false);
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) setStateOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (step !== "stripe-card" || mountedRef.current) return;
    mountedRef.current = true;
    (async () => {
      const stripe = await getStripe(); stripeRef.current = stripe;
      const res = await fetch(`${API_BASE}/create-stripe-intent`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), name, email, phone, state, program: LOCKED_PROGRAM, frequency }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) { setErrMsg(data.error || "Could not initialise payment."); setStep("error"); return; }
      const elements = stripe.elements({ clientSecret: data.clientSecret, appearance: { theme: "stripe" } });
      elementsRef.current = elements;
      const paymentElement = elements.create("payment");
      paymentElement.on("ready", () => setStripeReady(true));
      paymentElement.mount("#stripe-payment-element-saksham");
    })();
    return () => { mountedRef.current = false; };
  }, [step]);

  const handleStripeConfirm = async () => {
    if (!stripeRef.current || !elementsRef.current) return;
    try {
      const { error, paymentIntent } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: { return_url: `${window.location.origin}/thank-you` },
        redirect: "if_required",
      });
      if (error) { setErrMsg(error.message); setStep("error"); }
      else if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
        setStep("processing");
        await fetch(`${API_BASE}/confirm-stripe-payment`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id, name, email, phone, state, amount, program: LOCKED_PROGRAM, frequency }),
        });
        setStep("success");
      } else { setErrMsg("Payment could not be completed. Please try again."); setStep("error"); }
    } catch (err: any) { setErrMsg(err.message || "Unexpected error."); setStep("error"); }
  };

  const handleRazorpay = async () => {
    setStep("processing");
    const loaded = await loadRazorpay();
    if (!loaded) { setErrMsg("Could not load Razorpay."); setStep("error"); return; }
    const res = await fetch(`${API_BASE}/create-razorpay-order`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), name, email, phone, state, program: LOCKED_PROGRAM, frequency }),
    });
    const data = await res.json();
    if (!res.ok || !data.orderId) { setErrMsg(data.error || "Could not create order."); setStep("error"); return; }
    new (window as any).Razorpay({
      key: data.keyId, amount: data.amount, currency: data.currency,
      name: "Swasthgram", description: `${LOCKED_PROGRAM} donation`,
      order_id: data.orderId, prefill: { name, email, contact: phone },
      theme: { color: C.forest },
      handler: async (response: any) => {
        const verify = await fetch(`${API_BASE}/verify-razorpay-payment`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, name, email, phone, state, amount, program: LOCKED_PROGRAM, frequency }),
        });
        const vd = await verify.json();
        if (vd.success) setStep("success");
        else { setErrMsg(vd.error || "Verification failed."); setStep("error"); }
      },
      modal: { ondismiss: () => setStep("form") },
    }).open();
  };

  function validate() {
    const e: any = {};
    if (!name.trim())  e.name  = true;
    if (!email.trim()) e.email = true;
    if (!phone.trim()) e.phone = true;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = true;
    if (!agreed) e.agreed = true;
    setErrors(e); return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault(); if (!validate()) return; setErrMsg("");
    if (isDomestic) handleRazorpay();
    else { mountedRef.current = false; setStep("stripe-card"); }
  }

  const inp = (hasErr: boolean) => ({
    width: "100%", padding: "13px 14px",
    border: `2px solid ${hasErr ? "#dc2626" : "#e5e7eb"}`,
    borderRadius: 10, fontFamily: "'Inter', sans-serif", fontSize: 14,
    background: "#fff", color: C.text, outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  });
  const labelStyle: React.CSSProperties = { fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 7 };

  if (step === "success") return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: C.white }}>
      <CheckCircle size={64} color={C.goldSoft} style={{ marginBottom: 20 }} />
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Thank you, {name}!</h2>
      <p className="sans" style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", maxWidth: 400, margin: "0 auto 24px", lineHeight: 1.6 }}>
        Your donation to <strong style={{ color: C.goldLight }}>Saksham</strong> has been received. A receipt will be sent to {email}.
      </p>
      <button onClick={() => { setStep("form"); setAmount(""); setName(""); setEmail(""); setPhone(""); setState(""); setAgreed(false); }}
        style={{ fontFamily: "Inter,sans-serif", background: C.gold, color: "#1a1a1a", fontWeight: 700, border: "none", padding: "12px 28px", borderRadius: 8, cursor: "pointer", fontSize: 15 }}>
        Make Another Donation
      </button>
    </div>
  );

  if (step === "error") return (
    <div style={{ textAlign: "center", padding: "40px 24px", color: C.white }}>
      <AlertCircle size={48} color="#f87171" style={{ marginBottom: 16 }} />
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Something went wrong</h3>
      <p className="sans" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 380, margin: "0 auto 20px", fontSize: 14 }}>{errMsg}</p>
      <button onClick={() => { setStep("form"); setErrMsg(""); }}
        style={{ fontFamily: "Inter,sans-serif", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
        ← Try Again
      </button>
    </div>
  );

  if (step === "processing") return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: C.white }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Loader size={48} color={C.goldSoft} style={{ marginBottom: 16, animation: "spin 1s linear infinite" }} />
      <p className="sans" style={{ fontSize: 15, color: "rgba(255,255,255,0.7)" }}>Processing your donation…</p>
    </div>
  );

  if (step === "stripe-card") return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h3 className="sans" style={{ fontSize: 19, fontWeight: 700, color: C.white, marginBottom: 4, textAlign: "center" }}>
        Complete your donation — ${Number(amount).toLocaleString()}
      </h3>
      <p className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 22 }}>
        Saksham · {frequency === "once" ? "One-time" : frequency}
      </p>
      <div id="stripe-payment-element-saksham" style={{ background: "#fff", borderRadius: 10, padding: 16, marginBottom: 18, minHeight: 180 }} />
      {!stripeReady && <div className="sans" style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Loading payment form…</div>}
      <button onClick={handleStripeConfirm} disabled={!stripeReady}
        style={{ width: "100%", fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 16, background: stripeReady ? C.gold : "rgba(255,255,255,0.2)", color: stripeReady ? "#1a1a1a" : "rgba(255,255,255,0.4)", border: "none", padding: 15, borderRadius: 10, cursor: stripeReady ? "pointer" : "not-allowed", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <HeartHandshake size={18} color={stripeReady ? "#1a1a1a" : "rgba(255,255,255,0.4)"} />
        {stripeReady ? `Confirm Donation — $${Number(amount).toLocaleString()} USD` : "Loading…"}
      </button>
      <button onClick={() => { setStep("form"); mountedRef.current = false; setStripeReady(false); }}
        style={{ width: "100%", marginTop: 10, fontFamily: "Inter,sans-serif", fontSize: 13, background: "transparent", color: "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", padding: 8 }}>
        ← Back
      </button>
      <div className="sans" style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
        <Lock size={11} /> Secured by Stripe · IRS 501(c)(3) tax-deductible
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Region toggle */}
      <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: 5, marginBottom: 20, border: "1px solid rgba(255,255,255,0.18)" }}>
        {[{ key: "domestic", label: "🇮🇳  For Domestic (India) Donor" }, { key: "us", label: "🇺🇸  For USA Donor" }].map(opt => (
          <button key={opt.key} type="button" onClick={() => { setRegion(opt.key); setAmount(""); setErrors({}); }}
            style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, padding: "11px 22px", borderRadius: 999, border: "none", cursor: "pointer", transition: "all 0.25s",
              background: region === opt.key ? (opt.key === "domestic" ? "#f59e0b" : "#1d4ed8") : "transparent",
              color: region === opt.key ? "#fff" : "rgba(255,255,255,0.7)" }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Tax note */}
      <div className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 22, lineHeight: 1.5 }}>
        {isDomestic
          ? <>Eligible for tax benefits under <strong style={{ color: C.goldLight }}>Section 80G & 12A</strong> (India).</>
          : <>Donations may be tax-deductible through a <strong style={{ color: C.goldLight }}>501(c)(3)</strong> organization in the US.</>}
      </div>

      {/* White card */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 28px 24px", boxShadow: "0 16px 40px rgba(0,0,0,0.15)" }}>
        {/* Row 1: Name + Email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="donate-form-row">
          <div>
            <label style={labelStyle}>Full Name <span style={{ color: "#dc2626" }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp(errors.name)}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.forest; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(27,107,58,0.15)"; }}
              onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = errors.name ? "#dc2626" : "#e5e7eb"; (e.target as HTMLInputElement).style.boxShadow = "none"; }} />
          </div>
          <div>
            <label style={labelStyle}>Email <span style={{ color: "#dc2626" }}>*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" style={inp(errors.email)}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.forest; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(27,107,58,0.15)"; }}
              onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = errors.email ? "#dc2626" : "#e5e7eb"; (e.target as HTMLInputElement).style.boxShadow = "none"; }} />
          </div>
        </div>

        {/* Row 2: Phone + Locked Program */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="donate-form-row">
          <div>
            <label style={labelStyle}>Phone <span style={{ color: "#dc2626" }}>*</span></label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number" style={inp(errors.phone)}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.forest; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(27,107,58,0.15)"; }}
              onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = errors.phone ? "#dc2626" : "#e5e7eb"; (e.target as HTMLInputElement).style.boxShadow = "none"; }} />
          </div>
          <div>
            <label style={labelStyle}>Donate to Program</label>
            {/* LOCKED — Saksham */}
            <div style={{ width: "100%", height: 47, padding: "0 14px", border: `2px solid ${C.forest}`, borderRadius: 10, background: "#f0fdf4", fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: C.forest, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "not-allowed" }}>
              <span>Saksham</span>
              <Lock size={14} color={C.forest} />
            </div>
          </div>
        </div>

        {/* Row 3: State / UT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="donate-form-row">
          <div ref={stateRef}>
            <label style={labelStyle}>State / UT <span className="sans" style={{ fontSize: 11, fontWeight: 400, color: C.textLight }}>(optional)</span></label>
            <div style={{ position: "relative" }}>
              <button type="button" onClick={() => setStateOpen(o => !o)}
                style={{ width: "100%", height: 47, padding: "0 14px", border: `2px solid ${stateOpen ? C.forest : "#e5e7eb"}`, borderRadius: 10, background: "#fff", fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: state ? 600 : 400, color: state ? C.text : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxShadow: stateOpen ? "0 0 0 3px rgba(27,107,58,0.15)" : "none" }}>
                <span>{state || "Select your state"}</span>
                <span style={{ color: C.forest, fontSize: 12, transition: "transform 0.2s", transform: stateOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
              </button>
              {stateOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 12px 28px rgba(0,0,0,0.12)", padding: 6, zIndex: 30, maxHeight: 240, overflowY: "auto" }}>
                  {INDIAN_STATES.map((s, idx) => {
                    const isSeparator = s.startsWith("—");
                    if (isSeparator) return (
                      <div key={idx} style={{ padding: "6px 12px", fontSize: 10, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Inter',sans-serif", borderTop: "1px solid #f3f4f6", marginTop: 4, pointerEvents: "none" }}>{s}</div>
                    );
                    return (
                      <div key={s} onClick={() => { setState(s); setStateOpen(false); }}
                        style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.text, background: state === s ? "#f0fdf4" : "transparent", fontWeight: state === s ? 600 : 400 }}
                        onMouseEnter={e => { if (state !== s) (e.currentTarget as HTMLDivElement).style.background = "#f0fdf4"; }}
                        onMouseLeave={e => { if (state !== s) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                        {s}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* spacer */}
          <div />
        </div>

        {/* Row 4: Amount + Frequency */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }} className="donate-form-row">
          <div>
            <label style={labelStyle}>Donation Amount <span style={{ color: "#dc2626" }}>*</span></label>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              {presets[region].map((v: number) => (
                <button key={v} type="button" onClick={() => { setAmount(String(v)); setErrors((er: any) => ({ ...er, amount: false })); }}
                  style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, padding: "8px 14px",
                    border: `2px solid ${String(amount) === String(v) ? C.forest : "#e5e7eb"}`,
                    borderRadius: 8, background: String(amount) === String(v) ? "#f0fdf4" : "#fff",
                    color: String(amount) === String(v) ? C.forest : C.text, cursor: "pointer" }}>
                  {isDomestic ? "₹" : "$"}{v.toLocaleString()}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "stretch", border: `2px solid ${errors.amount ? "#dc2626" : "#e5e7eb"}`, borderRadius: 10, overflow: "hidden" }}
              onFocusCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.forest; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(27,107,58,0.15)"; }}
              onBlurCapture={e  => { (e.currentTarget as HTMLDivElement).style.borderColor = errors.amount ? "#dc2626" : "#e5e7eb"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
              <div style={{ background: "#f9fafb", padding: "0 14px", display: "flex", alignItems: "center", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, color: C.forest, borderRight: "2px solid #e5e7eb" }}>
                {isDomestic ? "₹" : "$"}
              </div>
              <input type="number" min="1" value={amount} onChange={e => { setAmount(e.target.value); setErrors((er: any) => ({ ...er, amount: false })); }}
                placeholder={isDomestic ? "Amount in INR" : "Amount in USD"}
                style={{ flex: 1, border: "none", padding: "0 14px", height: 46, fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, color: C.text, outline: "none", background: "transparent" }} />
            </div>
          </div>

          <div ref={freqRef}>
            <label style={labelStyle}>Frequency</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setFrequency("once")}
                style={{ flex: 1, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, padding: "12px 10px",
                  border: `2px solid ${frequency === "once" ? C.forest : "#e5e7eb"}`, borderRadius: 10, cursor: "pointer",
                  background: frequency === "once" ? C.forest : "#fff", color: frequency === "once" ? "#fff" : C.text }}>
                One-time
              </button>
              <div style={{ flex: 1, position: "relative" }}>
                <button type="button" onClick={() => setFreqOpen(o => !o)}
                  style={{ width: "100%", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, padding: "12px 10px",
                    border: `2px solid ${frequency !== "once" ? C.forest : "#e5e7eb"}`, borderRadius: 10, cursor: "pointer",
                    background: frequency !== "once" ? C.forest : "#fff", color: frequency !== "once" ? "#fff" : C.text,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  {frequency !== "once" ? `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} ▾` : "Recurring ▾"}
                </button>
                {freqOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 10px 24px rgba(0,0,0,0.1)", zIndex: 30, overflow: "hidden" }}>
                    {freqOptions.map(f => (
                      <button key={f.value} type="button" onClick={() => { setFrequency(f.value); setFreqOpen(false); }}
                        style={{ width: "100%", padding: "11px 14px", border: "none", background: "transparent", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13, textAlign: "left", cursor: "pointer", color: C.text }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Agree */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24 }}>
          <input id="agree-chk-saksham" type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors((er: any) => ({ ...er, agreed: false })); }}
            style={{ marginTop: 2, width: 17, height: 17, accentColor: C.forest, flexShrink: 0, cursor: "pointer" }} />
          <label htmlFor="agree-chk-saksham" className="sans" style={{ fontSize: 13, lineHeight: 1.55, color: errors.agreed ? "#dc2626" : C.textMid, cursor: "pointer" }}>
            By donating, I agree to the{" "}
            <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" style={{ color: C.forest, textDecoration: "underline" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: C.forest, textDecoration: "underline" }}>Privacy Policy</a>.{" "}
            <span style={{ color: "#dc2626" }}>*</span>
          </label>
        </div>

        {errMsg && (
          <div className="sans" style={{ fontSize: 13, color: "#dc2626", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
            {errMsg}
          </div>
        )}

        {/* Submit */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
          <button type="submit"
            style={{ width: "60%", maxWidth: 380, padding: "14px 24px", border: "none", borderRadius: 12, cursor: "pointer",
              background: `linear-gradient(135deg, ${C.forest} 0%, ${C.leaf} 100%)`,
              color: "#fff", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 10px 25px rgba(27,107,58,0.3)", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 32px rgba(27,107,58,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 25px rgba(27,107,58,0.3)"; }}>
            <HeartHandshake size={18} color="#fff" />
            {isDomestic ? "Donate via Razorpay" : "Continue to Card Payment"}
          </button>
          <span className="sans" style={{ fontSize: 11, color: C.textLight, textAlign: "center" }}>
            🔒 Secure & tax-deductible as per applicable laws
          </span>
        </div>
      </div>
    </form>
  );
}

// ─── Impact card for right side ───────────────────────────────────────────────
function SakshamImpactCard() {
  return (
    <div style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,0.14)" }}>
      <div style={{ height: 110, borderRadius: 10, background: `linear-gradient(135deg, ${C.forestDeep}, ${C.leaf})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <div style={{ textAlign: "center" }}>
          <GraduationCap size={36} color="rgba(255,255,255,0.45)" />
          <div className="sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 6, letterSpacing: 1, textTransform: "uppercase" }}>Saksham — Youth Empowerment</div>
        </div>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 7 }}>Your donation trains a healthcare worker</h3>
      <p className="sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 14 }}>Every contribution directly funds training, certification and placement of youth from underserved communities into real medical jobs.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[{ n: "2,500+", l: "Youth Trained" }, { n: "1,050+", l: "Jobs Placed" }, { n: "95 Cr", l: "Indians to Serve" }, { n: "5 Lakh", l: "Jobs Target" }].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 9, padding: "11px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="sans" style={{ fontSize: 16, fontWeight: 800, color: C.goldLight }}>{s.n}</div>
            <div className="sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


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
    { icon: <Briefcase size={28} color={C.forest} />, title: "Employment", desc: "Over 1,050 graduates placed in real medical jobs at hospitals like Medanta. Building a pipeline of SwasthSaathis and SwasthRakshaks across rural India." },
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
      <section style={{ background: `linear-gradient(160deg, ${C.forestDeep} 0%, ${C.forest} 60%, ${C.leaf} 100%)`, padding: "96px 24px 72px", textAlign: "center" }}>
        <FadeIn>
          <div className="tag" style={{ color: C.goldSoft, marginBottom: 14 }}>Swasthgram Programme</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            Saksham<br /><span style={{ color: C.goldLight }}>Youth Empowerment & Skilling</span>
          </h1>
          <p className="sans" style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.75 }}>
            Transforming underserved youth into trained community health workers — delivering doorstep health screenings to 95 crore Indians..
          </p>
          <a href="#donate" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.gold, color: "#1a1a1a", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15, padding: "14px 32px", borderRadius: 10, textDecoration: "none" }}>
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
      <section id="donate" style={{ background: `linear-gradient(160deg, ${C.forestDeep} 0%, ${C.forest} 50%, ${C.leaf} 100%)`, padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="tag" style={{ color: C.goldSoft, marginBottom: 10 }}>Support Saksham</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 8 }}>
              One donation. One trained healthcare worker.<br />Thousands of lives served.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 28, alignItems: "flex-start" }} className="donate-grid">
            <div><DonationForm /></div>
            <div className="donate-impact-card" style={{ paddingTop: 112 }}>
              <SakshamImpactCard />
            </div>
          </div>
          <div className="sans" style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Lock size={12} color="rgba(255,255,255,0.3)" /> Secured by Razorpay & Stripe · Track impact on Swasthgram App
          </div>
        </div>
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