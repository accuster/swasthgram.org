import { useEffect, useRef, useState } from "react";
import {
  Megaphone, PhoneCall, Wind, Building2, FlaskConical,
  Globe2, Download, Shield, FileCheck, BadgeCheck,
  Activity, Hospital, Users,
} from "lucide-react";

/* ── Certificate authority images ────────────────────────────────────── */
import irsImg      from "../assets/irs.jpg";
import govIndiaImg from "../assets/govofindia.jpg";

/* ── Certificate PDFs / images for download ──────────────────────────── */
import cert501c3 from "../assets/swasthgram501c3.jpeg";
import cert12A   from "../assets/swasthgram12A.jpg";
import cert80G   from "../assets/swasthgram80G.jpg";

/* ── Brand logo ───────────────────────────────────────────────────────── */
import logoColor from "../assets/SwasthgramWhite.png";

/* ── SwasthManthan — all 34 images ───────────────────────────────────── */
import sm1  from "../assets/swasthmanthan/Swasthmanthan (1).webp";
import sm2  from "../assets/swasthmanthan/Swasthmanthan (2).webp";
import sm3  from "../assets/swasthmanthan/Swasthmanthan (3).webp";
import sm4  from "../assets/swasthmanthan/Swasthmanthan (4).webp";
import sm5  from "../assets/swasthmanthan/Swasthmanthan (5).webp";
import sm6  from "../assets/swasthmanthan/Swasthmanthan (6).webp";
import sm7  from "../assets/swasthmanthan/Swasthmanthan (7).webp";
import sm8  from "../assets/swasthmanthan/Swasthmanthan (8).webp";
import sm9  from "../assets/swasthmanthan/Swasthmanthan (9).webp";
import sm10 from "../assets/swasthmanthan/Swasthmanthan (10).webp";
import sm11 from "../assets/swasthmanthan/Swasthmanthan (11).webp";
import sm12 from "../assets/swasthmanthan/Swasthmanthan (12).webp";
import sm13 from "../assets/swasthmanthan/Swasthmanthan (13).webp";
import sm14 from "../assets/swasthmanthan/Swasthmanthan (14).webp";
import sm15 from "../assets/swasthmanthan/Swasthmanthan (15).webp";
import sm16 from "../assets/swasthmanthan/Swasthmanthan (16).webp";
import sm17 from "../assets/swasthmanthan/Swasthmanthan (17).webp";
import sm18 from "../assets/swasthmanthan/Swasthmanthan (18).webp";
import sm19 from "../assets/swasthmanthan/Swasthmanthan (19).webp";
import sm20 from "../assets/swasthmanthan/Swasthmanthan (20).webp";
import sm21 from "../assets/swasthmanthan/Swasthmanthan (21).webp";
import sm22 from "../assets/swasthmanthan/Swasthmanthan (22).webp";
import sm23 from "../assets/swasthmanthan/Swasthmanthan (23).webp";
import sm24 from "../assets/swasthmanthan/Swasthmanthan (24).jpeg";
import sm25 from "../assets/swasthmanthan/Swasthmanthan (25).jpeg";
import sm26 from "../assets/swasthmanthan/Swasthmanthan (26).jpg";
import sm27 from "../assets/swasthmanthan/Swasthmanthan (27).jpg";
import sm28 from "../assets/swasthmanthan/Swasthmanthan (28).jpg";
import sm29 from "../assets/swasthmanthan/Swasthmanthan (29).jpg";
import sm30 from "../assets/swasthmanthan/Swasthmanthan (30).jpg";
import sm31 from "../assets/swasthmanthan/Swasthmanthan (31).jpeg";
import sm32 from "../assets/swasthmanthan/Swasthmanthan (32).jpeg";
import sm34 from "../assets/swasthmanthan/Swasthmanthan (34).jpeg";

/* ── Saksham — all 9 images ──────────────────────────────────────────── */
import sk1 from "../assets/saksham/saksham (1).jpeg";
import sk2 from "../assets/saksham/saksham (2).jpeg";
import sk3 from "../assets/saksham/saksham (3).jpg";
import sk4 from "../assets/saksham/saksham (4).jpg";
import sk5 from "../assets/saksham/saksham (5).jpg";
import sk6 from "../assets/saksham/saksham (6).jpg";
import sk7 from "../assets/saksham/saksham (7).jpg";
import sk8 from "../assets/saksham/saksham (8).jpg";
import sk9 from "../assets/saksham/saksham (9).jpg";

/* ── Shudhvayu — all 15 images ───────────────────────────────────────── */
import sv1  from "../assets/shudhvayu/shudhvayu (1).png";
import sv2  from "../assets/shudhvayu/shudhvayu (2).jpg";
import sv3  from "../assets/shudhvayu/shudhvayu (3).webp";
import sv4  from "../assets/shudhvayu/shudhvayu (4).jpeg";
import sv5  from "../assets/shudhvayu/shudhvayu (5).jpeg";
import sv6  from "../assets/shudhvayu/shudhvayu (6).jpeg";
import sv7  from "../assets/shudhvayu/shudhvayu (7).jpeg";
import sv8  from "../assets/shudhvayu/shudhvayu (8).jpeg";
import sv9  from "../assets/shudhvayu/shudhvayu (9).jpeg";
import sv10 from "../assets/shudhvayu/shudhvayu (10).jpeg";
import sv11 from "../assets/shudhvayu/shudhvayu (11).jpg";
import sv12 from "../assets/shudhvayu/shudhvayu (12).jpeg";
import sv13 from "../assets/shudhvayu/shudhvayu (13).jpg";
import sv14 from "../assets/shudhvayu/shudhvayu (14).jpg";
import sv15 from "../assets/shudhvayu/shudhvayu (15).jpeg";

/* ── COVID images ────────────────────────────────────────────────────── */
import cv1  from "../assets/covid/covid (1).jpeg";
import cv2  from "../assets/covid/covid (2).jpeg";
import cv3  from "../assets/covid/covid (3).jpeg";
import cv4  from "../assets/covid/covid (4).jpeg";
import cv5  from "../assets/covid/covid (5).jpeg";
import cv6  from "../assets/covid/covid (6).jpeg";
import cv7  from "../assets/covid/covid (7).jpeg";
import cv8  from "../assets/covid/covid (8).jpeg";
import cv9  from "../assets/covid/covid (9).jpeg";
import cv10 from "../assets/covid/covid (10).jpeg";
import cv11 from "../assets/covid/covid (11).jpeg";
import cv12 from "../assets/covid/covid (12).jpeg";
import cv13 from "../assets/covid/covid (13).jpeg";
import cv14 from "../assets/covid/covid (14).jpeg";
import cv15 from "../assets/covid/covid (15).jpeg";
import cv16 from "../assets/covid/covid (16).jpeg";
import cv17 from "../assets/covid/covid (17).jpeg";
import cv18 from "../assets/covid/covid (18).jpeg";
import cv19 from "../assets/covid/covid (19).jpeg";
import cv20 from "../assets/covid/covid (20).jpeg";
import cv21 from "../assets/covid/covid (21).jpeg";
import cv22 from "../assets/covid/covid (22).jpeg";
import cv23 from "../assets/covid/covid (23).jpeg";
import cv24 from "../assets/covid/covid (24).jpeg";

/* ─── Design Tokens ─────────────────────────────────────────────────────── */
const cc = {
  warmBg:    "#FDFBF7",
  green:     "#1B6B3A",
  greenDark: "#14532D",
  greenLight:"#E8F5EE",
  gold:      "#C8971F",
  text:      "#1F2937",
  muted:     "#6B7280",
  border:    "#E8E4DC",
  white:     "#FFFFFF",
};

/* ─── Scroll fade ────────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>{children}</div>
  );
}

function Section({ children, bg = cc.warmBg, id }) {
  return (
    <section id={id} style={{ background: bg, padding: "64px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionHeading({ tag, title, sub, center = false }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 40 }}>
      <div style={{
        fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700,
        letterSpacing: 2, textTransform: "uppercase", color: cc.gold, marginBottom: 8,
      }}>{tag}</div>
      <h2 style={{
        fontFamily: "'Libre Baskerville',Georgia,serif",
        fontSize: "clamp(22px,3vw,30px)", fontWeight: 700,
        color: cc.text, lineHeight: 1.3, marginBottom: sub ? 10 : 0,
      }}>{title}</h2>
      {sub && <p style={{
        fontFamily: "'Inter',sans-serif", fontSize: 14, color: cc.muted,
        maxWidth: 620, margin: center ? "0 auto" : 0, lineHeight: 1.65,
      }}>{sub}</p>}
    </div>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <div style={{
      background: `linear-gradient(135deg,${cc.greenDark} 0%,${cc.green} 60%,#2D8653 100%)`,
      padding: "100px 24px 72px", textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>
      {[260, 420, 580].map((s, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: s, height: s, borderRadius: "50%",
          border: `1px solid rgba(255,255,255,${0.06 - i * 0.015})`,
          transform: "translate(-50%,-50%)", pointerEvents: "none",
        }} />
      ))}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <img src={logoColor} alt="Swasthgram" style={{ height: 68, width: "auto", objectFit: "contain" }} />
        </div>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)", borderRadius: 32, padding: "6px 18px",
          fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600,
          letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: 20,
        }}>Transparency &amp; Trust</div>
        <h1 style={{
          fontFamily: "'Libre Baskerville',Georgia,serif",
          fontSize: "clamp(28px,5vw,50px)", fontWeight: 700,
          color: "#fff", lineHeight: 1.15, marginBottom: 16,
        }}>Your Donation.<br />Fully Accounted For.</h1>
        <p style={{
          fontFamily: "'Inter',sans-serif", fontSize: 15,
          color: "rgba(255,255,255,0.78)", maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.7,
        }}>
          We are a certified nonprofit—501(c)(3) in the US (EIN: 99‑2520994) and 80G &amp; 12A approved in India.
          Explore our certifications and discover the scale of impact we create every day.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Impact",         href: "#impact" },
            { label: "About Us",       href: "#about" },
            { label: "Certificates",   href: "#certificates" },
            { label: "Our Programmes", href: "#gallery" },
            { label: "COVID Response", href: "#covid" },
          ].map(({ label, href }) => (
            <a key={href} href={href} style={{
              display: "inline-block", background: "rgba(255,255,255,0.13)",
              border: "1px solid rgba(255,255,255,0.28)", borderRadius: 24, padding: "8px 18px",
              fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500,
              color: "#fff", textDecoration: "none", transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
            >{label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── STATS STRIP ────────────────────────────────────────────────────────── */
const STATS = [
  { num: "67,660+",   label: "Medical Camps",              Icon: Hospital,     color: "#1B6B3A", bg: "#E8F5EE" },
  { num: "57 Lakh+",  label: "Beneficiaries",              Icon: Users,        color: "#B45309", bg: "#FEF3C7" },
  { num: "6,000",     label: "Cancer Screenings",           Icon: FlaskConical, color: "#1D4ED8", bg: "#EFF6FF" },
  { num: "9,000+",    label: "High-Risk Pregnancies Saved", Icon: Activity,     color: "#7C3AED", bg: "#F5F3FF" },
  { num: "5,050+",    label: "Livelihoods Generated",       Icon: BadgeCheck,   color: "#0F766E", bg: "#CCFBF1" },
  { num: "2M+",       label: "COVID-19 Lives Reached",      Icon: Globe2,       color: "#BE123C", bg: "#FFF1F2" },
];

function StatsStrip() {
  return (
    <div id="impact" style={{ background: "#F3F4F6", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", color: cc.gold, marginBottom: 6,
          }}>Our Impact in Numbers</div>
          <h2 style={{
            fontFamily: "'Libre Baskerville',Georgia,serif",
            fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, color: cc.text,
          }}>Two Decades of Community Service</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 16 }}>
          {STATS.map(({ num, label, Icon, color, bg }) => (
            <div key={label} style={{
              background: cc.white, borderRadius: 16, border: `1px solid ${cc.border}`,
              padding: "22px 18px", textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Icon size={20} color={color} strokeWidth={1.8} />
              </div>
              <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color, lineHeight: 1, marginBottom: 6 }}>{num}</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: cc.muted, textTransform: "uppercase", letterSpacing: 0.6, lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────────────────── */
function AboutSection() {
  return (
    <Section id="about" bg={cc.warmBg}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40, alignItems: "start" }}>
        <FadeIn>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: cc.gold, marginBottom: 10 }}>Who We Are</div>
            <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, color: cc.text, lineHeight: 1.3, marginBottom: 16 }}>Community Wellness for All — Since 2011</h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: cc.muted, lineHeight: 1.8, marginBottom: 14 }}>
              Swasthgram Global Foundation is a non-profit public charitable trust (Reg. No. 859/2011, Delhi)
              dedicated to making quality preventive community care accessible at the doorstep of every Indian.
              Headquartered in Delhi with offices across Bangalore, Nagpur, Patna, Chennai, Ghaziabad, and Gurgaon.
            </p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: cc.muted, lineHeight: 1.8, marginBottom: 14 }}>
              Our flagship <strong style={{ color: cc.text }}>LaBike</strong> — a motorcycle-mounted mobile lab —
              performs 76 blood screening in the most remote villages. Through <strong style={{ color: cc.text }}>SwasthManthan</strong>,{" "}
              <strong style={{ color: cc.text }}>Saksham</strong>, and <strong style={{ color: cc.text }}>Shudhvayu</strong>,
              we have conducted 67,660+ camps, saved 9,000+ high-risk pregnancies, and created 5,050+ livelihoods.
            </p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: cc.muted, lineHeight: 1.8 }}>
              Registered as a <strong style={{ color: cc.text }}>501(c)(3)</strong> in the United States (EIN: 99-2520994)
              and holding 80G, 12A &amp; FCRA clearances in India — every donation reaches communities directly.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.12}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { Icon: Shield,     color: "#1B6B3A", bg: cc.greenLight, label: "Vision",     text: "Health for All — making every Indian aware of their wellbeing and empowering them to protect it." },
              { Icon: Activity,   color: "#B45309", bg: "#FEF3C7",     label: "Mission",     text: "Community care at the doorstep of every Indian, ensuring nonstop community wellness for all." },
              { Icon: BadgeCheck, color: "#1D4ED8", bg: "#EFF6FF",     label: "Commitment",  text: "Affordable on-site camps, Health awareness, livelihood generation for marginalised youth, and community empowerment." },
            ].map(({ Icon, color, bg, label, text }) => (
              <div key={label} style={{ background: bg, borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${color}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: cc.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <Icon size={16} color={color} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{label}</div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.text, lineHeight: 1.6, margin: 0 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ─── CERTIFICATES ───────────────────────────────────────────────────────── */
const CERTIFICATES = [
  {
    id: "501c3", badge: "501(c)(3)", authorityImg: irsImg, authorityAlt: "IRS — Internal Revenue Service",
    certImg: cert501c3, certFile: cert501c3, certFilename: "Swasthgram_501c3_IRS.jpeg",
    title: "Tax-Exempt Organisation", subtitle: "Internal Revenue Service · USA",
    rows: [
      { k: "EIN",       v: "99-2520994" },
      { k: "Effective", v: "April 15, 2024" },
      { k: "Status",    v: "Public Charity — IRC § 170(b)(1)(A)(vi)" },
      { k: "DLN",       v: "26053441005785" },
      { k: "Address",   v: "188 Parsonage Rd, Edison, NJ 08837" },
      { k: "Signed by", v: "Stephen A. Martin, Director" },
    ],
    note: "Directly registered 501(c)(3). US donations fully tax-deductible. No fiscal sponsor required.",
    Icon: FileCheck,
  },
  {
    id: "12a", badge: "12A", authorityImg: govIndiaImg, authorityAlt: "Govt. of India",
    certImg: cert12A, certFile: cert12A, certFilename: "Swasthgram_12A.jpg",
    title: "Income Tax Exemption", subtitle: "Director of Income Tax (Exemptions), Delhi",
    rows: [
      { k: "Order No.",    v: "DEL-SR22193-06062012" },
      { k: "PAN",          v: "AAKTS1981N" },
      { k: "GIR No.",      v: "S-6862" },
      { k: "Dated",        v: "06 June 2012" },
      { k: "Valid From",   v: "A.Y. 2012-13 (permanent)" },
      { k: "Legal Status", v: "Trust — Reg. No. 859/2011" },
    ],
    note: "Full income-tax exemption on grants and income. 100% of funds go directly to programmes.",
    Icon: Shield,
  },
  {
    id: "80g", badge: "80G", authorityImg: govIndiaImg, authorityAlt: "Govt. of India",
    certImg: cert80G, certFile: cert80G, certFilename: "Swasthgram_80G.jpg",
    title: "Donor Tax Deduction", subtitle: "Director of Income Tax (Exemptions), Delhi",
    rows: [
      { k: "Order No.",  v: "DEL-SE23992-06062012" },
      { k: "PAN",        v: "AAKTS1981N" },
      { k: "GIR No.",    v: "S-6862" },
      { k: "Dated",      v: "06 June 2012" },
      { k: "Valid From", v: "A.Y. 2012-13 till rescinded" },
      { k: "Section",    v: "80G(5)(vi) — Income Tax Act 1961" },
    ],
    note: "Indian donors claim 50% deduction under Section 80G. Official receipt emailed instantly after payment.",
    Icon: BadgeCheck,
  },
];

function CertificateCard({ cert, index }) {
  const [hovered, setHovered] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <FadeIn delay={index * 0.1}>
      {previewOpen && (
        <div onClick={() => setPreviewOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 }}>
          <img src={cert.certImg} alt={cert.title} onClick={e => e.stopPropagation()} style={{ maxHeight: "88vh", maxWidth: "88vw", borderRadius: 10, objectFit: "contain", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
          <button onClick={() => setPreviewOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 18, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>✕</button>
          <a href={cert.certFile} download={cert.certFilename} onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 28, display: "inline-flex", alignItems: "center", gap: 8, background: cc.green, color: "#fff", borderRadius: 8, padding: "10px 20px", fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            <Download size={14} /> Download Certificate
          </a>
        </div>
      )}
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: cc.white, border: `1px solid ${hovered ? "#94A3B8" : cc.border}`, borderRadius: 14, overflow: "hidden", transition: "box-shadow 0.25s, border-color 0.25s", boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${cc.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC" }}>
          <img src={cert.authorityImg} alt={cert.authorityAlt} style={{ height: 32, objectFit: "contain", maxWidth: 120 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#1F2937", color: "#fff", borderRadius: 6, padding: "4px 10px", fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>
            <cert.Icon size={12} strokeWidth={2} />{cert.badge}
          </div>
        </div>
        <div onClick={() => setPreviewOpen(true)} style={{ position: "relative", height: 140, overflow: "hidden", cursor: "pointer", flexShrink: 0 }}>
          <img src={cert.certImg} alt={`${cert.badge} Certificate`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.3s", transform: hovered ? "scale(1.03)" : "scale(1)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)", display: "flex", alignItems: "flex-end", padding: "10px 14px" }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: 4 }}>
              <FileCheck size={12} /> Click to view full certificate
            </span>
          </div>
        </div>
        <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 15, fontWeight: 700, color: cc.text, marginBottom: 2, lineHeight: 1.3 }}>{cert.title}</h3>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: cc.muted, fontWeight: 500, marginBottom: 14 }}>{cert.subtitle}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginBottom: 14 }}>
            {cert.rows.map(({ k, v }) => (
              <div key={k} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: 700, color: cc.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: cc.text, lineHeight: 1.4, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 12px", background: "#F8FAFC", border: `1px solid ${cc.border}`, borderRadius: 8, fontFamily: "'Inter',sans-serif", fontSize: 12, color: cc.muted, lineHeight: 1.6, marginBottom: 14, flex: 1 }}>{cert.note}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPreviewOpen(true)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1.5px solid ${cc.border}`, borderRadius: 8, padding: "8px 12px", fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: cc.text, background: "transparent", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.borderColor = "#94A3B8"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = cc.border; }}>
              <FileCheck size={13} strokeWidth={1.8} /> View
            </button>
            <a href={cert.certFile} download={cert.certFilename} style={{ flex: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, background: cc.green, color: "#fff", borderRadius: 8, padding: "8px 12px", fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = cc.greenDark}
              onMouseLeave={e => e.currentTarget.style.background = cc.green}>
              <Download size={13} strokeWidth={1.8} /> Download
            </a>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function CertificatesSection() {
  return (
    <Section id="certificates" bg="#F3F4F6">
      <FadeIn>
        <SectionHeading tag="Legal Registrations" title="Our Certificates & Registrations" sub="Registered in both India and the United States with full legal compliance under the laws of both countries." />
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22, alignItems: "stretch" }}>
        {CERTIFICATES.map((c, i) => <CertificateCard key={c.id} cert={c} index={i} />)}
      </div>
      <FadeIn delay={0.3}>
        <div style={{ marginTop: 32, borderRadius: 12, overflow: "hidden", border: `1px solid ${cc.border}`, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          <div style={{ padding: "18px 22px", background: cc.greenLight, borderRight: `1px solid ${cc.border}` }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: cc.green, marginBottom: 5 }}>🇮🇳 For Indian Donors</div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.text, lineHeight: 1.7, margin: 0 }}>Claim <strong>50% tax deduction</strong> under Section 80G. Receipt emailed after payment. Queries: <strong>support@swasthgram.org</strong></p>
          </div>
          <div style={{ padding: "18px 22px", background: "#EFF6FF" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: "#1D4ED8", marginBottom: 5 }}>🇺🇸 For US Donors</div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.text, lineHeight: 1.7, margin: 0 }}>Directly registered <strong>501(c)(3)</strong> (EIN: 99-2520994), effective April 15, 2024. Fully tax-deductible. No fiscal sponsor needed.</p>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ── Programme image banks ───────────────────────────────────────────── */
const SM_IMGS = [sm1,sm2,sm3,sm4,sm5,sm6,sm7,sm8,sm9,sm10,sm11,sm12,sm13,sm14,sm15,sm16,sm17,sm18,sm19,sm20,sm21,sm22,sm23,sm24,sm25,sm26,sm27,sm28,sm29,sm30,sm31,sm32,sm34];
const SK_IMGS = [sk1,sk2,sk3,sk4,sk5,sk6,sk7,sk8,sk9];
const SV_IMGS = [sv1,sv2,sv3,sv4,sv5,sv6,sv7,sv8,sv9,sv10,sv11,sv12,sv13,sv14,sv15];

const PROG_TABS = [
  { id:"swasthmanthan", label:"SwasthManthan", color:"#1B6B3A", imgs: SM_IMGS, desc:"Preventive community care & Health check-ups via mobile health unit on bike across rural India.", link:"/programs/swasthmanthan" },
  { id:"saksham",       label:"Saksham",       color:"#B45309", imgs: SK_IMGS, desc:"Livelihood generation — training Community Health Workers from marginalised communities.", link:"/programs/saksham" },
  { id:"shudhvayu",     label:"Shudhvayu",     color:"#1D4ED8", imgs: SV_IMGS, desc:"Air quality monitoring, pollution control, and environmental health advocacy.", link:"/programs/shudhvayu" },
];

const W_PAT = [185,240,185,210,185,250,185,220,185,240,185,215];

function padImgs(imgs) {
  if (imgs.length >= 20) return imgs;
  const repeated = [];
  while (repeated.length < 24) repeated.push(...imgs);
  return repeated.slice(0, 24);
}

function ProgrammeGallery() {
  const [active, setActive] = useState("swasthmanthan");
  const tab = PROG_TABS.find(t => t.id === active);
  const padded = padImgs(tab.imgs);
  const half   = Math.ceil(padded.length / 2);
  const row1   = padded.slice(0, half);
  const row2   = padded.slice(half);
  const speed1 = Math.max(18, row1.length * 1.8);
  const speed2 = Math.max(22, row2.length * 2.1);

  return (
    <div id="gallery" style={{ background: "#F3F4F6" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px 32px" }}>
        <FadeIn><SectionHeading tag="Our Programmes" title="Three Pillars of Community Health" sub="Click a programme below to browse its full photo gallery." /></FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
            {PROG_TABS.map(t => {
              const isActive = t.id === active;
              return (
                <button key={t.id} onClick={() => setActive(t.id)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 999, border: `2px solid ${isActive ? t.color : cc.border}`, background: isActive ? t.color : cc.white, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: isActive ? "#fff" : cc.muted, cursor: "pointer", transition: "all 0.25s", boxShadow: isActive ? `0 4px 14px ${t.color}33` : "none" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? "rgba(255,255,255,0.75)" : t.color, flexShrink: 0 }} />{t.label}
                </button>
              );
            })}
            <a href={tab.link} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 999, border: `2px solid ${tab.color}`, background: "transparent", fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: tab.color, textDecoration: "none", transition: "all 0.25s", marginLeft: "auto" }}
              onMouseEnter={e => { e.currentTarget.style.background = tab.color; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = tab.color; }}>
              Visit {tab.label} page →
            </a>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: cc.muted, lineHeight: 1.7, marginBottom: 32, maxWidth: 620 }}>{tab.desc}</p>
        </FadeIn>
      </div>
      <style>{`
        @keyframes pg-fwd { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pg-rev { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
        .pg-row1 { display:flex; gap:10px; width:max-content; }
        .pg-row2 { display:flex; gap:10px; width:max-content; margin-top:10px; }
        .pg-row1:hover,.pg-row2:hover { animation-play-state:paused; }
        .pg-cell { flex-shrink:0; border-radius:10px; overflow:hidden; cursor:pointer; }
        .pg-cell img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.35s; }
        .pg-cell:hover img { transform:scale(1.06); }
      `}</style>
      <div style={{ position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(to right,#F3F4F6,transparent)", zIndex:2, pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(to left,#F3F4F6,transparent)", zIndex:2, pointerEvents:"none" }} />
        <div className="pg-row1" key={`r1-${active}`} style={{ animation: `pg-fwd ${speed1}s linear infinite` }}>
          {[...Array(2)].map((_,r) => row1.map((src, i) => (
            <div key={`pg-r1-${r}-${i}`} className="pg-cell" style={{ width: W_PAT[i % W_PAT.length], height: 210 }}>
              <img src={src} alt={`${tab.label} ${i+1}`} />
            </div>
          )))}
        </div>
      </div>
      <div style={{ position:"relative", overflow:"hidden", paddingBottom: 56 }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(to right,#F3F4F6,transparent)", zIndex:2, pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(to left,#F3F4F6,transparent)", zIndex:2, pointerEvents:"none" }} />
        <div className="pg-row2" key={`r2-${active}`} style={{ animation: `pg-rev ${speed2}s linear infinite` }}>
          {[...Array(2)].map((_,r) => row2.map((src, i) => (
            <div key={`pg-r2-${r}-${i}`} className="pg-cell" style={{ width: W_PAT[(i + 4) % W_PAT.length], height: 210 }}>
              <img src={src} alt={`${tab.label} ${i + row1.length + 1}`} />
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}

function GallerySection() { return <ProgrammeGallery />; }

/* ─── COVID SECTION ──────────────────────────────────────────────────────── */
const COVID_IMGS = [cv1,cv2,cv3,cv4,cv5,cv6,cv7,cv8,cv9,cv10,cv11,cv12,cv13,cv14,cv15,cv16,cv17,cv18,cv19,cv20,cv21,cv22,cv23,cv24];

const COVID_TIMELINE = [
  { date: "Mar 2020",     Icon: Megaphone,    title: "COMBAT COVID-19 Campaign Launched",      text: "Activated on 20 March 2020. Awareness drives across NCR from day one. Toll-Free Helpline 18002700408 set up, supported by Ernst & Young's CSR network." },
  { date: "Apr 2020",     Icon: PhoneCall,    title: "Real-Time Bed & Resource Tracking",      text: "Verified bed status, plasma, ventilators, and pharmacy leads delivered to callers within 30 minutes. Over 600 families received critical resource information." },
  { date: "Apr–May 2021", Icon: Wind,         title: "SOS Oxygen Drive — 2nd Wave",            text: "Doorstep oxygen cylinder delivery across Delhi NCR during acute scarcity. Cylinders sourced from Baddi with daily runs. 80+ people relieved in the first 15 days." },
  { date: "May 2021",     Icon: Building2,    title: "COVID Care Centre — Ghitorni, Delhi",    text: "25-bed care centre at MCD School, Ghitorni — allocated by SDMC. Doctor tele-consultation with continuous oxygen supply for mild-to-moderate cases." },
  { date: "Jun 2021",     Icon: FlaskConical, title: "Doorstep screening — RTPCR & D-Dimer",  text: "Doorstep screening with CDSCO‑ and ICMR‑approved equipment—keeping patients safe and protect them from viral infections." },
  { date: "2020–2022",    Icon: Globe2,       title: "2 Million Lives Reached",                text: "SwasthRakshaks and SwasthSamarthaks reached over 2 million people across India through awareness, oxygen, screening, and care." },
];

function CovidSection() {
  const [lightbox, setLightbox] = useState(null);
  return (
    <div id="covid" style={{ background: "#F3F4F6" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px 0" }}>
        <FadeIn><SectionHeading tag="COVID-19 Response" title="Standing With India Through the Pandemic" sub="From awareness on Day 1 to oxygen cylinders at doorsteps, home covid screenings, and a 25-bed care centre." /></FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 44 }}>
            {[
              { n: "1,25,000+", l: "COVID-19 Screened" },
              { n: "5,620L",    l: "Oxygen Distributed (174×5L + 95×50L)" },
              { n: "25 Beds",   l: "Isolation Centre, South Delhi" },
              { n: "10,000+",   l: "Anaemia Screening — Anaemia Mukt Haryana" },
              { n: "2M+",       l: "Total Lives Reached" },
            ].map(({ n, l }) => (
              <div key={l} style={{ background: cc.white, border: `1px solid ${cc.border}`, borderRadius: 10, padding: "9px 16px", display: "flex", flexDirection: "column", gap: 1 }}>
                <span style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 15, fontWeight: 700, color: cc.green }}>{n}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: cc.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</span>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div style={{ position: "relative", marginBottom: 56 }}>
            <div style={{ position: "absolute", top: 36, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent 0%,${cc.border} 5%,${cc.border} 95%,transparent 100%)`, zIndex: 0 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
              {COVID_TIMELINE.map(({ date, Icon, title, text }, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, minWidth: 155 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: cc.white, border: `2px solid ${cc.green}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 14, boxShadow: "0 2px 12px rgba(27,107,58,0.15)" }}>
                    <Icon size={20} color={cc.green} strokeWidth={1.8} />
                  </div>
                  <div style={{ background: cc.white, border: `1px solid ${cc.border}`, borderRadius: 12, padding: "13px 13px", width: "100%", flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s, border-color 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(27,107,58,0.12)"; e.currentTarget.style.borderColor = cc.green + "66"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = cc.border; }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: 700, color: cc.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{date}</div>
                    <h4 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 12, fontWeight: 700, color: cc.text, marginBottom: 5, lineHeight: 1.4 }}>{title}</h4>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: cc.muted, lineHeight: 1.6, margin: 0 }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
        <FadeIn>
          <div style={{ textAlign: "center", paddingBottom: 28 }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: cc.gold, marginBottom: 6 }}>On the Ground</div>
            <h3 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: cc.text, marginBottom: 6 }}>COVID Response in Photos</h3>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: cc.muted }}>Real moments from our frontline SwasthRakshaks across Delhi NCR.</p>
          </div>
        </FadeIn>
      </div>
      <style>{`
        @keyframes cv-fwd { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes cv-rev { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .cv-row1 { display:flex; gap:10px; width:max-content; animation:cv-fwd 38s linear infinite; }
        .cv-row2 { display:flex; gap:10px; width:max-content; animation:cv-rev 44s linear infinite; margin-top:10px; }
        .cv-row1:hover,.cv-row2:hover { animation-play-state:paused; }
        .cv-cell { flex-shrink:0; border-radius:10px; overflow:hidden; cursor:pointer; }
        .cv-cell img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.35s; }
        .cv-cell:hover img { transform:scale(1.06); }
      `}</style>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(to right,#F3F4F6,transparent)", zIndex:2, pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(to left,#F3F4F6,transparent)", zIndex:2, pointerEvents:"none" }} />
        <div className="cv-row1">
          {[...Array(2)].map((_,r) =>
            [{src:cv1,w:155},{src:cv2,w:215},{src:cv3,w:155},{src:cv4,w:175},{src:cv5,w:155},{src:cv6,w:205},{src:cv7,w:175},{src:cv8,w:155},{src:cv9,w:185},{src:cv10,w:155},{src:cv11,w:175},{src:cv12,w:215}]
            .map((img,i) => (
              <div key={`cv-r1-${r}-${i}`} className="cv-cell" style={{ width:img.w, height:215 }} onClick={() => setLightbox(COVID_IMGS.indexOf(img.src))}>
                <img src={img.src} alt={`COVID ${i+1}`} />
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ position: "relative", overflow: "hidden", paddingBottom: 56 }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(to right,#F3F4F6,transparent)", zIndex:2, pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(to left,#F3F4F6,transparent)", zIndex:2, pointerEvents:"none" }} />
        <div className="cv-row2">
          {[...Array(2)].map((_,r) =>
            [{src:cv13,w:205},{src:cv14,w:155},{src:cv15,w:175},{src:cv16,w:215},{src:cv17,w:155},{src:cv18,w:185},{src:cv19,w:175},{src:cv20,w:155},{src:cv21,w:205},{src:cv22,w:155},{src:cv23,w:175},{src:cv24,w:215}]
            .map((img,i) => (
              <div key={`cv-r2-${r}-${i}`} className="cv-cell" style={{ width:img.w, height:215 }} onClick={() => setLightbox(COVID_IMGS.indexOf(img.src))}>
                <img src={img.src} alt={`COVID ${i+13}`} />
              </div>
            ))
          )}
        </div>
      </div>
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:24 }}>
          <button onClick={e => { e.stopPropagation(); setLightbox(l => (l-1+COVID_IMGS.length)%COVID_IMGS.length); }} style={{ position:"absolute", left:20, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", fontSize:24, padding:"10px 14px", borderRadius:8, cursor:"pointer" }}>&#8249;</button>
          <img src={COVID_IMGS[lightbox]} alt="" onClick={e => e.stopPropagation()} style={{ maxHeight:"88vh", maxWidth:"88vw", borderRadius:10, objectFit:"contain" }} />
          <button onClick={e => { e.stopPropagation(); setLightbox(l => (l+1)%COVID_IMGS.length); }} style={{ position:"absolute", right:20, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", fontSize:24, padding:"10px 14px", borderRadius:8, cursor:"pointer" }}>&#8250;</button>
          <button onClick={() => setLightbox(null)} style={{ position:"absolute", top:20, right:20, background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", fontSize:18, padding:"6px 12px", borderRadius:8, cursor:"pointer" }}>&#10005;</button>
          <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)", fontFamily:"'Inter',sans-serif", fontSize:12, color:"rgba(255,255,255,.6)" }}>{lightbox+1} / {COVID_IMGS.length}</div>
        </div>
      )}
    </div>
  );
}

function CTA() {
  return (
    <div style={{ background: `linear-gradient(135deg,${cc.greenDark},${cc.green})`, padding: "60px 24px", textAlign: "center" }}>
      <FadeIn>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>Join the Mission</div>
        <h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>67,660 Camps. 57 Lakh+ Lives. Still Going.</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.74)", maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.7 }}>Registered in India and the United States. Every rupee and every dollar goes directly to community care.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://swasthgram.org/donate" style={{ display: "inline-block", background: cc.gold, color: "#fff", borderRadius: 8, padding: "12px 26px", fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Donate Now</a>
          <a href="/about" style={{ display: "inline-block", background: "transparent", border: "1.5px solid rgba(255,255,255,0.45)", color: "#fff", borderRadius: 8, padding: "12px 26px", fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Learn About Us</a>
        </div>
      </FadeIn>
    </div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────────────────── */
export default function Credentials() {
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: cc.warmBg }}>
      <Hero />
      <StatsStrip />
      <AboutSection />
      <CertificatesSection />
      <GallerySection />
      <CovidSection />
      <CTA />
    </div>
  );
}