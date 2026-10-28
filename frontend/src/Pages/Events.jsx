import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Bike, GraduationCap, Wind, Bell, Share2, PartyPopper, MapPin, Ticket, Clock, Calendar, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const COLORS = {
  forest: "#1B6B3A", forestDark: "#145A2F",
  gold: "#C8963E",
  warmBg: "#FDFBF7", cream: "#F8F5EE", white: "#FFFFFF", heroBg: "#EDF3EF",
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

function FadeIn({ children }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
      {children}
    </div>
  );
}

const GALA_DATE = new Date("2026-11-18T18:00:00-08:00").getTime();
const GALA_SEATS_TOTAL = 400;
const GALA_SEATS_BOOKED = 0;

function EventCountdown({ target }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const items = [["Days", d], ["Hrs", h], ["Min", m], ["Sec", s]];
  return (
    <div className="gala-countdown" style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 8, marginTop: 2 }} aria-label="Countdown to the gala">
      {items.map(([label, val], i) => (
        <div key={label} style={{ display: "contents" }}>
          <div className="countdown-chip" style={{ textAlign: "center", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "7px 11px", minWidth: 46 }}>
            <div className="cd-num" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 19, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{String(val).padStart(2, "0")}</div>
            <div className="cd-label" style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{label}</div>
          </div>
          {i < items.length - 1 && <span className="countdown-colon" style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 16 }}>:</span>}
        </div>
      ))}
    </div>
  );
}

function Section({ children, bg = cc.warmBg, id, padTop = 64, padBottom = 64 }) {
  return (
    <section id={id} style={{ background: bg, padding: `${padTop}px 24px ${padBottom}px`, position: "relative" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}

function SectionHeading({ tag, title, center = false }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 36 }}>
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: cc.gold, marginBottom: 8 }}>{tag}</div>
      <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: cc.text, lineHeight: 1.25 }}>{title}</h2>
    </div>
  );
}

const activityTypes = [
  { icon: <Bike size={22} color={cc.forest} />, title: "Health Camps", desc: "Free cancer, diabetes, and maternal health screenings delivered by the Health Unit on Bike to villages hospitals can't reach." },
  { icon: <GraduationCap size={22} color={cc.forest} />, title: "Saksham Skilling Batches", desc: "4-month intensive community care skilling cohorts, with graduates placed at partner hospitals." },
  { icon: <Wind size={22} color={cc.forest} />, title: "Shudhvayu Deployments", desc: "Vehicle-mounted air purification rollouts across Delhi NCR and partner cities." },
];

export default function EventsPage() {
  return (
    <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", background: cc.warmBg, color: cc.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        @media (max-width: 900px) {
          .grid-3 { grid-template-columns: 1fr !important; }
          .ticket-card { flex-direction: column !important; }
          .ticket-card::before { top: -11px !important; left: 50% !important; transform: translateX(-50%) !important; }
          .ticket-card::after { bottom: -11px !important; top: auto !important; left: 50% !important; transform: translateX(-50%) !important; }
          .ticket-stub-divider { width: 100% !important; height: 0 !important; border-left: none !important; border-top: 2px dashed rgba(255,255,255,0.3) !important; margin: 4px 0 !important; }
          .ticket-stub-divider::before { top: -9px !important; left: 50% !important; transform: translateX(-50%) !important; }
          .ticket-stub-divider::after { bottom: -9px !important; top: auto !important; left: 50% !important; transform: translateX(-50%) !important; }
        }
        @media (max-width: 480px) {
          .addr-line { white-space: normal !important; }
          .gala-countdown { gap: 4px !important; }
          .countdown-chip { padding: 5px 6px !important; min-width: 0 !important; }
          .countdown-chip .cd-num { font-size: 14px !important; }
          .countdown-chip .cd-label { font-size: 6.5px !important; }
          .countdown-colon { font-size: 12px !important; }
        }
        .ticket-card {
          position: relative;
        }
        .ticket-card::before, .ticket-card::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${cc.white};
          transform: translateY(-50%);
          z-index: 1;
        }
        .ticket-card::before { left: -11px; }
        .ticket-card::after { right: -11px; }
        .ticket-stub-divider {
          position: relative;
          align-self: stretch;
          width: 0;
          border-left: 2px dashed rgba(255,255,255,0.3);
          flex-shrink: 0;
        }
        .ticket-stub-divider::before, .ticket-stub-divider::after {
          content: '';
          position: absolute;
          left: 50%;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${cc.white};
          transform: translateX(-50%);
        }
        .ticket-stub-divider::before { top: -9px; }
        .ticket-stub-divider::after { bottom: -9px; top: auto; }
      `}</style>

      <Header />

      <Section id="events" bg={cc.heroBg} padTop={110} padBottom={48}>
        <Breadcrumb items={[{ label: "Events" }]} theme="light" />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cc.gold, flexShrink: 0 }} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: cc.gold }}>Events</span>
        </div>
        <h1 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(30px,4.5vw,44px)", fontWeight: 700, color: cc.text, lineHeight: 1.12, marginBottom: 14 }}>
          Upcoming camps & activities
        </h1>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: cc.textMid, lineHeight: 1.7, maxWidth: 640 }}>
          Health camps, skilling batches, and clean-air deployments run on a rolling basis across the year. Specific dates and locations are announced as they're confirmed — follow our social channels or get in touch to find the next one near you.
        </p>
      </Section>

      <FadeIn>
        <Section bg={cc.white} padTop={40}>
          <div className="ticket-card" style={{ background: `linear-gradient(135deg, ${cc.forestDark} 0%, ${cc.forest} 100%)`, borderRadius: 14, marginBottom: 32, display: "flex", alignItems: "stretch", overflow: "visible" }}>
            <div style={{ padding: "28px", display: "flex", gap: 16, alignItems: "flex-start", flex: "1 1 62%" }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <PartyPopper size={26} color={cc.gold} />
              </div>
              <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: cc.gold, marginBottom: 6 }}>Save the Date · USA</div>
                <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.25 }}>
                  An Evening for Swasthgram
                </h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 18 }}>
                  An evening of connection. A lasting impact on communities. Join us in bringing healthcare closer to those who need it most.
                </p>
                <EventCountdown target={GALA_DATE} />
              </div>
            </div>
            <div className="ticket-stub-divider" />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, padding: "22px 28px", flex: "1 1 38%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Calendar size={15} color={cc.gold} /> November 18, 2026
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={15} color={cc.gold} style={{ flexShrink: 0 }} /> <span className="addr-line" style={{ whiteSpace: "nowrap" }}>India Community Center, Milpitas, California, USA</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={15} color={cc.gold} /> 6:00 PM – 9:00 PM PST
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 6 }}><strong style={{ color: "#fff", fontSize: 15 }}>{GALA_SEATS_BOOKED}</strong> of {GALA_SEATS_TOTAL} seats booked</div>
                <div style={{ height: 5, borderRadius: 20, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 20, background: cc.gold, width: `${(GALA_SEATS_BOOKED / GALA_SEATS_TOTAL) * 100}%` }} />
                </div>
              </div>
              <a href="/events/gala26" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: cc.gold, color: "#1a1a1a", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, padding: "12px 20px", borderRadius: 8, whiteSpace: "nowrap", alignSelf: "flex-start" }}>
                <Ticket size={15} /> Book Now <ArrowRight size={15} />
              </a>
            </div>
          </div>

          <div style={{ background: "#fff", border: `1px solid ${cc.border}`, borderRadius: 13, padding: "4px 22px", marginBottom: 40 }}>
            {activityTypes.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 0", borderBottom: i < activityTypes.length - 1 ? `1px solid ${cc.border}` : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: cc.text }}>{item.title}</div>
                    <span style={{ flexShrink: 0, fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: ".04em", color: cc.gold, background: "#fbf3e6", border: `1px solid #f0ddb8`, borderRadius: 20, padding: "5px 12px", whiteSpace: "nowrap" }}>Announced soon</span>
                  </div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.textMid, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "stretch" }}>
            <div style={{ flex: "1 1 260px", background: cc.cream, borderRadius: 12, padding: "20px 22px", border: `1px solid ${cc.border}`, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Bell size={20} color={cc.forest} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: cc.text, marginBottom: 4 }}>Want to host or attend a camp?</div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.textMid, lineHeight: 1.6 }}>
                  Write to <a href="mailto:support@swasthgram.org" style={{ color: cc.forest, fontWeight: 600 }}>support@swasthgram.org</a> and we'll let you know about the next one in your area.
                </p>
              </div>
            </div>
            <a href="/social" style={{ flex: "1 1 260px", background: cc.cream, borderRadius: 12, padding: "20px 22px", border: `1px solid ${cc.border}`, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Share2 size={20} color={cc.forest} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: cc.text, marginBottom: 4 }}>Follow for real-time updates</div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.textMid, lineHeight: 1.6 }}>
                  New camp dates and locations are posted on our social channels as they're confirmed.
                </p>
              </div>
            </a>
          </div>
        </Section>
      </FadeIn>

      <Footer />
    </div>
  );
}
