import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import { HeartHandshake, CheckCircle, AlertCircle, Loader, Lock, Wallet } from "lucide-react";

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

const REST_OF_WORLD = [
  ["Afghanistan", "AF"], ["Albania", "AL"], ["Algeria", "DZ"], ["Argentina", "AR"], ["Armenia", "AM"],
  ["Australia", "AU"], ["Austria", "AT"], ["Azerbaijan", "AZ"], ["Bahrain", "BH"], ["Bangladesh", "BD"],
  ["Belarus", "BY"], ["Belgium", "BE"], ["Bhutan", "BT"], ["Bolivia", "BO"], ["Bosnia and Herzegovina", "BA"],
  ["Brazil", "BR"], ["Brunei", "BN"], ["Bulgaria", "BG"], ["Cambodia", "KH"], ["Cameroon", "CM"],
  ["Canada", "CA"], ["Chile", "CL"], ["China", "CN"], ["Colombia", "CO"], ["Costa Rica", "CR"],
  ["Croatia", "HR"], ["Cuba", "CU"], ["Cyprus", "CY"], ["Czech Republic", "CZ"], ["Denmark", "DK"],
  ["Dominican Republic", "DO"], ["Ecuador", "EC"], ["Egypt", "EG"], ["Estonia", "EE"], ["Ethiopia", "ET"],
  ["Fiji", "FJ"], ["Finland", "FI"], ["France", "FR"], ["Georgia", "GE"], ["Germany", "DE"],
  ["Ghana", "GH"], ["Greece", "GR"], ["Guatemala", "GT"], ["Honduras", "HN"], ["Hong Kong", "HK"],
  ["Hungary", "HU"], ["Iceland", "IS"], ["Indonesia", "ID"], ["Iran", "IR"], ["Iraq", "IQ"],
  ["Ireland", "IE"], ["Israel", "IL"], ["Italy", "IT"], ["Jamaica", "JM"], ["Japan", "JP"],
  ["Jordan", "JO"], ["Kazakhstan", "KZ"], ["Kenya", "KE"], ["Kuwait", "KW"], ["Kyrgyzstan", "KG"],
  ["Laos", "LA"], ["Latvia", "LV"], ["Lebanon", "LB"], ["Libya", "LY"], ["Lithuania", "LT"],
  ["Luxembourg", "LU"], ["Malaysia", "MY"], ["Maldives", "MV"], ["Malta", "MT"], ["Mauritius", "MU"],
  ["Mexico", "MX"], ["Moldova", "MD"], ["Monaco", "MC"], ["Mongolia", "MN"], ["Montenegro", "ME"],
  ["Morocco", "MA"], ["Myanmar", "MM"], ["Namibia", "NA"], ["Nepal", "NP"], ["Netherlands", "NL"],
  ["New Zealand", "NZ"], ["Nicaragua", "NI"], ["Nigeria", "NG"], ["North Korea", "KP"], ["North Macedonia", "MK"],
  ["Norway", "NO"], ["Oman", "OM"], ["Pakistan", "PK"], ["Panama", "PA"], ["Papua New Guinea", "PG"],
  ["Paraguay", "PY"], ["Peru", "PE"], ["Philippines", "PH"], ["Poland", "PL"], ["Portugal", "PT"],
  ["Qatar", "QA"], ["Romania", "RO"], ["Russia", "RU"], ["Rwanda", "RW"], ["Saudi Arabia", "SA"],
  ["Senegal", "SN"], ["Serbia", "RS"], ["Singapore", "SG"], ["Slovakia", "SK"], ["Slovenia", "SI"],
  ["South Africa", "ZA"], ["South Korea", "KR"], ["South Sudan", "SS"], ["Spain", "ES"], ["Sri Lanka", "LK"],
  ["Sudan", "SD"], ["Sweden", "SE"], ["Switzerland", "CH"], ["Syria", "SY"], ["Taiwan", "TW"],
  ["Tajikistan", "TJ"], ["Tanzania", "TZ"], ["Thailand", "TH"], ["Tunisia", "TN"], ["Turkey", "TR"],
  ["Turkmenistan", "TM"], ["Uganda", "UG"], ["Ukraine", "UA"], ["United Arab Emirates", "AE"],
  ["United Kingdom", "GB"], ["Uruguay", "UY"], ["Uzbekistan", "UZ"],
  ["Venezuela", "VE"], ["Vietnam", "VN"], ["Yemen", "YE"], ["Zambia", "ZM"], ["Zimbabwe", "ZW"],
  ["Other / Not Listed", "XX"],
].map(([name, code]) => ({ name, code }));

const COUNTRIES = [
  { name: "United States", code: "US" },
  { name: "India", code: "IN" },
  ...REST_OF_WORLD,
];

const INR_AMOUNTS = ["100", "500", "1000"];
const USD_AMOUNTS = ["5", "10", "20", "50"];

const API_BASE = "/api";
let stripePromise = null;

async function getStripe() {
  if (!stripePromise) {
    const { stripeKey } = await fetch(`${API_BASE}/config`).then((r) => r.json());
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

export default function PartnerPage() {
  const [partnerType, setPartnerType] = useState("");
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [country, setCountry]   = useState("");
  const [email, setEmail]       = useState("");
  const [org, setOrg]           = useState("");
  const [website, setWebsite]   = useState("");
  const [notes, setNotes]       = useState("");
  const [amount, setAmount]     = useState("");

  const [errors, setErrors]     = useState({});
  const [step, setStep]         = useState("form"); // form | stripe-card | processing | success | error
  const [errMsg, setErrMsg]     = useState("");
  const [stripeReady, setStripeReady] = useState(false);
  const [confirming, setConfirming]   = useState(false);

  const stripeRef   = useRef(null);
  const elementsRef = useRef(null);
  const mountedRef  = useRef(false);

  const isDomestic     = country === "India";
  const currencySymbol = isDomestic ? "₹" : "$";
  const amountOptions  = isDomestic ? INR_AMOUNTS : USD_AMOUNTS;

  // Reset amount if it's no longer valid for the newly selected country's currency
  useEffect(() => {
    if (amount && !amountOptions.includes(amount)) setAmount("");
  }, [country]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step !== "stripe-card" || mountedRef.current) return;
    mountedRef.current = true;
    (async () => {
      const stripe = await getStripe();
      stripeRef.current = stripe;
      const res = await fetch(`${API_BASE}/create-stripe-intent`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), name, email, phone, program: "Partnership", frequency: "once" }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) { setErrMsg(data.error || "Could not initialise payment."); setStep("error"); return; }
      const elements = stripe.elements({ clientSecret: data.clientSecret, appearance: { theme: "stripe" } });
      elementsRef.current = elements;
      const paymentElement = elements.create("payment");
      paymentElement.on("ready", () => setStripeReady(true));
      paymentElement.mount("#stripe-payment-element-partner");
    })();
    return () => { mountedRef.current = false; };
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submitPartnerInquiry() {
    const res = await fetch(`${API_BASE}/partner-inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerType, name, phone, country, email, organization: org, website, notes }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Payment succeeded, but the enquiry could not be submitted.");
  }

  const handleStripeConfirm = async () => {
    if (!stripeRef.current || !elementsRef.current) return;
    setConfirming(true);
    try {
      const { error, paymentIntent } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: { return_url: `${window.location.origin}/partner-with-us` },
        redirect: "if_required",
      });
      if (error) { setErrMsg(error.message); setStep("error"); return; }
      if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
        setStep("processing");
        await fetch(`${API_BASE}/confirm-stripe-payment`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id, name, email, phone, amount, program: "Partnership", frequency: "once" }),
        });
        await submitPartnerInquiry();
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
      body: JSON.stringify({ amount: Number(amount), name, email, phone, program: "Partnership", frequency: "once" }),
    });
    const data = await res.json();
    if (!res.ok || !data.orderId) { setErrMsg(data.error || "Could not create order."); setStep("error"); return; }
    setStep("form"); // dismiss the "processing" screen behind the checkout modal
    new window.Razorpay({
      key: data.keyId, amount: data.amount, currency: data.currency,
      name: "Swasthgram", description: `Partnership contribution — ${partnerType}`,
      order_id: data.orderId, prefill: { name, email, contact: phone },
      theme: { color: C.forest },
      handler: async (response) => {
        setStep("processing");
        try {
          const verify = await fetch(`${API_BASE}/verify-razorpay-payment`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, name, email, phone, amount, program: "Partnership", frequency: "once" }),
          });
          const vd = await verify.json();
          if (!vd.success) { setErrMsg(vd.error || "Payment verification failed."); setStep("error"); return; }
          await submitPartnerInquiry();
          setStep("success");
        } catch (err) { setErrMsg(err.message || "Unexpected error."); setStep("error"); }
      },
      modal: { ondismiss: () => setStep("form") },
    }).open();
  };

  function validate() {
    const e = {};
    if (!partnerType)      e.partnerType = true;
    if (!name.trim())      e.name = true;
    if (!phone.trim())     e.phone = true;
    if (!country)          e.country = true;
    if (!email.trim())     e.email = true;
    if (!org.trim())       e.org = true;
    if (!notes.trim())     e.notes = true;
    if (!amount)           e.amount = true;
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
          Your contribution of <strong>{currencySymbol}{Number(amount).toLocaleString()}</strong> has been received and
          your partnership enquiry has been submitted. Our team will get back to you at <strong>{email}</strong> within
          2–3 business days.
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

  if (step === "processing") return (
    <div style={wrap}>
      <Header />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "160px 24px", textAlign: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <Loader size={48} color={C.forest} style={{ marginBottom: 16, animation: "spin 1s linear infinite" }} />
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.textMid }}>Processing your contribution…</p>
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

        {step === "stripe-card" ? (
          <div style={{ background: C.white, borderRadius: 16, padding: 32, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              Complete your contribution
            </h3>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.textLight, marginBottom: 24 }}>
              Partnership contribution · ${Number(amount).toLocaleString()} USD
            </p>
            <div id="stripe-payment-element-partner" style={{ background: "#f9fafb", borderRadius: 10, padding: 16, marginBottom: 20, minHeight: 180 }} />
            {!stripeReady && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.textLight, marginBottom: 12, textAlign: "center" }}>Loading payment form…</p>}
            <button onClick={handleStripeConfirm} disabled={!stripeReady || confirming}
              style={{ width: "100%", padding: "15px", border: "none", borderRadius: 12, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, cursor: (stripeReady && !confirming) ? "pointer" : "not-allowed", background: (stripeReady && !confirming) ? C.forest : "#e5e7eb", color: (stripeReady && !confirming) ? "#fff" : C.textLight, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
              <Wallet size={18} />
              {confirming ? "Processing…" : stripeReady ? `Pay $${Number(amount).toLocaleString()} USD` : "Loading…"}
            </button>
            <button onClick={() => { setStep("form"); mountedRef.current = false; setStripeReady(false); setConfirming(false); }}
              style={{ width: "100%", marginTop: 10, padding: 10, background: "transparent", border: "none", fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.textLight, cursor: "pointer" }}>
              ← Back
            </button>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textLight }}>
              <Lock size={11} /> Secured by Stripe
            </div>
          </div>
        ) : (
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
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ ...inp(errors.country), appearance: "auto", cursor: "pointer" }}
              >
                <option value="">Select country…</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
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
          <div style={{ marginBottom: 24 }}>
            <label style={label}>Tell Us More / Where Did You Learn About Us<Req /></label>
            <textarea rows={4} style={{ ...inp(errors.notes), resize: "vertical", fontFamily: "'Inter',sans-serif" }}
              value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything that helps us understand the partnership you have in mind…" />
          </div>

          {/* Contribution amount */}
          <div style={{ marginBottom: 28 }}>
            <label style={label}>Contribution Amount<Req /></label>
            <select
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!country}
              style={{ ...inp(errors.amount), appearance: "auto", cursor: country ? "pointer" : "not-allowed", opacity: country ? 1 : 0.6 }}
            >
              <option value="">{country ? "Select amount…" : "Select a country first…"}</option>
              {amountOptions.map((v) => (
                <option key={v} value={v}>{currencySymbol}{Number(v).toLocaleString()}</option>
              ))}
            </select>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textLight, marginTop: 6 }}>
              {isDomestic ? "Paid via Razorpay (India)" : country ? "Paid via Stripe (international card)" : "Amounts shown depend on your selected country"}
            </p>
          </div>

          {step === "error" && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
              <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#991b1b" }}>{errMsg}</span>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15,
              background: C.forest, color: "#fff", border: "none", padding: "14px 24px",
              borderRadius: 10, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Wallet size={16} />
            {amount ? `Pay ${currencySymbol}${Number(amount).toLocaleString()}` : "Pay"}
          </button>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textLight }}>
            <Lock size={11} /> Secured by Razorpay & Stripe
          </div>
        </form>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <Footer />
    </div>
  );
}
