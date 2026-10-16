import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Bike, GraduationCap, Wind, Bell, Share2, PartyPopper, MapPin, Ticket, Clock, Calendar } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const COLORS = {
  forest: "#1B6B3A", forestDark: "#145A2F",
  gold: "#C8963E",
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

function FadeIn({ children }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
      {children}
    </div>
  );
}

function Section({ children, bg = cc.warmBg, id, padTop = 64 }) {
  return (
    <section id={id} style={{ background: bg, padding: `${padTop}px 24px 64px`, position: "relative" }}>
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
          .ticket-stub-divider { width: 100% !important; height: 0 !important; border-left: none !important; border-top: 2px dashed rgba(255,255,255,0.3) !important; margin: 4px 0 !important; }
          .ticket-stub-divider::before { top: -9px !important; left: 50% !important; transform: translateX(-50%) !important; }
          .ticket-stub-divider::after { bottom: -9px !important; top: auto !important; left: 50% !important; transform: translateX(-50%) !important; }
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

      <FadeIn>
        <Section id="events" bg={cc.white} padTop={110}>
          <Breadcrumb items={[{ label: "Events" }]} theme="light" />
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: cc.gold, marginBottom: 8 }}>Events</div>
            <h1 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 700, color: cc.text, lineHeight: 1.2, marginBottom: 8 }}>
              Upcoming camps & activities
            </h1>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: cc.textMid, lineHeight: 1.7 }}>
              Health camps, skilling batches, and clean-air deployments run on a rolling basis across the year. Specific dates and locations are announced as they're confirmed — follow our social channels or get in touch to find the next one near you.
            </p>
          </div>

          <div className="ticket-card" style={{ background: `linear-gradient(135deg, ${cc.forestDark} 0%, ${cc.forest} 100%)`, borderRadius: 14, marginBottom: 32, display: "flex", alignItems: "stretch", overflow: "visible" }}>
            <div style={{ padding: "28px", display: "flex", gap: 16, alignItems: "flex-start", flex: "1 1 70%" }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <PartyPopper size={26} color={cc.gold} />
              </div>
              <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: cc.gold, marginBottom: 6 }}>Save the Date · USA</div>
                <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.25 }}>
                  Swasthgram Fundraising Gala
                </h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                  Celebrating our first year in the United States. Registration details coming soon.
                </p>
              </div>
            </div>
            <div className="ticket-stub-divider" />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, padding: "24px 28px", flex: "1 1 30%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Calendar size={15} color={cc.gold} /> November 12, 2026
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={15} color={cc.gold} /> India Community Center, Milpitas, CA
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={15} color={cc.gold} /> 3:00 PM – 10:00 PM
                </div>
              </div>
              <a href="/events/gala26" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: cc.gold, color: "#1a1a1a", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, padding: "12px 20px", borderRadius: 0, whiteSpace: "nowrap", alignSelf: "flex-start" }}>
                <Ticket size={15} /> Get Ticket
              </a>
            </div>
          </div>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 40 }}>
            {activityTypes.map((item, i) => (
              <div key={i} style={{ background: cc.cream, borderRadius: 12, padding: "20px 20px", border: `1px solid ${cc.border}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{item.icon}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: cc.text, marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.textMid, lineHeight: 1.6 }}>{item.desc}</p>
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
