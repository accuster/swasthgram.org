import { useState, useEffect, useRef, useMemo } from "react";
import { Calendar, Clock, MapPin, Info, Lock, CheckCircle2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";

const COLS = 4;
// Visual sponsorship categories only — every seat is still charged EVENT.seatPrice
// flat for now. The price labels are category badges, not live pricing yet.
const TIERS = [
  { name: "State Champion", labelColor: "#145a2f", rows: ["$250K–500K", "$100K–250K"] },
  { name: "Village Champion", labelColor: "#7a2347", rows: ["$25K–50K", "$10K–25K"] },
  { name: "Community", labelColor: "#1f3a5c", rows: ["$5K"] },
];

const EVENT = {
  name: "An Evening for Swasthgram",
  meta: "November 18, 2026 · 6:00 PM – 9:00 PM PST. India Community Center, Milpitas, California, USA.",
  seatPrice: 300,
  currency: "$",
  checkoutUrl: "",
  tables: 20,
  seatsPerTable: 10,
};
const TOTAL = EVENT.tables * EVENT.seatsPerTable;

const FUNDRAISING = { raised: 625000, goal: 2000000 };
const fundPct = Math.round((FUNDRAISING.raised / FUNDRAISING.goal) * 100);
const fundRemaining = FUNDRAISING.goal - FUNDRAISING.raised;

function BikeRiderIcon({ size = 46 }) {
  return (
    <svg width={size} height={(size * 34) / 46} viewBox="0 0 46 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx={10} cy={26} r={6} stroke="#fff" strokeWidth={2} />
      <circle cx={34} cy={26} r={6} stroke="#fff" strokeWidth={2} />
      <path d="M10 26 L22 12 L34 26 M22 12 L18 26 M22 12 L28 18" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={24} cy={5} r={3.2} fill="#fff" />
      <path d="M24 8 L21 16 M21 16 L28 15" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <rect x={4} y={10} width={13} height={9} rx={2} fill="#0f1f2b" stroke={C.gold} strokeWidth={1.4} />
      <path d="M8.5 14.5 H14.5 M11.5 11.5 V17.5" stroke={C.gold} strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

const SPEAKERS = [
  { name: "Dr. Sanjay Mehta", role: "Keynote, community health" },
  { name: "Priya Sharma", role: "Swasthmanthan program lead" },
  { name: "Emily Carter", role: "Global health researcher" },
  { name: "Anil and Meera Gupta", role: "Saksham volunteers" },
  { name: "Michael Brooks", role: "Clean air advocate, Shudhvayu" },
  { name: "Kavita Rao", role: "Project Swasthdoot field lead" },
  { name: "Neha Verma", role: "Cancer care outreach" },
  { name: "David Wilson", role: "Host and emcee" },
];

const COUNTRY_CODES_RAW = "Afghanistan|93;Albania|355;Algeria|213;Andorra|376;Angola|244;Argentina|54;Armenia|374;Australia|61;Austria|43;Azerbaijan|994;Bahamas|1;Bahrain|973;Bangladesh|880;Belarus|375;Belgium|32;Bhutan|975;Bolivia|591;Brazil|55;Bulgaria|359;Cambodia|855;Cameroon|237;Canada|1;Chile|56;China|86;Colombia|57;Costa Rica|506;Croatia|385;Cuba|53;Cyprus|357;Czech Republic|420;Denmark|45;Ecuador|593;Egypt|20;Estonia|372;Ethiopia|251;Fiji|679;Finland|358;France|33;Georgia|995;Germany|49;Ghana|233;Greece|30;Guatemala|502;Hong Kong|852;Hungary|36;Iceland|354;India|91;Indonesia|62;Iran|98;Iraq|964;Ireland|353;Israel|972;Italy|39;Jamaica|1;Japan|81;Jordan|962;Kazakhstan|7;Kenya|254;Kuwait|965;Kyrgyzstan|996;Laos|856;Latvia|371;Lebanon|961;Libya|218;Lithuania|370;Luxembourg|352;Malaysia|60;Maldives|960;Malta|356;Mexico|52;Moldova|373;Monaco|377;Mongolia|976;Morocco|212;Myanmar|95;Namibia|264;Nepal|977;Netherlands|31;New Zealand|64;Nicaragua|505;Nigeria|234;North Korea|850;North Macedonia|389;Norway|47;Oman|968;Pakistan|92;Panama|507;Paraguay|595;Peru|51;Philippines|63;Poland|48;Portugal|351;Qatar|974;Romania|40;Russia|7;Rwanda|250;Saudi Arabia|966;Senegal|221;Serbia|381;Singapore|65;Slovakia|421;Slovenia|386;South Africa|27;South Korea|82;Spain|34;Sri Lanka|94;Sudan|249;Sweden|46;Switzerland|41;Syria|963;Taiwan|886;Tajikistan|992;Tanzania|255;Thailand|66;Tunisia|216;Turkey|90;Turkmenistan|993;Uganda|256;Ukraine|380;United Arab Emirates|971;United Kingdom|44;United States|1;Uruguay|598;Uzbekistan|998;Venezuela|58;Vietnam|84;Yemen|967;Zambia|260;Zimbabwe|263";
const COUNTRY_CODES = [...new Set(COUNTRY_CODES_RAW.split(";").map((r) => r.split("|")[1]))].sort((a, b) => +a - +b);

const fmt = (n) => EVENT.currency + n.toLocaleString("en-US");
const seatId = (t, s) => `T${t}-S${s}`;
const parseId = (id) => { const m = id.match(/^T(\d+)-S(\d+)$/); return { t: +m[1], s: +m[2] }; };
const label = (id) => { const p = parseId(id); return `Table ${p.t}, seat ${p.s}`; };
const short = (id) => { const p = parseId(id); return `${p.t}-${p.s}`; };
const initialsOf = (n) => String(n).split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !/^(and|dr\.?)$/i.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
const makeRef = () => {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = "SGF-";
  for (let i = 0; i < 5; i++) r += c[Math.floor(Math.random() * c.length)];
  return r;
};

// Tiered sponsorship floor plan: each tier is a colored band with its own
// rows. Tables number sequentially 1..N, top-to-bottom, left-to-right. The
// last row may be a partial row (fewer than COLS tables), centered.
function layout(width) {
  const narrow = width < 640;
  const W = narrow ? 460 : 1000;
  const leftGutter = narrow ? 36 : 44;
  const rightPad = 20;
  const colPitch = (W - leftGutter - rightPad) / COLS;
  const x0 = leftGutter + colPitch / 2;
  const rowPitch = narrow ? 102 : 124;
  const stageH = 300;

  const pos = [];
  const tierMeta = [];
  let tableNum = 1;
  let y = stageH;
  TIERS.forEach((tier) => {
    const top = y;
    const rows = tier.rows.map((priceLabel) => {
      const rowY = y + rowPitch / 2;
      const remaining = EVENT.tables - tableNum + 1;
      const rowCount = Math.min(COLS, Math.max(0, remaining));
      const rowX0 = x0 + ((COLS - rowCount) / 2) * colPitch;
      for (let c = 0; c < rowCount; c++) pos.push({ t: tableNum++, x: rowX0 + c * colPitch, y: rowY });
      y += rowPitch;
      return { priceLabel, y: rowY };
    });
    tierMeta.push({ name: tier.name, labelColor: tier.labelColor, top, bottom: y, rows });
  });
  const entranceY = y + 30;
  const H = entranceY + 30;
  return { W, H, pos, tierMeta, entranceY, leftGutter };
}

const C = {
  bg: "#FDFBF7", surface: "#F8F5EE", ink: "#1F2937", muted: "#6B7280", line: "#E8E4DC",
  card: "#fff", green: "#1B6B3A", greenDark: "#145A2F", greenDeep: "#0E4422", greenSoft: "#f0fdf4", gold: "#C8963E",
  seatLine: "#B4C7B9", booked: "#9CC9A8", bookedInk: "#1F4D2B", danger: "#dc2626", okBg: "#f0fdf4",
};

const API_BASE = "/api/gala";

export default function GalaPage() {
  const [taken, setTaken] = useState({}); // { [seatLabel]: "held" | "booked" }
  const [selected, setSelected] = useState(new Set());
  const [mySeats, setMySeats] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null); // { ref, ids, amount, paymentStatus }
  const [checkingReturn, setCheckingReturn] = useState(false);
  const [msg, setMsg] = useState({ text: "", err: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("1");
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const panelRef = useRef(null);
  const planRef = useRef(null);

  useEffect(() => {
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => setWidth(window.innerWidth), 120); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const refreshSeats = () => {
    fetch(`${API_BASE}/seats`)
      .then((r) => r.json())
      .then((data) => {
        const next = {};
        (data.taken || []).forEach((t) => { next[t.seat] = t.status; });
        setTaken(next);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshSeats();
    const interval = setInterval(refreshSeats, 15000);
    return () => clearInterval(interval);
  }, []);

  // Returning from Stripe Checkout: success_url and cancel_url both carry ?ref=.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (!ref) return;
    const cancelled = params.get("cancelled") === "1";
    setCheckingReturn(true);

    const settle = () => {
      fetch(`${API_BASE}/bookings/${ref}`)
        .then((r) => { if (!r.ok) throw new Error("not found"); return r.json(); })
        .then((booking) => {
          setResult({
            ref: booking.bookingRef,
            ids: booking.seats,
            amount: booking.totalAmount,
            paymentStatus: cancelled && booking.paymentStatus === "pending" ? "abandoned" : booking.paymentStatus,
          });
          setDone(true);
          setCheckingReturn(false);
          refreshSeats();
          window.history.replaceState({}, "", window.location.pathname);
        })
        .catch(() => setCheckingReturn(false));
    };

    // Webhook may lag a few seconds behind the redirect, so poll briefly.
    const poll = (attemptsLeft) => {
      if (cancelled || attemptsLeft <= 0) { settle(); return; }
      fetch(`${API_BASE}/bookings/${ref}/payment-status`)
        .then((r) => { if (!r.ok) throw new Error("not found"); return r.json(); })
        .then((status) => {
          if (status.paymentStatus === "pending") setTimeout(() => poll(attemptsLeft - 1), 2500);
          else settle();
        })
        .catch(() => setCheckingReturn(false));
    };
    poll(6);
  }, []);

  const status = (id) => {
    const lbl = short(id);
    if (mySeats.has(lbl)) return "mine";
    if (taken[lbl]) return "booked";
    return selected.has(id) ? "sel" : "free";
  };

  const toggleSeat = (id) => {
    const st = status(id);
    if (st === "booked" || st === "mine") return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setMsg({ text: "", err: false });
  };

  const toggleTable = (t) => {
    const free = [];
    for (let s = 1; s <= EVENT.seatsPerTable; s++) {
      const id = seatId(t, s);
      const st = status(id);
      if (st === "free" || st === "sel") free.push(id);
    }
    if (!free.length) return;
    const allSel = free.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      free.forEach((id) => (allSel ? next.delete(id) : next.add(id)));
      return next;
    });
    setMsg({ text: "", err: false });
  };

  const { W, H, pos, tierMeta, entranceY, leftGutter } = useMemo(() => layout(width), [width]);
  const narrow = width < 640;
  const idsSorted = [...selected].sort((a, b) => { const x = parseId(a), y = parseId(b); return x.t - y.t || x.s - y.s; });
  const total = idsSorted.length * EVENT.seatPrice;
  const currentStep = done ? 2 : idsSorted.length ? 1 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busy || !selected.size) return;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const num = phone.trim();
    if (!trimmedName) { setMsg({ text: "Enter your full name.", err: true }); nameRef.current?.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) { setMsg({ text: "Enter a valid email address.", err: true }); emailRef.current?.focus(); return; }
    const nd = num.replace(/\D/g, "").length;
    if (nd < 6 || nd > 14) { setMsg({ text: "Enter a valid phone number without the country code.", err: true }); phoneRef.current?.focus(); return; }

    const seatLabels = idsSorted.map(short);
    setBusy(true);
    setMsg({ text: "", err: false });

    fetch(`${API_BASE}/bookings`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: trimmedName, email: trimmedEmail, phoneCode: code, phoneNumber: num, seats: seatLabels }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || "Could not create the booking.");
        return data;
      })
      .then((booking) => {
        setMySeats(new Set(booking.seats));
        return fetch(`${API_BASE}/bookings/${booking.bookingRef}/checkout`, { method: "POST" })
          .then(async (r) => {
            const data = await r.json().catch(() => ({}));
            if (!r.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
            window.location.href = data.url; // leaves the page
          });
      })
      .catch((err) => {
        setBusy(false);
        setMsg({ text: err.message || "Something went wrong. Please try again.", err: true });
        refreshSeats();
      });
  };

  const bookMore = () => {
    setDone(false);
    setResult(null);
    setSelected(new Set());
    planRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const resumePayment = () => {
    if (!result?.ref) return;
    setBusy(true);
    fetch(`${API_BASE}/bookings/${result.ref}/checkout`, { method: "POST" })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data.url) throw new Error(data.error || "Could not resume checkout.");
        window.location.href = data.url;
      })
      .catch((err) => {
        setBusy(false);
        setMsg({ text: err.message || "Could not resume checkout.", err: true });
      });
  };

  return (
    <div className="gala-page" style={{ background: C.bg, backgroundImage: `radial-gradient(ellipse at 90% 0%, #eaf5ee 0, transparent 42%)`, minHeight: "100vh", color: C.ink, fontFamily: "'Inter',system-ui,sans-serif", fontSize: 16, lineHeight: 1.6 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
        .gala-page *, .gala-page *::before, .gala-page *::after { box-sizing: border-box; }
        .gala-page a { color: ${C.green}; }
        .gala-wrap { max-width: 1080px; margin: 0 auto; padding: 100px 40px 64px; }
        .ticket-card { position: relative; }
        .ticket-card::before, .ticket-card::after {
          content: ''; position: absolute; top: 50%; width: 22px; height: 22px; border-radius: 50%;
          background: ${C.bg}; transform: translateY(-50%); z-index: 1;
        }
        .ticket-card::before { left: -11px; }
        .ticket-card::after { right: -11px; }
        .ticket-stub-divider { position: relative; align-self: stretch; width: 0; border-left: 2px dashed rgba(255,255,255,0.3); flex-shrink: 0; }
        .ticket-stub-divider::before, .ticket-stub-divider::after {
          content: ''; position: absolute; left: 50%; width: 18px; height: 18px; border-radius: 50%;
          background: ${C.bg}; transform: translateX(-50%);
        }
        .ticket-stub-divider::before { top: -9px; }
        .ticket-stub-divider::after { bottom: -9px; top: auto; }
        .bar-track { height: 5px; border-radius: 20px; background: rgba(255,255,255,0.15); overflow: hidden; }
        .bar-fill { height: 100%; background: ${C.gold}; transition: width .4s; }
        .gala-event-mini + .gala-event-mini { border-left: 1px solid ${C.line}; padding-left: 22px; }
        .gala-chip button:hover { background: #d9f0e2; }
        .gala-seat { cursor: pointer; }
        .gala-seat.booked, .gala-seat.mine { cursor: not-allowed; }
        .gala-tbl { cursor: pointer; }
        .gala-tbl.full { cursor: default; }
        .gala-tbl:hover .tbl-top, .gala-tbl:focus-visible .tbl-top { stroke: ${C.green}; stroke-width: 2.5; }
        .gala-seat.free:hover circle { fill: ${C.greenSoft}; stroke: ${C.green}; stroke-width: 2.5; }
        .gala-btn:hover:not(:disabled) { background: ${C.greenDark}; }
        .gala-gcard:hover { border-color: #bcd0c2; transform: translateY(-2px); }
        @keyframes galaBarFill { from { width: 0%; } to { width: ${fundPct}%; } }
        @keyframes galaBikeMove { from { left: 0%; } to { left: ${fundPct}%; } }
        .gala-fund-fill { animation: galaBarFill 1.8s ease-out forwards; }
        .gala-fund-bike { animation: galaBikeMove 1.8s ease-out forwards; }
        @media (max-width: 1050px) {
          .gala-wrap { padding: 116px 24px 70px; }
          .gala-grid, .gala-about { grid-template-columns: minmax(0,1fr) 280px !important; }
          .gala-att-list { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
        }
        @media (max-width: 920px) {
          .gala-grid, .gala-about { grid-template-columns: 1fr !important; }
          .gala-panel { position: static !important; }
          .gala-wrap { padding-bottom: 110px; }
        }
        @media (max-width: 600px) {
          .gala-wrap { padding: 116px 16px 110px; }
          .ticket-card { flex-direction: column !important; }
          .ticket-stub-divider { width: 100% !important; height: 0 !important; border-left: none !important; border-top: 2px dashed rgba(255,255,255,0.3) !important; margin: 4px 0 !important; }
          .ticket-stub-divider::before { top: -9px !important; left: 50% !important; transform: translateX(-50%) !important; }
          .ticket-stub-divider::after { bottom: -9px !important; top: auto !important; left: 50% !important; transform: translateX(-50%) !important; }
          .gala-att-list { grid-template-columns: 1fr !important; }
          .gala-pillars { grid-template-columns: 1fr !important; }
          .gala-highlights { grid-template-columns: 1fr !important; }
          .gala-event-mini + .gala-event-mini { border-left: none !important; padding-left: 0 !important; border-top: 1px solid ${C.line}; padding-top: 13px; margin-top: 2px; }
        }
      `}</style>

      <Header />
      <div className="gala-wrap" style={{ position: "relative" }}>
        <Breadcrumb items={[{ label: "Events", href: "/events" }, { label: "Gala 2026" }]} theme="light" />
        <div style={{ background: "linear-gradient(135deg,#0f1f2b 0%,#16303d 100%)", borderRadius: 14, marginBottom: 30, padding: "28px 32px" }} aria-label="Fundraising progress">
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1, color: C.gold }}>{fmt(FUNDRAISING.raised)}</span>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, color: "#fff" }}>raised toward {fmt(FUNDRAISING.goal)}</span>
          </div>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "8px 0 30px" }}>{fundPct}% of the goal. {fmt(fundRemaining)} still to go.</p>
          <div style={{ position: "relative", height: 22, margin: "0 6px 14px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 11, background: "#1c2e38" }} />
            <div className="gala-fund-fill" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 0, borderRadius: 11, background: C.gold }} />
            <div style={{ position: "absolute", left: 10, right: 10, top: "50%", borderTop: "3px dashed rgba(255,255,255,0.55)" }} />
            {[25, 50, 75].map((p) => (
              <div key={p} style={{ position: "absolute", left: `${p}%`, top: -4, bottom: -4, width: 2, background: "rgba(255,255,255,0.3)" }} />
            ))}
            <div className="gala-fund-bike" style={{ position: "absolute", left: 0, top: "50%", transform: "translate(-50%,-68%)" }}>
              <BikeRiderIcon size={78} />
            </div>
            <div style={{ position: "absolute", right: -2, top: "50%", transform: "translate(0,-70%)" }} aria-hidden="true">
              <svg width={18} height={22} viewBox="0 0 18 22" fill="none">
                <line x1={2} y1={0} x2={2} y2={22} stroke="#fff" strokeWidth={2} />
                <rect x={2} y={1} width={14} height={9} fill="#fff" />
                <rect x={2} y={1} width={3.5} height={3.5} fill="#16303d" />
                <rect x={9} y={1} width={3.5} height={3.5} fill="#16303d" />
                <rect x={5.5} y={4.5} width={3.5} height={3.5} fill="#16303d" />
                <rect x={12.5} y={4.5} width={3.5} height={3.5} fill="#16303d" />
              </svg>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Poppins',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            <span>$0</span><span>$500K</span><span>$1M</span><span>$1.5M</span><span style={{ color: "#fff", fontWeight: 600 }}>{fmt(FUNDRAISING.goal)}</span>
          </div>
        </div>

        <div className="gala-highlights" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: `1px solid ${C.line}`, background: "#fff", borderRadius: 13, padding: "20px 24px", marginBottom: 30, gap: 22 }} aria-label="Event highlights">
          {[
            { Icon: Calendar, k: "Save the date", v: "November 18, 2026" },
            { Icon: Clock, k: "The evening begins", v: "6:00 PM – 9:00 PM PST" },
            { Icon: MapPin, k: "Join us in Milpitas, California, USA", v: "India Community Center" },
          ].map((m, i) => (
            <div key={i} className="gala-event-mini" style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <m.Icon size={22} color={C.green} strokeWidth={1.7} aria-hidden="true" />
              <div style={{ minWidth: 0 }}>
                <span style={{ display: "block", color: C.muted, textTransform: "uppercase", letterSpacing: ".12em", fontSize: 9, fontWeight: 600 }}>{m.k}</span>
                <strong style={{ display: "block", fontWeight: 600, fontSize: 12, marginTop: 3 }}>{m.v}</strong>
              </div>
            </div>
          ))}
        </div>

        {!(done && result?.paymentStatus === "paid") && (
        <div id="booking" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 17 }}>
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", color: C.green, fontWeight: 600, margin: "0 0 7px" }}>Make an impact</p>
            <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontWeight: 400, fontSize: 25, letterSpacing: "-.025em", margin: 0 }}>Take your seat at the table</h2>
          </div>
          <ol style={{ listStyle: "none", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18, padding: 0, margin: 0, color: C.muted, fontSize: 11 }} aria-label="Booking steps">
            {["Choose seats", "Your details", "Reservation"].map((s, i) => (
              <li key={s} style={{ display: "flex", alignItems: "center", gap: 7, color: currentStep === i ? C.green : C.muted, fontWeight: currentStep === i ? 600 : 400 }}>
                <b style={{ fontSize: 10, fontWeight: 600, display: "grid", placeItems: "center", width: 23, height: 23, borderRadius: "50%", background: currentStep === i ? C.green : "#e6ecf3", color: currentStep === i ? "#fff" : "#576b83" }}>{i + 1}</b>
                {s}
              </li>
            ))}
          </ol>
        </div>
        )}

        {done && result?.paymentStatus === "paid" ? (
          <div id="success-ticket" style={{ maxWidth: 420, margin: "40px auto 60px", textAlign: "center", padding: "10px 0" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.greenSoft, display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
              <CheckCircle2 size={30} color={C.green} strokeWidth={1.7} aria-hidden="true" />
            </div>
            <h2 style={{ font: "400 27px/1.3 'Libre Baskerville',Georgia,serif", margin: "0 0 10px" }}>Thank you{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}!</h2>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 26px" }}>
              Your {(result?.ids || []).length > 1 ? "seats are" : "seat is"} reserved, and a ticket has been emailed to you. Every seat funds Swasthgram's work in the field.
            </p>
            <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 13, padding: "4px 20px", textAlign: "left", marginBottom: 24 }}>
              {[
                ["Booking reference", result?.ref],
                ["Seats", (result?.ids || []).join(", ")],
                ["Amount paid", `${fmt(result?.amount || 0)} USD`],
              ].map(([k, v], i) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "13px 0", borderBottom: i < 2 ? `1px solid ${C.line}` : "none" }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{k}</span>
                  <strong style={{ fontSize: 13 }}>{v}</strong>
                </div>
              ))}
            </div>
            <button type="button" onClick={bookMore} className="gala-btn" style={{ background: C.green, color: "#fff", border: 0, borderRadius: 8, padding: "13px 28px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Book more seats
            </button>
          </div>
        ) : (
        <div className="gala-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", alignItems: "start", gap: 22 }}>
          <section ref={planRef} style={{ border: `1px solid ${C.line}`, borderRadius: 16, background: "#fff", overflow: "hidden", padding: "0 20px 20px" }} aria-label="Hall floor plan">
            <div style={{ margin: "0 -20px 0", padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderBottom: `1px solid ${C.line}` }}>
              <div><h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Choose your seats</h3><p style={{ fontSize: 11, color: C.muted, margin: "3px 0 0" }}>Select a seat, or a table to sit together.</p></div>
              <span style={{ color: C.green, background: C.greenSoft, padding: "5px 9px", borderRadius: 6, fontSize: 10, whiteSpace: "nowrap", fontWeight: 500 }}>{EVENT.tables} tables · {TOTAL} seats</span>
            </div>
            <div style={{ background: "radial-gradient(circle,#b5c6d433 .75px,transparent .75px)", backgroundSize: "15px 15px", borderRadius: 10, padding: "12px 5px 10px", marginTop: 14 }}>
              <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`${EVENT.tables} tables with ${EVENT.seatsPerTable} seats each, in three sponsorship tiers`} style={{ display: "block", width: "100%", height: "auto" }}>
                <path
                  d={`M ${W / 2 - Math.min(320, (W - 40) / 2)} 16 L ${W / 2 + Math.min(320, (W - 40) / 2)} 16 L ${W / 2 + Math.min(320, (W - 40) / 2)} 90 Q ${W / 2} 180 ${W / 2 - Math.min(320, (W - 40) / 2)} 90 Z`}
                  fill="#16303d"
                />
                <text x={W / 2} y={102} textAnchor="middle" style={{ font: "700 22px Inter,sans-serif", fill: "#fff" }}>Stage</text>
                {SPEAKERS.map((sp, i) => {
                  const rw = Math.min(600, W - 60);
                  const u = SPEAKERS.length === 1 ? 0 : (i / (SPEAKERS.length - 1)) * 2 - 1;
                  const x = W / 2 + (u * rw) / 2, y = 215;
                  return (
                    <g key={i} aria-label={`${sp.name}, ${sp.role}`}>
                      <title>{sp.name} – {sp.role}</title>
                      <rect x={x - 9} y={y - 10} width={18} height={11} rx={5.5} fill="#9CA3AF" />
                      <rect x={x - 14} y={y - 3} width={28} height={13} rx={6.5} fill="#9CA3AF" />
                    </g>
                  );
                })}
                <text x={W / 2} y={257} textAnchor="middle" style={{ font: "500 13px Inter,sans-serif", fill: C.muted }}>Guest speakers&rsquo; row</text>

                {tierMeta.map((tier, ti) => (
                  <g key={tier.name}>
                    {ti > 0 && <line x1={10} x2={W - 10} y1={tier.top} y2={tier.top} stroke={C.line} strokeWidth={1.5} strokeDasharray="2 4" />}
                    <text
                      x={22} y={(tier.top + tier.bottom) / 2} textAnchor="middle"
                      transform={`rotate(-90 22 ${(tier.top + tier.bottom) / 2})`}
                      style={{ font: "700 12px Inter,sans-serif", fill: tier.labelColor, letterSpacing: ".1em", textTransform: "uppercase" }}
                    >{tier.name}</text>
                  </g>
                ))}

                {pos.map((p) => {
                  let free = 0;
                  for (let s = 1; s <= EVENT.seatsPerTable; s++) {
                    const st = status(seatId(p.t, s));
                    if (st !== "booked" && st !== "mine") free++;
                  }
                  const tableR = narrow ? 22 : 30;
                  const seatRadius = narrow ? 32 : 46;
                  return (
                    <g key={p.t}>
                      <g
                        className={`gala-tbl${free === 0 ? " full" : ""}`}
                        role="button" tabIndex={free === 0 ? -1 : 0}
                        aria-label={`Table ${p.t}, ${free} free seats. Select all free seats`}
                        onClick={() => toggleTable(p.t)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTable(p.t); } }}
                      >
                        <circle className="tbl-top" cx={p.x} cy={p.y} r={tableR} fill={free === 0 ? C.booked : "#ece3d1"} stroke={free === 0 ? "#6FA87E" : "#b9a37d"} strokeWidth={2} style={{ transition: "fill .15s,stroke .15s" }} />
                        <text x={p.x} y={p.y + 5} textAnchor="middle" style={{ font: "700 13px Inter,sans-serif", fill: free === 0 ? C.bookedInk : C.ink }}>{p.t}</text>
                      </g>
                      {Array.from({ length: EVENT.seatsPerTable }).map((_, si) => {
                        const s = si + 1;
                        const aDeg = -90 + (s - 1) * (360 / EVENT.seatsPerTable);
                        const a = (aDeg * Math.PI) / 180;
                        const cx = p.x + Math.cos(a) * seatRadius, cy = p.y + Math.sin(a) * seatRadius;
                        const id = seatId(p.t, s), st = status(id);
                        const words = { free: "available", sel: "selected", booked: "booked", mine: "booked by you" }[st];
                        const fill = st === "free" ? "#f3eee1" : st === "sel" ? C.green : st === "booked" ? C.booked : C.gold;
                        const stroke = st === "free" ? "#c9b896" : st === "sel" ? C.green : st === "booked" ? "#6FA87E" : C.gold;
                        const textFill = st === "free" ? "#5c5236" : st === "booked" ? C.bookedInk : "#fff";
                        return (
                          <g
                            key={id}
                            className={`gala-seat ${st}`}
                            role="button" tabIndex={st === "booked" || st === "mine" ? -1 : 0}
                            aria-pressed={st === "sel"} aria-label={`${label(id)}, ${words}`}
                            onClick={() => toggleSeat(id)}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSeat(id); } }}
                            transform={`translate(${cx} ${cy}) rotate(${aDeg + 90})`}
                          >
                            <rect
                              x={-9} y={-10} width={18} height={20} rx={4} ry={4}
                              fill={fill} stroke={stroke} strokeWidth={2}
                              style={{ transition: "fill .15s,stroke .15s" }}
                            />
                            <text x={0} y={4} textAnchor="middle" transform={`rotate(${-(aDeg + 90)})`} style={{ font: "700 10px Inter,sans-serif", fill: textFill, pointerEvents: "none" }}>{s}</text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                <rect x={W / 2 - 35} y={entranceY - 16} width={70} height={6} rx={3} fill="#64748b" />
                <text x={W / 2} y={entranceY} textAnchor="middle" style={{ font: "600 10px Inter,sans-serif", fill: "#94a3b8", letterSpacing: ".1em", textTransform: "uppercase" }}>Main entrance</text>
              </svg>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "9px 16px", padding: "15px 0 12px", borderTop: `1px solid ${C.line}`, fontSize: 10, color: C.muted }}>
              {[["#f3eee1", "Available", "#c9b896"], [C.green, "Selected"], [C.booked, "Booked", "#6FA87E"], [C.gold, "Your seats"], [C.greenSoft, "Speakers (not bookable)", C.green]].map(([bg, t, bd], i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <i style={{ width: 11, height: 11, borderRadius: "50%", display: "inline-block", background: bg, border: bd ? `1.5px solid ${bd}` : "none" }} />{t}
                </span>
              ))}
            </div>
            <p style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 11, color: C.muted, background: C.surface, borderRadius: 8, padding: "10px 12px", margin: 0 }}>
              <Info size={15} strokeWidth={1.7} aria-hidden="true" style={{ marginTop: 2, flexShrink: 0 }} />
              Tap a seat to pick it. Tap a table to pick every free seat at it.
            </p>
          </section>

          <aside ref={panelRef} className="gala-panel" style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, boxShadow: "0 9px 25px #172b4408", position: "sticky", top: 20, overflow: "hidden" }}>
            <div style={{ content: '""', height: 4, background: C.gold, position: "absolute", top: 0, left: 0, right: 0 }} />
            {!done ? (
              <div>
                <p style={{ margin: "0 0 14px", letterSpacing: ".15em", textTransform: "uppercase", fontSize: 9, fontWeight: 600, color: C.muted }}>Your reservation</p>
                <h2 style={{ display: "flex", alignItems: "center", gap: 10, font: "400 21px/1.4 'Libre Baskerville',Georgia,serif", margin: "0 0 8px" }}>Your seats</h2>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: C.muted, margin: "0 0 18px" }}>{fmt(EVENT.seatPrice)} per seat. All proceeds support the foundation's health programs.</p>
                {idsSorted.length > 0 ? (
                  <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: 6, padding: 0, margin: "0 0 14px" }}>
                    {idsSorted.map((id) => (
                      <li key={id} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.greenSoft, color: C.green, border: "1px solid #cfe8d8", borderRadius: 7, padding: "4px 4px 4px 10px", fontSize: 12, fontWeight: 600 }}>
                        {short(id)}
                        <button type="button" onClick={() => toggleSeat(id)} aria-label={`Remove ${label(id)}`} style={{ border: 0, background: "transparent", color: C.green, width: 28, height: 28, borderRadius: 4, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ border: "1px dashed #ccd7e4", background: "#f8fafc", color: C.muted, fontSize: 12, textAlign: "center", borderRadius: 9, padding: "19px 12px", margin: "0 0 16px" }}>No seats picked yet. Choose seats on the floor plan.</p>
                )}
                <div style={{ background: "#f0f4f9", borderRadius: 9, padding: "13px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 10 }}>
                  <span style={{ color: C.muted, fontSize: 11 }}>Total contribution</span>
                  <strong style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.035em" }}>{fmt(total)}</strong>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                  <p style={{ fontSize: 10, fontWeight: 600, color: C.ink, letterSpacing: ".1em", textTransform: "uppercase", margin: "0 0 14px" }}>Guest information</p>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, marginBottom: 6 }} htmlFor="fName">Full name<span style={{ color: C.danger }} aria-hidden="true"> *</span></label>
                  <input ref={nameRef} id="fName" placeholder="Your full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, marginBottom: 6 }} htmlFor="fEmail">Email<span style={{ color: C.danger }} aria-hidden="true"> *</span></label>
                  <input ref={emailRef} id="fEmail" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, marginBottom: 6 }} htmlFor="fPhone">Phone<span style={{ color: C.danger }} aria-hidden="true"> *</span></label>
                  <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    <select aria-label="Country code" value={code} onChange={(e) => setCode(e.target.value)} style={{ width: 77, flexShrink: 0, color: C.ink, background: "#fff", border: "1px solid #d5dee9", borderRadius: 8, padding: "9px 5px", fontSize: 14 }}>
                      {COUNTRY_CODES.map((c) => <option key={c} value={c}>+{c}</option>)}
                    </select>
                    <input ref={phoneRef} id="fPhone" type="tel" inputMode="tel" placeholder="Phone number" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ ...inputStyle, margin: 0, flex: 1, minWidth: 0 }} />
                  </div>
                  <button className="gala-btn" type="submit" disabled={idsSorted.length === 0 || busy} style={{ width: "100%", border: 0, borderRadius: 8, background: (idsSorted.length === 0 || busy) ? "#e4eaf1" : C.green, color: (idsSorted.length === 0 || busy) ? "#64748b" : "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.5, padding: "13px 12px", cursor: (idsSorted.length === 0 || busy) ? "not-allowed" : "pointer", transition: "background .2s" }}>
                    {busy ? "Redirecting to payment…" : idsSorted.length === 0 ? "Pick seats to book" : `Pay ${fmt(total)}`}
                  </button>
                  <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: C.muted, fontSize: 10, lineHeight: 1.5, margin: "12px 0" }}>
                    <Lock size={14} aria-hidden="true" />
                    You'll be redirected to Stripe to pay securely
                  </p>
                  {msg.text && <p style={{ fontSize: 12, margin: "10px 0 0", color: msg.err ? C.danger : C.ink }} role="status">{msg.text}</p>}
                </form>
              </div>
            ) : checkingReturn ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <p style={{ fontSize: 13, color: C.muted }}>Checking your payment status…</p>
              </div>
            ) : (
              <div>
                <div style={{ background: result?.paymentStatus === "paid" ? C.okBg : "#fff8ec", border: `1px solid ${result?.paymentStatus === "paid" ? "#c6e1d4" : "#eddcab"}`, borderRadius: 12, padding: 17 }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 600, margin: "0 0 14px", color: result?.paymentStatus === "paid" ? "#226449" : "#92650f" }}>
                    <CheckCircle2 size={20} strokeWidth={1.7} aria-hidden="true" />
                    {result?.paymentStatus === "paid" ? "Payment received"
                      : result?.paymentStatus === "pending" ? "Payment processing"
                      : result?.paymentStatus === "abandoned" ? "Payment not completed"
                      : "Booking not active"}
                  </h3>
                  <p style={{ fontSize: 12, margin: "0 0 7px" }}>Booking reference</p>
                  <p style={{ fontSize: 23, fontWeight: 600, letterSpacing: ".03em" }}>{result?.ref}</p>
                  <p style={{ fontSize: 12, margin: "0 0 7px" }}>{(result?.ids || []).join(", ")}</p>
                  <p style={{ fontSize: 12, margin: 0 }}>{result?.paymentStatus === "paid" ? "Amount paid" : "Amount due"}: {fmt(result?.amount || 0)} USD</p>
                </div>
                {(result?.paymentStatus === "pending" || result?.paymentStatus === "abandoned") && (
                  <button type="button" onClick={resumePayment} disabled={busy} className="gala-btn" style={{ display: "block", width: "100%", textAlign: "center", marginTop: 10, background: busy ? "#e4eaf1" : C.green, color: busy ? "#64748b" : "#fff", border: 0, borderRadius: 8, padding: "13px 12px", fontSize: 12, fontWeight: 600, cursor: busy ? "not-allowed" : "pointer" }}>
                    {busy ? "Redirecting…" : "Complete payment"}
                  </button>
                )}
                <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: C.muted, fontSize: 10, lineHeight: 1.5, margin: "12px 0" }}>
                  <Lock size={14} aria-hidden="true" />
                  Card payment is handled by Stripe. Your card details never reach this page.
                </p>
                {msg.text && <p style={{ fontSize: 12, margin: "0 0 12px", color: msg.err ? C.danger : C.ink }} role="status">{msg.text}</p>}
                <button type="button" onClick={bookMore} style={{ width: "100%", color: C.green, background: "#fff", border: `1px solid ${C.line}`, marginTop: 10, borderRadius: 8, padding: "13px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Book more seats
                </button>
              </div>
            )}
          </aside>
        </div>
        )}

        <section className="gala-about" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 355px", gap: 45, marginTop: 48, padding: "38px 0 0", borderTop: `1px solid ${C.line}` }} aria-labelledby="aboutTitle">
          <div>
            <h2 id="aboutTitle" style={{ display: "flex", alignItems: "center", gap: 10, font: "400 25px/1.4 'Libre Baskerville',Georgia,serif", margin: "0 0 18px", letterSpacing: "-.02em" }}>About the evening</h2>
            <p style={{ fontSize: 13, lineHeight: 1.85, margin: "0 0 16px", maxWidth: "72ch", color: "#51647a" }}>Join supporters, doctors and partners of Swasthgram Global Foundation for an evening of dinner, music and stories from the field. For years the foundation has taken healthcare to villages that hospitals don't reach: free health camps, preventive screening, cancer care support and diagnostics delivered on two wheels through Project Swasthdoot.</p>
            <p style={{ fontSize: 13, lineHeight: 1.85, margin: "0 0 16px", maxWidth: "72ch", color: "#51647a" }}>Every seat you book funds this work. Proceeds from the gala go to our three programs: Swasthmanthan for community health, Saksham for empowerment and livelihoods, and Shudhvayu for clean air. You'll hear from the people behind these programs, meet the team, and see what your support made possible this year.</p>
            <div className="gala-pillars" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 9, margin: "23px 0" }} aria-label="Programs supported">
              {[["01 / HEALTH", "Swasthmanthan", "Last-mile community care"], ["02 / OPPORTUNITY", "Saksham", "Empowerment & livelihoods"], ["03 / CLEAN AIR", "Shudhvayu", "Healthier air for everyone"]].map(([tag, title, desc]) => (
                <div key={title} style={{ border: `1px solid ${C.line}`, borderRadius: 9, padding: "13px 12px", background: "#fff" }}>
                  <span style={{ fontSize: 9, letterSpacing: ".08em", color: C.gold, fontWeight: 600 }}>{tag}</span>
                  <strong style={{ overflowWrap: "anywhere", display: "block", fontSize: 11, fontWeight: 600, margin: "4px 0" }}>{title}</strong>
                  <p style={{ fontSize: 10, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 10, lineHeight: 1.8, color: C.muted }}>Swasthgram Global Foundation is a US 501(c)(3) nonprofit. Contributions are tax-deductible to the extent allowed by law.</p>
          </div>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 13, padding: "22px 20px" }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", color: C.green, fontWeight: 600, margin: "0 0 7px" }}>Meet the voices behind the impact</p>
            <h3 style={{ font: "400 16px/1.4 'Libre Baskerville',Georgia,serif", margin: "0 0 16px" }}>Guest speakers</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Manoj Goes", "IIT Startup President"],
                ["Sumit Ganguly", "American Political Scientist"],
              ].map(([name, title], i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: i === 0 ? 14 : 0, borderBottom: i === 0 ? `1px solid ${C.line}` : "none" }}>
                  <span style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", color: "#4B5563", background: "#EDEEF0", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initialsOf(name)}</span>
                  <div>
                    <strong style={{ display: "block", fontSize: 12, fontWeight: 600 }}>{name}</strong>
                    <span style={{ fontSize: 10.5, color: C.muted }}>{title}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 10.5, color: C.muted, margin: "14px 0 0" }}>More speakers to be announced soon.</p>
          </div>
        </section>

        {/* Bottom speaker grid — disabled for now, this displays on the portal instead.
        <section style={{ marginTop: 38, borderTop: `1px solid ${C.line}`, paddingTop: 32 }} aria-labelledby="spkTitle">
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", color: C.green, fontWeight: 600, margin: "0 0 7px" }}>Meet the voices behind the impact</p>
          <h2 id="spkTitle" style={{ display: "flex", alignItems: "center", gap: 10, font: "400 25px/1.4 'Libre Baskerville',Georgia,serif", margin: "0 0 18px" }}>Guest speakers</h2>
          <ul className="gala-att-list" style={{ listStyle: "none", display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12, margin: 0, padding: 0 }}>
            {SPEAKERS.map((sp) => (
              <li key={sp.name} className="gala-gcard" style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "17px 14px", transition: "border .2s,transform .2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ flexShrink: 0, width: 36, height: 36, display: "grid", placeItems: "center", borderRadius: "50%", background: C.greenSoft, color: C.green, fontSize: 11, fontWeight: 600 }}>{initialsOf(sp.name)}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <strong style={{ display: "block", fontSize: 11, fontWeight: 600, lineHeight: 1.5 }}>{sp.name}</strong>
                    <small style={{ display: "block", fontSize: 9, color: C.muted, lineHeight: 1.6, marginTop: 3 }}>{sp.role}</small>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        */}

      </div>
      <Footer />
    </div>
  );
}

const inputStyle = {
  width: "100%", color: C.ink, background: "#fff",
  border: `1px solid ${C.line}`, borderRadius: 8, padding: "11px 12px",
  margin: "0 0 15px", fontSize: 14, outline: "none",
  fontFamily: "'Inter',sans-serif",
};
