import Header from "../components/Header";
import Footer from "../components/Footer";
import CarouselBanner from "../components/CarouselBanner";
import HomeGallery from "../components/HomeGallery";
import { Users, Tent, Microscope, Briefcase, GraduationCap, Baby, Bike, Leaf, Heart, Building2, BarChart3, Sprout, Globe, Star, FlaskConical, HeartHandshake, ClipboardList, SmartphoneNfc, Mail, Phone, MapPin, Smartphone, Apple, Dna, Package, Lock, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import appStoreImg  from "../assets/app_store.png";
import playStoreImg from "../assets/play_store.png";
import swasthgramLogo from "../assets/SwasthgramLogo.png";
import partnerGoogle from "../assets/partners/google.jpg";
import partnerPwC from "../assets/partners/pwc.png";
import partnerICMR from "../assets/partners/icmr.png";
import partnerTata from "../assets/partners/tata_trust.png";
import partnerReliance from "../assets/partners/Reliance_Foundation.png";
import partnerLupin from "../assets/partners/Lupin_Foundation.png";
import partnerDLF from "../assets/partners/DLF_Foundation.png";
import partnerRoko from "../assets/partners/roko_cancer.png";
import partnerSeva from "../assets/partners/seva_bharti.png";
import partnerYWC from "../assets/partners/YouWeCan.png";
import partnerWish from "../assets/partners/Wish_Foundation.png";
import partnerDocOnline from "../assets/partners/DocOnline.png";
import partnerMediBuddy from "../assets/partners/MediBuddy.jpg";
import partnerPowerGrid from "../assets/partners/Powergrid.png";
import imgSwasthmanthan from "../assets/programs/Swasthmanthan.webp";
import imgSaksham from "../assets/programs/saksham.webp";
import imgShudhvayu from "../assets/programs/Shudhvayu.webp";

const COLORS = {
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

function AnimatedCounter({ end, suffix = "" }) {
  const [value, setValue] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const step = Math.ceil(end / 50);
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setValue(end); clearInterval(timer); }
      else setValue(current);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span ref={ref}>{value.toLocaleString("en-IN")}{suffix}</span>;
}

function FadeIn({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function PlaceholderImage({ label, icon = <Microscope size={28} color="rgba(255,255,255,0.7)" />, height = 200, gradient = "135deg, #1a4a2e, #2d7a4a" }) {
  return (
    <div style={{ width: "100%", height, background: `linear-gradient(${gradient})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", textAlign: "center", padding: 16 }}>
      <div style={{ marginBottom: 4 }}>{icon}</div>
      <div className="sans" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

const cc = COLORS;
const API_BASE = "/api";

let stripePromise = null;
async function getStripe() {
  if (!stripePromise) {
    const { stripeKey } = await fetch("/api/config").then(r => r.json());
    stripePromise = window.Stripe
      ? Promise.resolve(window.Stripe(stripeKey))
      : new Promise((resolve) => {
          const s = document.createElement("script");
          s.src = "https://js.stripe.com/v3/";
          s.onload = () => resolve(window.Stripe(stripeKey));
          document.head.appendChild(s);
        });
  }
  return stripePromise;
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

function DonationForm() {
  const [region, setRegion]           = useState("domestic");
  const [program, setProgram]         = useState("");
  const [programOpen, setProgramOpen] = useState(false);
  const [state, setState]             = useState("");
  const [stateOpen, setStateOpen]     = useState(false);
  const [amount, setAmount]           = useState("");
  const [frequency, setFrequency]     = useState("once");
  const [freqOpen, setFreqOpen]       = useState(false);
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [phone, setPhone]             = useState("");
  const [agreed, setAgreed]           = useState(false);
  const [errors, setErrors]           = useState({});
  const [step, setStep]               = useState("form");
  const [stripeReady, setStripeReady] = useState(false);
  const [confirming, setConfirming]   = useState(false);
  const [errMsg, setErrMsg]           = useState("");

  const stripeRef   = useRef(null);
  const elementsRef = useRef(null);
  const mountedRef  = useRef(false);
  const dropRef     = useRef(null);
  const freqRef     = useRef(null);
  const stateRef    = useRef(null);

  const isDomestic = region === "domestic";
  const presets    = { us: [200, 500, 1000], domestic: [10000, 50000, 100000] };
  const programs   = [
    { value: "SwasthManthan", label: "SwasthManthan", sub: "Rural Healthcare" },
    { value: "Shudhvayu",     label: "Shudhvayu",     sub: "Clean Air & Environment" },
    { value: "Saksham",       label: "Saksham",        sub: "Education & Skills" },
  ];
  const freqOptions = [
    { value: "monthly",   label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly",    label: "Yearly" },
  ];

  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setProgramOpen(false);
      if (freqRef.current && !freqRef.current.contains(e.target)) setFreqOpen(false);
      if (stateRef.current && !stateRef.current.contains(e.target)) setStateOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (step !== "stripe-card" || mountedRef.current) return;
    mountedRef.current = true;
    // Scroll donate section into view so Stripe element is visible
    setTimeout(() => {
      document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    (async () => {
      const stripe = await getStripe();
      stripeRef.current = stripe;
      const res = await fetch(`${API_BASE}/create-stripe-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), name, email, phone, state, program: program || "General", frequency }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) { setErrMsg(data.error || "Could not initialise payment."); setStep("error"); return; }
      const elements = stripe.elements({ clientSecret: data.clientSecret, appearance: { theme: "stripe" } });
      elementsRef.current = elements;
      const paymentElement = elements.create("payment");
      paymentElement.on("ready", () => setStripeReady(true));
      paymentElement.mount("#stripe-payment-element");
    })();
    return () => { mountedRef.current = false; };
  }, [step]);

  const handleStripeConfirm = async () => {
    if (!stripeRef.current || !elementsRef.current) return;
    setConfirming(true);
    try {
      // CRITICAL: do NOT setStep("processing") before confirmPayment —
      // that unmounts #stripe-payment-element which Stripe still needs mounted.
      const { error, paymentIntent } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: { return_url: `${window.location.origin}/thank-you` },
        redirect: "if_required",
      });
      if (error) {
        setErrMsg(error.message);
        setStep("error");
      } else if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
        // NOW safe to unmount — payment already confirmed
        setStep("processing");
        const confirmRes = await fetch(`${API_BASE}/confirm-stripe-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id, name, email, phone, state, amount, program: program || "General", frequency }),
        });
        const confirmData = await confirmRes.json();
        if (confirmData.token) {
          window.location.href = `/thank-you?token=${confirmData.token}`;
          return;
        }
        setStep("success"); // fallback if no token
      } else {
        setErrMsg("Payment could not be completed. Please try again.");
        setStep("error");
      }
    } catch (err) {
      setErrMsg(err.message || "Unexpected error. Please try again.");
      setStep("error");
    } finally {
      setConfirming(false);
    }
  };

  const handleRazorpay = async () => {
    setStep("processing");
    const loaded = await loadRazorpay();
    if (!loaded) { setErrMsg("Could not load Razorpay. Check your connection."); setStep("error"); return; }
    const res = await fetch(`${API_BASE}/create-razorpay-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), name, email, phone, state, program: program || "General", frequency }),
    });
    const data = await res.json();
    if (!res.ok || !data.orderId) { setErrMsg(data.error || "Could not create order."); setStep("error"); return; }
    new window.Razorpay({
      key: data.keyId, amount: data.amount, currency: data.currency,
      name: "Swasthgram", description: `${program || "General"} donation`,
      order_id: data.orderId,
      prefill: { name, email, contact: phone },
      theme: { color: cc.forest },
      handler: async (response) => {
        const verify = await fetch(`${API_BASE}/verify-razorpay-payment`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, name, email, phone, state, amount, program: program || "General", frequency }),
        });
        const vd = await verify.json();
        if (vd.success && vd.token) {
          window.location.href = `/thank-you?token=${vd.token}`;
        } else if (vd.success) {
          setStep("success"); // fallback if no token
        } else {
          setErrMsg(vd.error || "Payment verification failed."); setStep("error");
        }
      },
      modal: { ondismiss: () => setStep("form") },
    }).open();
  };

  function validate() {
    const e = {};
    if (!name.trim())  e.name  = true;
    if (!email.trim()) e.email = true;
    if (!phone.trim()) e.phone = true;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = true;
    if (!agreed) e.agreed = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setErrMsg("");
    if (isDomestic) {
      handleRazorpay();
    } else {
      mountedRef.current = false;
      setStep("stripe-card");
      setTimeout(() => {
        document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }

  const inp = (hasErr) => ({
    width: "100%", padding: "13px 14px",
    border: `2px solid ${hasErr ? "#dc2626" : "#e5e7eb"}`,
    borderRadius: 10, fontFamily: "'Inter', sans-serif", fontSize: 14,
    background: "#fff", color: cc.text, outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  });
  const labelStyle = { fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: cc.text, display: "block", marginBottom: 7 };

  if (step === "success") return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: cc.white }}>
      <CheckCircle size={64} color={cc.goldSoft} style={{ marginBottom: 20 }} />
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Thank you, {name}!</h2>
      <p className="sans" style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", maxWidth: 400, margin: "0 auto 24px", lineHeight: 1.6 }}>
        Your donation to <strong style={{ color: cc.goldLight }}>{program || "Swasthgram"}</strong> has been received. A receipt will be sent to {email}.
      </p>
      <button onClick={() => { setStep("form"); setAmount(""); setName(""); setEmail(""); setPhone(""); setState(""); setAgreed(false); }}
        style={{ fontFamily: "Inter, sans-serif", background: cc.gold, color: "#1a1a1a", fontWeight: 700, border: "none", padding: "12px 28px", borderRadius: 8, cursor: "pointer", fontSize: 15 }}>
        Make Another Donation
      </button>
    </div>
  );

  if (step === "error") return (
    <div style={{ textAlign: "center", padding: "40px 24px", color: cc.white }}>
      <AlertCircle size={48} color="#f87171" style={{ marginBottom: 16 }} />
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Something went wrong</h3>
      <p className="sans" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 380, margin: "0 auto 20px", fontSize: 14 }}>{errMsg}</p>
      <button onClick={() => { setStep("form"); setErrMsg(""); }}
        style={{ fontFamily: "Inter, sans-serif", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
        ← Try Again
      </button>
    </div>
  );

  if (step === "processing") return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: cc.white }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Loader size={48} color={cc.goldSoft} style={{ marginBottom: 16, animation: "spin 1s linear infinite" }} />
      <p className="sans" style={{ fontSize: 15, color: "rgba(255,255,255,0.7)" }}>Processing your donation…</p>
    </div>
  );

  if (step === "stripe-card") return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h3 className="sans" style={{ fontSize: 19, fontWeight: 700, color: cc.white, marginBottom: 4, textAlign: "center" }}>
        Complete your donation — ${Number(amount).toLocaleString()}
      </h3>
      <p className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 22 }}>
        {program || "General"} · {frequency === "once" ? "One-time" : frequency}
      </p>
      <div id="stripe-payment-element" style={{ background: "#fff", borderRadius: 10, padding: 16, marginBottom: 18, minHeight: 180 }} />
      {!stripeReady && (
        <div className="sans" style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Loading payment form…</div>
      )}
      <button
        onClick={handleStripeConfirm}
        disabled={!stripeReady || confirming}
        style={{
          width: "100%", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 16,
          background: (stripeReady && !confirming) ? cc.gold : "rgba(255,255,255,0.2)",
          color: (stripeReady && !confirming) ? "#1a1a1a" : "rgba(255,255,255,0.4)",
          border: "none", padding: 15, borderRadius: 10,
          cursor: (stripeReady && !confirming) ? "pointer" : "not-allowed",
          transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
        <HeartHandshake size={18} color={(stripeReady && !confirming) ? "#1a1a1a" : "rgba(255,255,255,0.4)"} />
        {confirming ? "Processing…" : stripeReady ? `Confirm Donation — $${Number(amount).toLocaleString()} USD` : "Loading payment form…"}
      </button>
      <button onClick={() => { setStep("form"); mountedRef.current = false; setStripeReady(false); setConfirming(false); }}
        style={{ width: "100%", marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: 13, background: "transparent", color: "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", padding: 8 }}>
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
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, padding: "11px 22px", borderRadius: 999, border: "none", cursor: "pointer", transition: "all 0.25s",
              background: region === opt.key ? (opt.key === "domestic" ? "#f59e0b" : "#1d4ed8") : "transparent",
              color: region === opt.key ? "#fff" : "rgba(255,255,255,0.7)" }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Tax note */}
      <div className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 22, lineHeight: 1.5 }}>
        {isDomestic
          ? <>Eligible for tax benefits under <strong style={{ color: cc.goldLight }}>Section 80G &amp; 12A</strong> (India).</>
          : <>Donations may be tax-deductible through a <strong style={{ color: cc.goldLight }}>501(c)(3)</strong> organization in the US.</>}
      </div>

      {/* White card */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 28px 24px", boxShadow: "0 16px 40px rgba(0,0,0,0.15)" }}>

        {/* Row 1: Name + Email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="donate-form-row">
          <div>
            <label style={labelStyle}>Full Name <span style={{ color: "#dc2626" }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp(errors.name)}
              onFocus={e => { e.target.style.borderColor = cc.forest; e.target.style.boxShadow = "0 0 0 3px rgba(27,107,58,0.15)"; }}
              onBlur={e  => { e.target.style.borderColor = errors.name ? "#dc2626" : "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
          </div>
          <div>
            <label style={labelStyle}>Email <span style={{ color: "#dc2626" }}>*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" style={inp(errors.email)}
              onFocus={e => { e.target.style.borderColor = cc.forest; e.target.style.boxShadow = "0 0 0 3px rgba(27,107,58,0.15)"; }}
              onBlur={e  => { e.target.style.borderColor = errors.email ? "#dc2626" : "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
          </div>
        </div>

        {/* Row 2: Phone + Program */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="donate-form-row">
          <div>
            <label style={labelStyle}>Phone <span style={{ color: "#dc2626" }}>*</span></label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number" style={inp(errors.phone)}
              onFocus={e => { e.target.style.borderColor = cc.forest; e.target.style.boxShadow = "0 0 0 3px rgba(27,107,58,0.15)"; }}
              onBlur={e  => { e.target.style.borderColor = errors.phone ? "#dc2626" : "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
          </div>
          <div ref={dropRef}>
            <label style={labelStyle}>Donate to Program</label>
            <div style={{ position: "relative" }}>
              <button type="button" onClick={() => setProgramOpen(o => !o)}
                style={{ width: "100%", height: 47, padding: "0 14px", border: `2px solid ${programOpen ? cc.forest : "#e5e7eb"}`, borderRadius: 10, background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: program ? 600 : 400, color: program ? cc.text : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxShadow: programOpen ? "0 0 0 3px rgba(27,107,58,0.15)" : "none" }}>
                <span>{program || "Select a program"}</span>
                <span style={{ color: cc.forest, fontSize: 12, transition: "transform 0.2s", transform: programOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
              </button>
              {programOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 12px 28px rgba(0,0,0,0.12)", padding: 6, zIndex: 30 }}>
                  {programs.map(p => (
                    <div key={p.value} onClick={() => { setProgram(p.value); setProgramOpen(false); }}
                      style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div className="sans" style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
                      <div className="sans" style={{ fontSize: 11, color: cc.textLight }}>{p.sub}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: State / UT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="donate-form-row">
          <div ref={stateRef}>
            <label style={labelStyle}>State / UT <span className="sans" style={{ fontSize: 11, fontWeight: 400, color: cc.textLight }}>(optional)</span></label>
            <div style={{ position: "relative" }}>
              <button type="button" onClick={() => setStateOpen(o => !o)}
                style={{ width: "100%", height: 47, padding: "0 14px", border: `2px solid ${stateOpen ? cc.forest : "#e5e7eb"}`, borderRadius: 10, background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: state ? 600 : 400, color: state ? cc.text : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxShadow: stateOpen ? "0 0 0 3px rgba(27,107,58,0.15)" : "none" }}>
                <span>{state || "Select your state"}</span>
                <span style={{ color: cc.forest, fontSize: 12, transition: "transform 0.2s", transform: stateOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
              </button>
              {stateOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 12px 28px rgba(0,0,0,0.12)", padding: 6, zIndex: 30, maxHeight: 240, overflowY: "auto" }}>
                  {INDIAN_STATES.map((s, idx) => {
                    const isSeparator = s.startsWith("—");
                    if (isSeparator) return (
                      <div key={idx} style={{ padding: "6px 12px", fontSize: 10, fontWeight: 700, color: cc.textLight, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Inter', sans-serif", borderTop: "1px solid #f3f4f6", marginTop: 4, pointerEvents: "none" }}>{s}</div>
                    );
                    return (
                      <div key={s} onClick={() => { setState(s); setStateOpen(false); }}
                        style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, color: cc.text, background: state === s ? "#f0fdf4" : "transparent", fontWeight: state === s ? 600 : 400 }}
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
          {/* Empty right col — spacer */}
          <div />
        </div>

        {/* Row 4: Amount + Frequency */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }} className="donate-form-row">
          <div>
            <label style={labelStyle}>Donation Amount <span style={{ color: "#dc2626" }}>*</span></label>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              {presets[region].map(v => (
                <button key={v} type="button" onClick={() => { setAmount(String(v)); setErrors(er => ({ ...er, amount: false })); }}
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, padding: "8px 14px",
                    border: `2px solid ${String(amount) === String(v) ? cc.forest : "#e5e7eb"}`,
                    borderRadius: 8, background: String(amount) === String(v) ? "#f0fdf4" : "#fff",
                    color: String(amount) === String(v) ? cc.forest : cc.text, cursor: "pointer" }}>
                  {isDomestic ? "₹" : "$"}{v.toLocaleString()}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "stretch", border: `2px solid ${errors.amount ? "#dc2626" : "#e5e7eb"}`, borderRadius: 10, overflow: "hidden" }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = cc.forest; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,107,58,0.15)"; }}
              onBlurCapture={e  => { e.currentTarget.style.borderColor = errors.amount ? "#dc2626" : "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ background: "#f9fafb", padding: "0 14px", display: "flex", alignItems: "center", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: cc.forest, borderRight: "2px solid #e5e7eb" }}>
                {isDomestic ? "₹" : "$"}
              </div>
              <input type="number" min="1" value={amount} onChange={e => { setAmount(e.target.value); setErrors(er => ({ ...er, amount: false })); }}
                placeholder={isDomestic ? "Amount in INR" : "Amount in USD"}
                style={{ flex: 1, border: "none", padding: "0 14px", height: 46, fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: cc.text, outline: "none", background: "transparent" }} />
            </div>
          </div>

          <div ref={freqRef}>
            <label style={labelStyle}>Frequency</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setFrequency("once")}
                style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, padding: "12px 10px",
                  border: `2px solid ${frequency === "once" ? cc.forest : "#e5e7eb"}`, borderRadius: 10, cursor: "pointer",
                  background: frequency === "once" ? cc.forest : "#fff",
                  color: frequency === "once" ? "#fff" : cc.text }}>
                One-time
              </button>
              <div style={{ flex: 1, position: "relative" }}>
                <button type="button" onClick={() => setFreqOpen(o => !o)}
                  style={{ width: "100%", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, padding: "12px 10px",
                    border: `2px solid ${frequency !== "once" ? cc.forest : "#e5e7eb"}`, borderRadius: 10, cursor: "pointer",
                    background: frequency !== "once" ? cc.forest : "#fff",
                    color: frequency !== "once" ? "#fff" : cc.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  {frequency !== "once" ? `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} ▾` : "Recurring ▾"}
                </button>
                {freqOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 10px 24px rgba(0,0,0,0.1)", zIndex: 30, overflow: "hidden" }}>
                    {freqOptions.map(f => (
                      <button key={f.value} type="button" onClick={() => { setFrequency(f.value); setFreqOpen(false); }}
                        style={{ width: "100%", padding: "11px 14px", border: "none", background: "transparent", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, textAlign: "left", cursor: "pointer", color: cc.text }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
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
          <input id="agree-chk" type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(er => ({ ...er, agreed: false })); }}
            style={{ marginTop: 2, width: 17, height: 17, accentColor: cc.forest, flexShrink: 0, cursor: "pointer" }} />
          <label htmlFor="agree-chk" className="sans" style={{ fontSize: 13, lineHeight: 1.55, color: errors.agreed ? "#dc2626" : cc.textMid, cursor: "pointer" }}>
            By donating, I agree to the{" "}
            <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" style={{ color: cc.forest, textDecoration: "underline" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: cc.forest, textDecoration: "underline" }}>Privacy Policy</a>.{" "}
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
              background: `linear-gradient(135deg, ${cc.forest} 0%, ${cc.leaf} 100%)`,
              color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 10px 25px rgba(27,107,58,0.3)", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(27,107,58,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(27,107,58,0.3)"; }}>
            <HeartHandshake size={18} color="#fff" />
            {isDomestic ? "Donate via Razorpay" : "Continue to Card Payment"}
          </button>
          <span className="sans" style={{ fontSize: 11, color: cc.textLight, textAlign: "center" }}>
            🔒 Secure &amp; tax-deductible as per applicable laws
          </span>
        </div>
      </div>
    </form>
  );
}


export default function SwasthgramHome() {
  const [openFaq, setOpenFaq] = useState(null);
  const partners = [
    { name: "Google for Nonprofits", img: partnerGoogle },
    { name: "PwC",                   img: partnerPwC },
    { name: "ICMR",                  img: partnerICMR },
    { name: "Tata Trusts",           img: partnerTata },
    { name: "Reliance Foundation",   img: partnerReliance },
    { name: "Lupin Foundation",      img: partnerLupin },
    { name: "DLF Foundation",        img: partnerDLF },
    { name: "Roko Cancer",           img: partnerRoko },
    { name: "Seva Bharti",           img: partnerSeva },
    { name: "YouWeCan",              img: partnerYWC },
    { name: "Wish Foundation",       img: partnerWish },
    { name: "DocOnline",             img: partnerDocOnline },
    { name: "MediBuddy",             img: partnerMediBuddy },
    { name: "PowerGrid",             img: partnerPowerGrid },
  ];
  const impactStats = [
    { end: 57, suffix: "Lakh+", label: "Beneficiaries Served",    icon: <Users size={24} color="#D4A854" /> },
    { end: 67660,   suffix: "+", label: "Health Camps",            icon: <Tent size={24} color="#D4A854" /> },
    { end: 6000,  suffix: "+", label: "Cancer Tests",            icon: <Microscope size={24} color="#D4A854" /> },
    { end: 5000,   suffix: "+", label: "Health Unit in a Box Deployed",   icon: <Package size={24} color="#D4A854" /> },
    { end: 5050,   suffix: "+", label: "Youth Trained",           icon: <GraduationCap size={24} color="#D4A854" /> },
    { end: 9000,   suffix: "+", label: "Pregnant Women Screened", icon: <Baby size={24} color="#D4A854" /> },
  ];
  const programs = [
    { name: "SwasthManthan", tagline: "Early Detection. Saved Lives.",      img: imgSwasthmanthan, color: cc.forest,   desc: "Cancer screening, diabetes, liver & kidney screening — deployed through Health Unit on Bike to remote communities.", stats: [{ n: "57 Lakh+", l: "Reached" }, { n: "6,000", l: "Cancer Tests" }, { n: "67,660", l: "Camps" }] },
    { name: "Saksham",       tagline: "Scientific Skilling. Real Careers.", img: imgSaksham,       color: cc.leaf,     desc: "8 years of deep research compressed 4-year medical programmes into 4 intensive months. Graduates at Medanta.", stats: [{ n: "8 Years", l: "R&D" }, { n: "4 Months", l: "vs 4 Yr" }, { n: "5,050+", l: "Placed" }] },
    { name: "Shudhvayu",     tagline: "Clean Air. Right to Life.",          img: imgShudhvayu,     color: cc.goldSoft, desc: "Patented vehicle-mounted air filter. Cleans air as cars drive. No electricity. The most democratic solution.", stats: [{ n: "Since 2018", l: "On Roads" }, { n: "Patented", l: "Innovation" }, { n: "Delhi NCR", l: "& Beyond" }] },
  ];
  const steps = [
    { step: "01", title: "You Donate",             desc: "Via app or website. Pick your cause.",                                        icon: <Heart size={22} color="#fff" />,      highlight: "Your generosity starts the chain." },
    { step: "02", title: "We Deploy in Your Name", desc: "Your donation activates a Health Unit on Bike. We publicize your name — you're the hero.", icon: <Bike size={22} color="#fff" />,  highlight: "We are the engine. You are the hero." },
    { step: "03", title: "We Screen & Assess",   desc: "Free cancer screening, blood work, oral exams — first-ever access for thousands.",  icon: <Microscope size={22} color="#fff" />, highlight: "First-ever community care access." },
    { step: "04", title: "We Refer & Treat",       desc: "Critical community members → partner hospitals for subsidized treatment.",             icon: <Building2 size={22} color="#fff" />,   highlight: "No one left behind." },
    { step: "05", title: "We Report Back to You",  desc: "Full data on the Swasthgram App — where your money went, who it helped.",   icon: <BarChart3 size={22} color="#fff" />,   highlight: "Every rupee accounted for." },
  ];
  const faqs = [
    { q: "What makes Swasthgram unique?",  a: "The world's only health unit on a motorbike — solar-powered, no AC, jungle/mountain terrain. PwC validated. Indian Army uses 5,000+ units daily." },
    { q: "Where does my donation go?",     a: "100% to impact: health camps, Health Unit on Bike, youth training, air purification. Track on the Swasthgram App." },
    { q: "Is it tax-deductible?",          a: "Yes. India: 80G & 12A. USA: 501(c)(3). Receipt sent after donation." },
    { q: "How does Saksham work?",         a: "8 years R&D compressed 4-year medical programs into 4 months. Graduates work at Medanta." },
    { q: "How can I volunteer?",           a: "Email support@swasthgram.org." },
  ];
  const aboutCards = [
    { icon: <Bike size={24} color="#1B6B3A" />,          title: "Health Unit on Bike",         desc: "Solar-powered. 100+ Health screenings. The world's only." },
    { icon: <Package size={24} color="#1B6B3A" />,       title: "Health Unit in a Box",        desc: "5,000+ deployed. Indian Army uses daily." },
    { icon: <GraduationCap size={24} color="#1B6B3A" />, title: "Scientific Skilling", desc: "8 yrs R&D. 4-yr to 4 months. Medanta." },
    { icon: <Sprout size={24} color="#1B6B3A" />,        title: "Carbon Net Zero",     desc: "No electricity. No AC. Zero footprint." },
  ];

  return (
    <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", background: cc.warmBg, color: cc.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        .sans { font-family: 'Inter', -apple-system, sans-serif; }
        .tag { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; display: inline-block; }
        .btn-primary { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; background: #1B6B3A; color: #fff; border: none; padding: 13px 28px; border-radius: 8px; cursor: pointer; transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: #145A2F; transform: translateY(-1px); }
        .btn-outline { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px; background: transparent; color: #1B6B3A; border: 2px solid #1B6B3A; padding: 11px 24px; border-radius: 8px; cursor: pointer; transition: all 0.25s; }
        .btn-outline:hover { background: #1B6B3A; color: #fff; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .b-anim { animation: slideIn 0.45s ease forwards; }
        @media (max-width: 900px) {
          .b-flex { flex-direction: column !important; text-align: center !important; }
          .b-img { width: 100% !important; max-width: 260px !important; flex: none !important; margin: 0 auto !important; }
          .b-section { padding: 32px 20px 24px !important; }
          .b-arrows { display: none !important; }
          .hero-flex { flex-direction: column !important; text-align: center !important; }
          .hero-flex > div:first-child { align-items: center !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-impact { grid-template-columns: repeat(2, 1fr) !important; }
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          .hero-cta { justify-content: center !important; }
          .footer-grid { grid-template-columns: 1fr !important; text-align: center !important; }
          .leadership-grid { grid-template-columns: 1fr !important; }
          .partner-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .donate-tiles { flex-direction: column !important; }
          .trust-row { flex-direction: column !important; }
          .photo-row { grid-template-columns: repeat(2, 1fr) !important; }
          .donate-grid { grid-template-columns: 1fr !important; }
          .donate-form-row { grid-template-columns: 1fr !important; }
          .donate-impact-card { display: none !important; }
          .donate-section { padding: 40px 16px !important; }
          .donate-section h2 { font-size: 22px !important; }
        }
        @media (max-width: 480px) {
          .donate-form-row { grid-template-columns: 1fr !important; }
          .freq-row { flex-direction: column !important; }
        }
        @media (min-width: 901px) {
          .mobile-only { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <Header />
      <CarouselBanner />

      {/* HERO */}
      <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", background: "#ffffff", paddingTop: 30, paddingBottom: 30, position: "relative", overflow: "hidden" }}>
        
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", width: "100%", position: "relative", zIndex: 2 }}>
          <div className="hero-flex" style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <div style={{ flex: "1 1 55%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
              <div className="sans" style={{ fontSize: 14, fontWeight: 600, color: cc.forest, borderLeft: `3px solid ${cc.forest}`, paddingLeft: 14, lineHeight: 1.5 }}>
                We are not a charity.<br />We empower people for sustainable development.
              </div>
              <div className="tag" style={{ color: cc.forest, background: "rgba(27,107,58,0.08)", padding: "5px 12px", borderRadius: 16, fontSize: 10, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Bike size={12} color={cc.forest} /> The World's Only Health Unit on Bike · Since 2018
              </div>
              <h1 style={{ fontSize: "clamp(26px, 4.2vw, 44px)", fontWeight: 700, lineHeight: 1.15, color: cc.text }}>
                She walked 47 km<br />to know if she'd survive.<br />
                <span style={{ color: cc.forest }}>We ride to her village.</span>
              </h1>
              <p className="sans" style={{ fontSize: 15, lineHeight: 1.7, color: cc.textMid, maxWidth: 440 }}>
                The world's only health unit on a motorbike — solar-powered, 100+ health screenings, built for jungles and mountains. Used by the Indian Army. Validated by PwC.
              </p>
              <div className="hero-cta" style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                <a href="#donate" className="btn-primary" style={{ background: cc.gold, color: "#1a1a1a", padding: "13px 30px", display: "inline-flex", alignItems: "center", gap: 8 }}><Heart size={15} color="#1a1a1a" /> Donate Now</a>
                <a href="#about" className="btn-outline" style={{ color: cc.forest, borderColor: cc.forest, padding: "11px 22px" }}>Our Story →</a>
              </div>
              <div className="trust-row" style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
                {["5,000+ Labs Deployed", "Indian Army Daily Use", "PwC Validated", "100+ Health Screenings"].map((text, i) => (
                  <div key={i} className="sans" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: cc.textLight }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: cc.forest }} />{text}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 45%", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "min(420px, 85vw)", borderRadius: 16, overflow: "hidden", position: "relative", border: "2px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                <img src="https://img.youtube.com/vi/_O8eYkzwEB4/maxresdefault.jpg" alt="Watch Swasthgram Story" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
                <div onClick={() => window.open("https://www.youtube.com/watch?v=_O8eYkzwEB4", "_blank")} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "rgba(0,0,0,0.35)" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(0,0,0,0.3)", animation: "pulse 2s ease-in-out infinite" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                    <div style={{ width: 0, height: 0, borderTop: "13px solid transparent", borderBottom: "13px solid transparent", borderLeft: `20px solid ${cc.forest}`, marginLeft: 4 }} />
                  </div>
                  <div className="sans" style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginTop: 12, letterSpacing: 1 }}>WATCH OUR STORY</div>
                </div>
                <div className="sans" style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.8)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <Bike size={20} color="#fff" />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Health Unit on Bike</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Solar · No AC · Jungle-ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section style={{ background: cc.white, borderBottom: `1px solid ${cc.border}`, padding: "36px 0", overflow: "hidden" }}>
        <p className="sans" style={{ fontSize: 10, color: cc.textLight, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24, textAlign: "center" }}>Trusted &amp; Validated By</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[partners.slice(0, 7), partners.slice(7)].map((row, ri) => (
            <div key={ri} style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: "linear-gradient(to right, #fff, transparent)", zIndex: 2, pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: "linear-gradient(to left, #fff, transparent)", zIndex: 2, pointerEvents: "none" }} />
              <div style={{ display: "flex", gap: 14, animation: `marquee 30s linear infinite ${ri === 1 ? "reverse" : ""}`, width: "max-content" }}>
                {[...row, ...row].map((p, i) => (
                  <div key={i} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 180, height: 76, borderRadius: 12, background: cc.white, border: `1px solid ${cc.border}`, padding: "10px 24px", transition: "all 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = cc.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = cc.border; }}>
                    <img src={p.img} alt={p.name} style={{ maxHeight: 44, maxWidth: 130, objectFit: "contain", filter: "grayscale(20%)", opacity: 0.8 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO STRIP */}
      <div className="photo-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
        <PlaceholderImage label="Health Camp"  icon={<HeartHandshake size={28} color="rgba(255,255,255,0.7)" />} height={180} gradient="135deg, #1a4a2e, #2d6b42" />
        <PlaceholderImage label="Health Unit on Bike"  icon={<Bike size={28} color="rgba(255,255,255,0.7)" />}          height={180} gradient="135deg, #1e3a28, #3d7a55" />
        <PlaceholderImage label="Field Ops"    icon={<ClipboardList size={28} color="rgba(255,255,255,0.7)" />} height={180} gradient="135deg, #2a4a30, #4d8a62" />
        <PlaceholderImage label="Screening"    icon={<Users size={28} color="rgba(255,255,255,0.7)" />}         height={180} gradient="135deg, #15382a, #2a6b48" />
      </div>

      {/* ABOUT */}
      <FadeIn>
        <section id="about" style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div className="tag" style={{ color: cc.gold, marginBottom: 10 }}>Who We Are</div>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, lineHeight: 1.25, marginBottom: 16 }}>Nation building through empowerment. Not welfare.</h2>
              <p className="sans" style={{ fontSize: 15, lineHeight: 1.75, color: cc.textMid, marginBottom: 14 }}>
                Founded in 2011 by a biomedical engineer who left Hollywood to solve India's deepest healthcare crisis. Swasthgram builds <strong style={{ color: cc.text }}>technology that goes where hospitals can't</strong> — solar-powered, jungle-ready, validated by PwC after screening 150 global solutions.
              </p>
              <p className="sans" style={{ fontSize: 15, lineHeight: 1.75, color: cc.textMid }}>
                Three verticals — <strong style={{ color: cc.text }}>Public Health</strong>, <strong style={{ color: cc.text }}>Youth Empowerment</strong>, <strong style={{ color: cc.text }}>Environment</strong>. Presented to 18 countries in Washington D.C.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {aboutCards.map((card, i) => (
                <div key={i} style={{ background: cc.white, borderRadius: 12, padding: "18px 16px", border: `1px solid ${cc.border}` }}>
                  <div style={{ marginBottom: 8 }}>{card.icon}</div>
                  <h4 className="sans" style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{card.title}</h4>
                  <p className="sans" style={{ fontSize: 12, lineHeight: 1.5, color: cc.textMid }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* IMPACT */}
      <section id="impact" style={{ background: cc.forest, padding: "56px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="tag" style={{ color: cc.goldSoft, marginBottom: 6 }}>Our Footprint</div>
            <h2 style={{ fontSize: "clamp(22px, 2.8vw, 30px)", fontWeight: 700, color: "#fff" }}>Building a Healthier Bharat</h2>
          </div>
          <div className="grid-impact" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {impactStats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center", padding: "20px 12px", background: "rgba(255,255,255,0.06)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ marginBottom: 6 }}>{stat.icon}</div>
                <div className="sans" style={{ fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 700, color: cc.goldSoft, lineHeight: 1 }}>
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <FadeIn>
        <section id="programs" style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="tag" style={{ color: cc.gold, marginBottom: 6 }}>Our Programs</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700 }}>Three missions. One purpose.</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {programs.map((prog, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: cc.white, borderRadius: 14, overflow: "hidden", border: `1px solid ${cc.border}`, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                    <img src={prog.img} alt={prog.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
                  </div>
                  <div style={{ padding: "24px 24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="tag" style={{ color: prog.color, marginBottom: 6 }}>{prog.name}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{prog.tagline}</h3>
                    <p className="sans" style={{ fontSize: 13, lineHeight: 1.65, color: cc.textMid, marginBottom: 20, flex: 1 }}>{prog.desc}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {prog.stats.map((s, j) => (
                        <div key={j} style={{ background: cc.cream, borderRadius: 8, padding: "6px 10px", flex: "1 1 auto", textAlign: "center", minWidth: 70 }}>
                          <div className="sans" style={{ fontSize: 13, fontWeight: 700 }}>{s.n}</div>
                          <div className="sans" style={{ fontSize: 9, color: cc.textLight }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      <HomeGallery />

      {/* HOW IT WORKS */}
      <FadeIn>
        <section style={{ background: cc.cream, padding: "72px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="tag" style={{ color: cc.forest, marginBottom: 6 }}>How It Works</div>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700 }}>From your donation to a saved life</h2>
            </div>
            {steps.map((item, i) => (
              <div key={i}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", background: cc.white, borderRadius: 14, padding: "22px 20px", border: `1px solid ${cc.border}` }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${cc.forest}, ${cc.leaf})`, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="sans" style={{ fontSize: 10, fontWeight: 700, color: cc.forest, marginBottom: 2, letterSpacing: 1 }}>STEP {item.step}</div>
                    <h4 className="sans" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
                    <p className="sans" style={{ fontSize: 13, lineHeight: 1.55, color: cc.textMid, marginBottom: 4 }}>{item.desc}</p>
                    <p className="sans" style={{ fontSize: 12, fontWeight: 600, color: cc.forest, fontStyle: "italic" }}>{item.highlight}</p>
                  </div>
                </div>
                {i < 4 && <div style={{ textAlign: "center", padding: "4px 0", fontSize: 18, color: cc.forest, fontWeight: 700 }}>↓</div>}
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* APP */}
      <FadeIn>
        <section id="app" style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div className="tag" style={{ color: cc.gold, marginBottom: 10 }}>Swasthgram App</div>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, lineHeight: 1.25, marginBottom: 16 }}>Every rupee tracked.<br />Every life counted.</h2>
              <p className="sans" style={{ fontSize: 15, lineHeight: 1.75, color: cc.textMid, marginBottom: 20 }}>Complete transparency. See where your donation goes, live camp data, and real-time reports.</p>
              {[
                { icon: <MapPin size={15} color={cc.forest} />,        text: "Live map of camps & cities" },
                { icon: <BarChart3 size={15} color={cc.forest} />,     text: "Track your money" },
                { icon: <ClipboardList size={15} color={cc.forest} />, text: "Real-time health reports" },
                { icon: <Heart size={15} color={cc.forest} />,         text: "Donate from the app" },
                { icon: <SmartphoneNfc size={15} color={cc.forest} />, text: "Notifications when camp goes live" },
              ].map((feat, i) => (
                <div key={i} className="sans" style={{ fontSize: 14, color: cc.textMid, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>{feat.icon}{feat.text}</div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(145deg, #1E293B 0%, #0F172A 60%, #1a1f35 100%)", borderRadius: 20, overflow: "hidden", position: "relative", minHeight: 340 }}>
              {/* Accent glow — indigo/violet top-right */}
              <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
              {/* Accent glow — gold bottom-left */}
              <div style={{ position: "absolute", bottom: -50, left: -50, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,150,62,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ padding: "36px 32px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>

                {/* Top: icon + label */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "#fff", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    <img src={swasthgramLogo} alt="Swasthgram" style={{ width: 38, height: 38, objectFit: "contain" }} />
                  </div>
                  <div>
                    <div className="sans" style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Swasthgram App</div>
                    <div className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 3, letterSpacing: 0.3 }}>Available on iOS & Android</div>
                  </div>
                </div>

                {/* Rating row */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill="#F59E0B" />)}
                  <span className="sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginLeft: 4 }}>Free · Healthcare</span>
                </div>

                {/* Description */}
                <p className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.50)", lineHeight: 1.7, marginBottom: 22 }}>
                  Your window into India's grassroots healthcare revolution. Track donations, follow live camps, and see every rupee at work.
                </p>

                {/* Feature chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 28 }}>
                  {["Live camp map", "Donation tracker", "Reports", "Notifications"].map((f, i) => (
                    <span key={i} className="sans" style={{ fontSize: 10, fontWeight: 600, padding: "4px 11px", borderRadius: 20, background: "rgba(99,102,241,0.12)", color: "rgba(165,167,255,0.7)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      {f}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 22 }} />

                {/* Store badges — side by side */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href="https://apps.apple.com/in/app/swasthgram/id6746193769"
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", transition: "opacity 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <img src={appStoreImg} alt="Download on the App Store" style={{ height: 42, display: "block", objectFit: "contain" }} />
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.app.swasthgram"
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", transition: "opacity 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <img src={playStoreImg} alt="Get it on Google Play" style={{ height: 42, display: "block", objectFit: "contain" }} />
                  </a>
                </div>

              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* LEADERSHIP */}
      <FadeIn>
        <section style={{ background: cc.cream, padding: "72px 24px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="tag" style={{ color: cc.gold, marginBottom: 6 }}>Leadership</div>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700 }}>The people behind the mission</h2>
            </div>
            <div className="leadership-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { name: "Amit Bhatnagar",  role: "Chief Care Architect & Founder",      quote: "At Swasthgram, we are transforming the landscape of healthcare, creating a future where access to high-quality, affordable care is a right, not a privilege." },
                { name: "Deepti Bhatnagar",role: "Chief Compassion Officer & Director",  quote: "We are dedicated to making healthcare not just a service, but a promise — one that ensures affordability, inclusivity, and scalability for all." },
              ].map((leader, i) => (
                <div key={i} style={{ background: cc.white, borderRadius: 14, padding: 30, border: `1px solid ${cc.border}` }}>
                  <div style={{ fontSize: 28, color: cc.forest, lineHeight: 1, marginBottom: 12 }}>"</div>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: cc.textMid, fontStyle: "italic", marginBottom: 20 }}>{leader.quote}</p>
                  <div style={{ borderTop: `1px solid ${cc.border}`, paddingTop: 14 }}>
                    <div className="sans" style={{ fontSize: 14, fontWeight: 700 }}>{leader.name}</div>
                    <div className="sans" style={{ fontSize: 12, color: cc.forest, fontWeight: 500 }}>{leader.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* DONATE */}
      <section id="donate" className="donate-section" style={{ background: `linear-gradient(160deg, ${cc.forestDeep} 0%, ${cc.forest} 50%, ${cc.leaf} 100%)`, padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="tag" style={{ color: cc.goldSoft, marginBottom: 10 }}>Support the Mission</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 8 }}>
              One donation. One health camp.<br />Hundreds of lives changed.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 28, alignItems: "flex-start" }} className="donate-grid">
            <div><DonationForm /></div>
            <div className="donate-impact-card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ height: 112 }} />
              <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,0.14)" }}>
                <div style={{ width: "100%", height: 120, borderRadius: 12, overflow: "hidden", marginBottom: 14, background: `linear-gradient(135deg, ${cc.forestDeep}, ${cc.leaf})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <HeartHandshake size={40} color="rgba(255,255,255,0.5)" />
                    <div className="sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8, letterSpacing: 1, textTransform: "uppercase" }}>Your Donation Matters</div>
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>Why your donation matters</h3>
                <p className="sans" style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>Your support funds screenings, mobile health vans and training that directly help underserved communities.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[{ n: "6L+", l: "Beneficiaries" }, { n: "9,360+", l: "Health Camps" }, { n: "21,750+", l: "Cancer Tests" }, { n: "5,000+", l: "Labs Deployed" }].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <div className="sans" style={{ fontSize: 17, fontWeight: 800, color: cc.goldLight }}>{s.n}</div>
                      <div className="sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="sans" style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <FlaskConical size={12} color="rgba(255,255,255,0.3)" /> Secured by Razorpay &amp; Stripe · Track impact on Swasthgram App
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FadeIn>
        <section style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="tag" style={{ color: cc.gold, marginBottom: 6 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700 }}>Common questions</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${cc.border}`, padding: "16px 0", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="sans" style={{ fontSize: 15, fontWeight: 600 }}>{faq.q}</h3>
                <span className="sans" style={{ fontSize: 18, color: cc.forest, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 14 }}>+</span>
              </div>
              {openFaq === i && <p className="sans" style={{ fontSize: 13, lineHeight: 1.65, color: cc.textMid, paddingTop: 10 }}>{faq.a}</p>}
            </div>
          ))}
        </section>
      </FadeIn>

      {/* CONTACT */}
      <FadeIn>
        <section id="contact" style={{ background: cc.cream, padding: "56px 24px" }}>
          <div className="grid-2" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div>
              <div className="tag" style={{ color: cc.forest, marginBottom: 6 }}>Get In Touch</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Ready to make a difference?</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: <Mail size={16} color={cc.forest} />,  text: "support@swasthgram.org" },
                { icon: <Phone size={16} color={cc.forest} />, text: "+91 85278-95900 (India)" },
                { icon: <Phone size={16} color={cc.forest} />, text: "+1-202-471-8287 (US)" },
                { icon: <MapPin size={16} color={cc.forest} />,text: "G/F, 424-CMR Building, Ghitorni, New Delhi-110030, India" },
                { icon: <MapPin size={16} color={cc.forest} />,text: "78 Union Avenue, Edison, NJ-08821, USA" },

              ].map((item, i) => (
                <div key={i} className="sans" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: cc.textMid }}>{item.icon}{item.text}</div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <Footer />
    </div>
  );
}