import { useState, useEffect, useRef, useMemo } from "react";
import { Calendar, Clock, MapPin, Info, Lock, CheckCircle2, Armchair, Music } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";

const EVENT = {
  name: "An Evening for Swasthgram",
  meta: "November 12, 2026 · 3:00 PM – 10:00 PM. India Community Center, Milpitas, CA.",
  seatPrice: 5000,
  currency: "$",
  checkoutUrl: "",
  tables: 12,
  seatsPerTable: 6,
};
const TOTAL = EVENT.tables * EVENT.seatsPerTable;

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
const L = (t) => String.fromCharCode(64 + t);
const label = (id) => { const p = parseId(id); return `Table ${L(p.t)}, seat ${p.s}`; };
const short = (id) => { const p = parseId(id); return L(p.t) + p.s; };
const initialsOf = (n) => String(n).split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !/^(and|dr\.?)$/i.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
const makeRef = () => {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = "SGF-";
  for (let i = 0; i < 5; i++) r += c[Math.floor(Math.random() * c.length)];
  return r;
};

function layout(width) {
  const narrow = width < 640;
  const cols = narrow ? 2 : 4;
  const rows = Math.ceil(EVENT.tables / cols);
  const W = narrow ? 520 : 1000;
  const top = 210, rowGap = 210;
  const H = top + rows * rowGap - 20;
  const span = 190;
  const x0 = (W - span * (cols - 1)) / 2;
  const pos = [];
  for (let i = 0; i < EVENT.tables; i++) {
    pos.push({ t: i + 1, x: x0 + (i % cols) * span, y: top + 70 + Math.floor(i / cols) * rowGap });
  }
  return { W, H, pos };
}

const C = {
  bg: "#FDFBF7", surface: "#F8F5EE", ink: "#1F2937", muted: "#6B7280", line: "#E8E4DC",
  card: "#fff", green: "#1B6B3A", greenDark: "#145A2F", greenDeep: "#0E4422", greenSoft: "#f0fdf4", gold: "#C8963E",
  seatLine: "#B4C7B9", booked: "#E8E4DC", bookedInk: "#6B7280", danger: "#dc2626", okBg: "#f0fdf4",
};

export default function GalaPage() {
  const [seats, setSeats] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [myId] = useState("local");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
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

  const status = (id) => {
    if (seats[id] && seats[id].by) return seats[id].by === myId ? "mine" : "booked";
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

  const { W, H, pos } = useMemo(() => layout(width), [width]);
  const bookedCount = Object.values(seats).filter((v) => v && v.by).length;
  const idsSorted = [...selected].sort((a, b) => { const x = parseId(a), y = parseId(b); return x.t - y.t || x.s - y.s; });
  const total = idsSorted.length * EVENT.seatPrice;
  const currentStep = done ? 2 : idsSorted.length ? 1 : 0;

  const scrollToPanel = () => {
    panelRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 400);
  };

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

    const ids = idsSorted;
    const ref = makeRef();
    const amount = ids.length * EVENT.seatPrice;
    setBusy(true);
    setMsg({ text: "", err: false });

    setSeats((prev) => {
      const next = { ...prev };
      ids.forEach((id) => { next[id] = { by: myId, ref }; });
      return next;
    });
    setSelected(new Set());
    setResult({ ref, ids, amount });
    setDone(true);
    setName(""); setEmail(""); setPhone("");
    setBusy(false);
  };

  const bookMore = () => {
    setDone(false);
    setResult(null);
    planRef.current?.scrollIntoView({ behavior: "smooth" });
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
        .gala-mbar { position: fixed; left: 0; right: 0; bottom: 0; display: none; align-items: center; justify-content: space-between; gap: 12px; background: #fff; border-top: 1px solid ${C.line}; box-shadow: 0 -4px 24px #17293710; padding: 12px 20px calc(12px + env(safe-area-inset-bottom,0px)); z-index: 10; }
        .gala-mbar.show { display: flex; }
        @media (max-width: 1050px) {
          .gala-wrap { padding: 90px 24px 70px; }
          .gala-grid, .gala-about { grid-template-columns: minmax(0,1fr) 280px !important; }
          .gala-att-list { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
        }
        @media (max-width: 920px) {
          .gala-grid, .gala-about { grid-template-columns: 1fr !important; }
          .gala-panel { position: static !important; }
          .gala-wrap { padding-bottom: 110px; }
          .gala-mbar.show { display: flex; }
        }
        @media (max-width: 600px) {
          .gala-wrap { padding: 84px 16px 110px; }
          .ticket-card { flex-direction: column !important; }
          .ticket-stub-divider { width: 100% !important; height: 0 !important; border-left: none !important; border-top: 2px dashed rgba(255,255,255,0.3) !important; margin: 4px 0 !important; }
          .ticket-stub-divider::before { top: -9px !important; left: 50% !important; transform: translateX(-50%) !important; }
          .ticket-stub-divider::after { bottom: -9px !important; top: auto !important; left: 50% !important; transform: translateX(-50%) !important; }
          .gala-att-list { grid-template-columns: 1fr !important; }
          .gala-pillars { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Header />
      <div className="gala-wrap" style={{ position: "relative" }}>
        <Breadcrumb items={[{ label: "Events", href: "/events" }, { label: "Gala 2026" }]} theme="light" />
        <div className="ticket-card" style={{ background: `linear-gradient(135deg, ${C.greenDeep} 0%, ${C.green} 100%)`, borderRadius: 14, marginBottom: 30, display: "flex", alignItems: "stretch", overflow: "visible" }}>
          <div style={{ padding: 28, display: "flex", gap: 16, alignItems: "flex-start", flex: "1 1 62%" }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Calendar size={26} color={C.gold} strokeWidth={1.7} aria-hidden="true" />
            </div>
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>Save the Date · USA</div>
              <h1 style={{ font: "700 clamp(22px,3vw,30px)/1.25 'Libre Baskerville',Georgia,serif", color: "#fff", margin: "0 0 8px" }}>{EVENT.name}</h1>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: 0, maxWidth: "60ch" }}>An evening of connection. A lasting impact on communities. Join us in bringing healthcare closer to those who need it most.</p>
            </div>
          </div>
          <div className="ticket-stub-divider" />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, padding: "22px 28px", flex: "1 1 38%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Calendar size={15} color={C.gold} strokeWidth={1.7} aria-hidden="true" />November 12, 2026</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={15} color={C.gold} strokeWidth={1.7} aria-hidden="true" />India Community Center, Milpitas, CA</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Clock size={15} color={C.gold} strokeWidth={1.7} aria-hidden="true" />3:00 PM – 10:00 PM</div>
            </div>
            <div aria-live="polite">
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 6 }}><strong style={{ color: "#fff", fontSize: 15 }}>{bookedCount}</strong> of {TOTAL} seats booked</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(bookedCount / TOTAL) * 100}%` }} />
              </div>
            </div>
            <button type="button" onClick={scrollToPanel} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.gold, color: "#1a1a1a", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, padding: "12px 20px", borderRadius: 8, border: "none", cursor: "pointer" }}>
              Reserve your place <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: `1px solid ${C.line}`, background: "#fff", borderRadius: 13, padding: "20px 24px", marginBottom: 30, gap: 22 }} aria-label="Event highlights">
          {[
            { Icon: Calendar, k: "Save the date", v: "November 12, 2026" },
            { Icon: Clock, k: "The evening begins", v: "3:00 PM – 10:00 PM" },
            { Icon: MapPin, k: "Join us in Milpitas, CA", v: "India Community Center" },
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

        <div id="booking" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 17 }}>
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", color: C.green, fontWeight: 600, margin: "0 0 7px" }}>Make an impact</p>
            <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontWeight: 400, fontSize: 25, letterSpacing: "-.025em", margin: 0 }}>Take your seat at the table</h2>
          </div>
          <ol style={{ listStyle: "none", display: "flex", alignItems: "center", gap: 18, padding: 0, margin: 0, color: C.muted, fontSize: 11 }} aria-label="Booking steps">
            {["Choose seats", "Your details", "Reservation"].map((s, i) => (
              <li key={s} style={{ display: "flex", alignItems: "center", gap: 7, color: currentStep === i ? C.green : C.muted, fontWeight: currentStep === i ? 600 : 400 }}>
                <b style={{ fontSize: 10, fontWeight: 600, display: "grid", placeItems: "center", width: 23, height: 23, borderRadius: "50%", background: currentStep === i ? C.green : "#e6ecf3", color: currentStep === i ? "#fff" : "#576b83" }}>{i + 1}</b>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="gala-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", alignItems: "start", gap: 22 }}>
          <section ref={planRef} style={{ border: `1px solid ${C.line}`, borderRadius: 16, background: "#fff", overflow: "hidden", padding: "0 20px 20px" }} aria-label="Hall floor plan">
            <div style={{ margin: "0 -20px 0", padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderBottom: `1px solid ${C.line}` }}>
              <div><h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Choose your seats</h3><p style={{ fontSize: 11, color: C.muted, margin: "3px 0 0" }}>Select a seat, or a table to sit together.</p></div>
              <span style={{ color: C.green, background: C.greenSoft, padding: "5px 9px", borderRadius: 6, fontSize: 10, whiteSpace: "nowrap", fontWeight: 500 }}>12 tables · 72 seats</span>
            </div>
            <div style={{ background: "radial-gradient(circle,#b5c6d433 .75px,transparent .75px)", backgroundSize: "15px 15px", borderRadius: 10, padding: "22px 5px 10px", marginTop: 14 }}>
              <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Twelve tables with six seats each" style={{ display: "block", width: "100%", height: "auto" }}>
                <path
                  d={`M ${W / 2 - Math.min(300, (W - 60) / 2)} 60 Q ${W / 2} 16 ${W / 2 + Math.min(300, (W - 60) / 2)} 60 Q ${W / 2} 44 ${W / 2 - Math.min(300, (W - 60) / 2)} 60 Z`}
                  fill={C.greenSoft} stroke={C.green} strokeWidth={2}
                />
                <text x={W / 2} y={92} textAnchor="middle" style={{ font: "600 11px Inter,sans-serif", fill: C.muted, letterSpacing: ".12em", textTransform: "uppercase" }}>Stage</text>
                {SPEAKERS.map((sp, i) => {
                  const rw = Math.min(600, W - 60);
                  const u = SPEAKERS.length === 1 ? 0 : (i / (SPEAKERS.length - 1)) * 2 - 1;
                  const x = W / 2 + (u * rw) / 2, y = 142;
                  return (
                    <g key={i} aria-label={`${sp.name}, ${sp.role}`}>
                      <title>{sp.name} – {sp.role}</title>
                      <circle cx={x} cy={y} r={19} fill={C.greenSoft} stroke={C.green} strokeWidth={1.5} />
                      <text x={x} y={y + 4} textAnchor="middle" style={{ font: "600 11px Inter,sans-serif", fill: C.green }}>{initialsOf(sp.name)}</text>
                    </g>
                  );
                })}
                <text x={W / 2} y={184} textAnchor="middle" style={{ font: "500 13px Inter,sans-serif", fill: C.muted }}>Guest speakers&rsquo; row</text>
                {pos.map((p) => {
                  let free = 0;
                  for (let s = 1; s <= EVENT.seatsPerTable; s++) if (!(seats[seatId(p.t, s)] || {}).by) free++;
                  return (
                    <g key={p.t}>
                      <g
                        className={`gala-tbl${free === 0 ? " full" : ""}`}
                        role="button" tabIndex={free === 0 ? -1 : 0}
                        aria-label={`Table ${L(p.t)}, ${free} free seats. Select all free seats`}
                        onClick={() => toggleTable(p.t)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTable(p.t); } }}
                      >
                        <circle className="tbl-top" cx={p.x} cy={p.y} r={46} fill="#f7f9fc" stroke="#c7d4e2" strokeWidth={1.5} style={{ transition: "stroke .15s" }} />
                        <text x={p.x} y={p.y - 1} textAnchor="middle" style={{ font: "600 16px Inter,sans-serif", fill: C.ink }}>Table {L(p.t)}</text>
                        <text x={p.x} y={p.y + 17} textAnchor="middle" style={{ font: "500 12px Inter,sans-serif", fill: C.muted }}>{free === 0 ? "Full" : `${free} free`}</text>
                      </g>
                      {Array.from({ length: EVENT.seatsPerTable }).map((_, si) => {
                        const s = si + 1;
                        const aDeg = -90 + (s - 1) * (360 / EVENT.seatsPerTable);
                        const a = (aDeg * Math.PI) / 180;
                        const seatRadius = 60;
                        const cx = p.x + Math.cos(a) * seatRadius, cy = p.y + Math.sin(a) * seatRadius;
                        const id = seatId(p.t, s), st = status(id);
                        const words = { free: "available", sel: "selected", booked: "booked", mine: "booked by you" }[st];
                        const fill = st === "free" ? "#fff" : st === "sel" ? C.green : st === "booked" ? C.booked : C.gold;
                        const stroke = st === "free" ? C.seatLine : st === "sel" ? C.green : st === "booked" ? "#c1cbd7" : C.gold;
                        const textFill = st === "free" ? "#365572" : st === "booked" ? C.bookedInk : "#fff";
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
                              x={-10} y={-11} width={20} height={22} rx={4} ry={4}
                              fill={fill} stroke={stroke} strokeWidth={1.6}
                              style={{ transition: "fill .15s,stroke .15s" }}
                            />
                            <text x={0} y={4} textAnchor="middle" transform={`rotate(${-(aDeg + 90)})`} style={{ font: "600 10px Inter,sans-serif", fill: textFill, pointerEvents: "none" }}>{s}</text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "9px 16px", padding: "15px 0 12px", borderTop: `1px solid ${C.line}`, fontSize: 10, color: C.muted }}>
              {[["#fff", "Available", C.seatLine], [C.green, "Selected"], [C.booked, "Booked", "#b8c2cf"], [C.gold, "Your seats"], [C.greenSoft, "Speakers (not bookable)", C.green]].map(([bg, t, bd], i) => (
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
            <div style={{ content: '""', height: 4, background: `linear-gradient(90deg,${C.greenDark} 70%,${C.gold} 70%)`, position: "absolute", top: 0, left: 0, right: 0 }} />
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
                    {busy ? "Booking…" : idsSorted.length === 0 ? "Pick seats to book" : `Reserve ${idsSorted.length} seat${idsSorted.length > 1 ? "s" : ""} and pay ${fmt(total)}`}
                  </button>
                  <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: C.muted, fontSize: 10, lineHeight: 1.5, margin: "12px 0" }}>
                    <Lock size={14} aria-hidden="true" />
                    Payment availability shown after reservation
                  </p>
                  {msg.text && <p style={{ fontSize: 12, margin: "10px 0 0", color: msg.err ? C.danger : C.ink }} role="status">{msg.text}</p>}
                </form>
                <p style={{ fontSize: 10, color: C.muted, lineHeight: 1.65, margin: "17px 0 0", paddingTop: 13, borderTop: `1px solid ${C.line}` }}>
                  Demo mode: you can try the full booking flow, but bookings in this copy are not saved.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ background: C.okBg, border: "1px solid #c6e1d4", borderRadius: 12, padding: 17 }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 600, margin: "0 0 14px", color: "#226449" }}>
                    <CheckCircle2 size={20} strokeWidth={1.7} aria-hidden="true" />
                    Demo reservation
                  </h3>
                  <p style={{ fontSize: 12, margin: "0 0 7px" }}>Booking reference</p>
                  <p style={{ fontSize: 23, fontWeight: 600, letterSpacing: ".03em" }}>{result?.ref}</p>
                  <p style={{ fontSize: 12, margin: "0 0 7px" }}>{result?.ids.map(short).join(", ")}</p>
                  <p style={{ fontSize: 12, margin: 0 }}>Amount due: {fmt(result?.amount || 0)} USD</p>
                </div>
                <button type="button" disabled style={{ display: "block", width: "100%", textAlign: "center", textDecoration: "none", marginTop: 10, background: C.line, color: C.muted, cursor: "not-allowed", border: 0, borderRadius: 8, padding: "13px 12px", fontSize: 12, fontWeight: 600 }}>
                  Online payment opens soon
                </button>
                <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: C.muted, fontSize: 10, lineHeight: 1.5, margin: "12px 0" }}>
                  <Lock size={14} aria-hidden="true" />
                  Card payment is handled by Stripe. Your card details never reach this page.
                </p>
                <p style={{ fontSize: 10, color: C.muted, lineHeight: 1.65, margin: "0 0 17px" }}>This is a preview only. Your selection is not saved and no payment has been collected.</p>
                <button type="button" onClick={bookMore} style={{ width: "100%", color: C.green, background: "#fff", border: `1px solid ${C.line}`, marginTop: 10, borderRadius: 8, padding: "13px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Book more seats
                </button>
              </div>
            )}
          </aside>
        </div>

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
          <dl style={{ margin: 0, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 13, padding: "5px 18px" }}>
            {[
              ["Date", "November 12, 2026", Calendar],
              ["Time", "3:00 PM – 10:00 PM", Clock],
              ["Venue", <>India Community Center<br />Milpitas, CA</>, MapPin],
              ["Seating", "12 tables of 6, $5,000 per seat", Armchair],
              ["Evening program", "Welcome reception, dinner, impact stories, live music, closing remarks", Music],
            ].map(([dt, dd, RowIcon], i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 0", borderBottom: i < 4 ? `1px solid ${C.line}` : "none" }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", color: C.green, background: C.greenSoft, flexShrink: 0 }}>
                  <RowIcon size={16} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <div><dt style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>{dt}</dt><dd style={{ margin: 0, fontSize: 11, fontWeight: 500, lineHeight: 1.7 }}>{dd}</dd></div>
              </div>
            ))}
          </dl>
        </section>

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

      </div>
      <Footer />

      <div className={`gala-mbar${idsSorted.length > 0 && !done ? " show" : ""}`}>
        <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
          <span>{idsSorted.length} seat{idsSorted.length !== 1 ? "s" : ""} selected</span>
          <strong style={{ display: "block", fontSize: 20, color: C.ink }}>{fmt(total)}</strong>
        </p>
        <button className="gala-btn" type="button" onClick={scrollToPanel} style={{ width: "auto", minWidth: 130, border: 0, borderRadius: 8, background: C.green, color: "#fff", fontSize: 12, fontWeight: 600, padding: "12px 18px", cursor: "pointer" }}>Continue</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", color: C.ink, background: "#fff",
  border: `1px solid ${C.line}`, borderRadius: 8, padding: "11px 12px",
  margin: "0 0 15px", fontSize: 14, outline: "none",
  fontFamily: "'Inter',sans-serif",
};
