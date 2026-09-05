import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  CheckCircle, Heart, Share2, Loader, AlertCircle,
  Copy, ArrowRight, ExternalLink, MessageCircle,
  Stethoscope, Wind, GraduationCap, Globe,
  Smartphone, Landmark, Building2
} from "lucide-react";
import { useState, useEffect } from "react";
import appStoreImg  from "../assets/app_store.png";
import playStoreImg from "../assets/play_store.png";

const COLORS = {
  forest: "#1B6B3A", forestDark: "#145A2F", forestDeep: "#0E4422",
  leaf: "#2E8B4F", gold: "#C8963E", goldSoft: "#D4A854", goldLight: "#E8C76A",
  warmBg: "#FDFBF7", cream: "#F8F5EE", white: "#FFFFFF",
  text: "#1F2937", textMid: "#4B5563", textLight: "#6B7280", border: "#E8E4DC",
};

const PROGRAM_IMPACT = {
  SwasthManthan: {
    color:   "#1B6B3A",
    icon:    <Stethoscope size={20} color="#fff" />,
    title:   "Your donation is already at work in the field.",
    message: "A Lab-on-Bike is heading to a village because of you — carrying cancer screenings, diabetes tests, and diagnostics to families who have walked miles just to be seen. Your contribution funds a health worker's next visit, a child's first diagnostic test, a family's first real step toward care. In some of India's most remote corners, you just became someone's turning point.",
    quote:   "Early detection saves lives. You just made that possible for someone who had no other option.",
  },
  Saksham: {
    color:   "#2E8B4F",
    icon:    <GraduationCap size={20} color="#fff" />,
    title:   "You just opened a door that wasn't open before.",
    message: "Your donation supports a young person who is determined to build a better life — for themselves, their family, and their community. Through focused, practical training, they gain skills that are real, recognised, and in demand. You didn't just donate to a programme — you invested in a person, and through them, in countless others they will go on to serve.",
    quote:   "Skills are the most lasting gift you can give. Thank you for believing in someone's potential.",
  },
  Shudhvayu: {
    color:   "#0369A1",
    icon:    <Wind size={20} color="#fff" />,
    title:   "Cleaner air for every person on that road.",
    message: "Your donation supports a solution that works quietly in the background — no electricity, no maintenance, just cleaner air for every person on the street. In cities where pollution is invisible but its damage is not, your contribution helps protect lungs, reduce harm, and make the simple act of breathing a little safer for everyone — children, commuters, and communities alike.",
    quote:   "The right to clean air belongs to everyone. Thank you for helping protect it.",
  },
  General: {
    color:   "#C8963E",
    icon:    <Globe size={20} color="#fff" />,
    title:   "Your donation goes where it matters most.",
    message: "The Swasthgram team will deploy your contribution across health camps, youth skills training, and clean air initiatives — wherever the need is greatest. A health worker's village visit, a young person's career, cleaner air for a city street. Your generosity doesn't pick just one life to change — it becomes part of a larger mission that touches thousands.",
    quote:   "We are not a charity. We empower people for sustainable development.",
  },
};

const cc = COLORS;

export default function ThankYouPage() {
  const [status, setStatus]     = useState("loading"); // loading | valid | invalid
  const [donation, setDonation] = useState(null);
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    if (!token) { setStatus("invalid"); return; }

    fetch(`/api/validate-token?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid && data.donation) {
          setDonation(data.donation);
          setStatus("valid");
          document.title = `Thank You, ${data.donation.name} — Swasthgram`;

          // ── Conversion Tracking ──────────────────────────────────────
          if (window.gtag) {
            window.gtag("event", "donation", {
              currency:       data.donation.currency,
              value:          data.donation.amount,
              transaction_id: data.donation.donationId,
              items: [{ item_id: data.donation.program, item_name: data.donation.program, quantity: 1, price: data.donation.amount }],
            });
          }
          if (window.fbq) {
            window.fbq("track", "Donate", { value: data.donation.amount, currency: data.donation.currency });
          }
          // Google Ads — fill in your conversion ID when ready:
          window.gtag("event","conversion",{ send_to:"AW-17942072050/OJgBCPnctoYcEPKVuetC", value: data.donation.amount, currency: data.donation.currency });
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === "loading") return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background: cc.warmBg }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign:"center" }}>
        <Loader size={40} color={cc.gold} style={{ animation:"spin 1s linear infinite", marginBottom:16 }} />
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:14, color: cc.textLight }}>Verifying your donation…</p>
      </div>
    </div>
  );

  // ── Invalid ────────────────────────────────────────────────────────────────
  if (status === "invalid") return (
    <div style={{ minHeight:"100vh", background: cc.warmBg }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'); *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }`}</style>
      {/* Dark top band so transparent header text is visible */}
      <div style={{ background:`linear-gradient(160deg, ${cc.forestDeep} 0%, ${cc.forest} 100%)`, height:80, position:"fixed", top:0, left:0, right:0, zIndex:1 }} />
      <Header />
      <div style={{ maxWidth:480, margin:"0 auto", padding:"160px 24px 80px", textAlign:"center", position:"relative", zIndex:2 }}>
        <AlertCircle size={56} color="#f87171" style={{ marginBottom:20 }} />
        <h2 style={{ fontFamily:"Inter,sans-serif", fontSize:22, fontWeight:700, marginBottom:10, color: cc.text }}>
          This page isn't available
        </h2>
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:14, color: cc.textMid, lineHeight:1.7, marginBottom:28 }}>
          This thank-you page is only accessible right after completing a donation.
          If you've just donated, please check your email for the receipt.
        </p>
        <a href="/#donate"
          style={{ fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:14, background: cc.forest, color:"#fff", padding:"13px 28px", borderRadius:8, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
          <Heart size={15} color="#fff" /> Donate Now
        </a>
      </div>
      <Footer />
    </div>
  );

  // ── Valid ──────────────────────────────────────────────────────────────────
  const d            = donation;
  const impact       = PROGRAM_IMPACT[d.program] || PROGRAM_IMPACT.General;
  const accentColor  = impact.color;
  const freqLabel    = d.frequency === "once" ? "One-time" : d.frequency.charAt(0).toUpperCase() + d.frequency.slice(1);
  const gatewayLabel = d.gateway === "razorpay" ? "Razorpay" : "Stripe";

  const shareText = `I just donated ${d.symbol}${Number(d.amount).toLocaleString()} to ${d.program} by Swasthgram — bringing healthcare to remote villages in India. Join me!`;
  const shareUrl  = "https://swasthgram.org";
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
  };

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background: cc.warmBg, color: cc.text, minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        a { text-decoration:none; color:inherit; }
        @keyframes pulse-ring {
          0%   { transform:scale(0.95); box-shadow:0 0 0 0 rgba(27,107,58,0.45); }
          70%  { transform:scale(1);    box-shadow:0 0 0 18px rgba(27,107,58,0); }
          100% { transform:scale(0.95); box-shadow:0 0 0 0 rgba(27,107,58,0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu0 { animation:fadeUp 0.5s ease 0.0s both; }
        .fu1 { animation:fadeUp 0.5s ease 0.15s both; }
        .fu2 { animation:fadeUp 0.5s ease 0.25s both; }
        .fu3 { animation:fadeUp 0.5s ease 0.35s both; }
        .fu4 { animation:fadeUp 0.5s ease 0.45s both; }
        .share-btn { transition:transform 0.2s, opacity 0.2s; }
        .share-btn:hover { transform:translateY(-2px); opacity:0.88; }
        .prog-link { transition:background 0.2s; }
        .prog-link:hover { background:#e8e4dc !important; }
        @media (max-width:780px) {
          .ty-grid { grid-template-columns:1fr !important; }
          .hero-amt { font-size:44px !important; }
          .receipt-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <Header />

      {/* HERO */}
      <section style={{ background:`linear-gradient(160deg, ${cc.forestDeep} 0%, ${accentColor} 100%)`, padding:"140px 24px 60px 24px", marginTop:0 }}>
        <div style={{ maxWidth:640, margin:"0 auto", textAlign:"center" }}>
          <div className="fu0" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:84, height:84, borderRadius:"50%", background:"rgba(255,255,255,0.15)", marginBottom:24, animation:"pulse-ring 2.2s ease-in-out infinite" }}>
            <CheckCircle size={46} color="#fff" />
          </div>
          <div className="fu1" style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.55)", marginBottom:10 }}>
            Donation Confirmed · {d.date}
          </div>
          <h1 className="fu1" style={{ fontSize:"clamp(26px,4vw,42px)", fontWeight:800, color:"#fff", lineHeight:1.12, marginBottom:10 }}>
            Thank you, {d.name}!
          </h1>
          <div className="fu2 hero-amt" style={{ fontSize:58, fontWeight:800, color: cc.goldLight, lineHeight:1, marginBottom:10 }}>
            {d.symbol}{Number(d.amount).toLocaleString()}
          </div>
          <p className="fu2" style={{ fontSize:15, color:"rgba(255,255,255,0.7)", marginBottom:6, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.15)" }}>{impact.icon}</span>
            {d.program} · {freqLabel}
          </p>
          <p className="fu3" style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>
            Receipt sent to {d.email}
          </p>
        </div>
      </section>

      {/* BODY */}
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div className="ty-grid" style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24, alignItems:"flex-start" }}>

          {/* LEFT */}
          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

            {/* Message */}
            <div className="fu1" style={{ background:"#fff", borderRadius:16, padding:28, border:`1px solid ${cc.border}`, borderLeft:`4px solid ${accentColor}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:accentColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {impact.icon}
                </div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:accentColor }}>Your Donation is Already at Work</div>
              </div>
              <h2 style={{ fontSize:18, fontWeight:700, lineHeight:1.35, color: cc.text, marginBottom:14 }}>
                {impact.title}
              </h2>
              <p style={{ fontSize:14, lineHeight:1.9, color: cc.textMid, marginBottom:20 }}>
                {impact.message}
              </p>
              <div style={{ padding:"14px 18px", background: cc.cream, borderRadius:10, borderLeft:`3px solid ${accentColor}` }}>
                <p style={{ fontSize:13, fontWeight:600, color: cc.text, lineHeight:1.65, fontStyle:"italic" }}>
                  "{impact.quote}"
                </p>
              </div>
            </div>

            {/* Receipt */}
            <div className="fu2" style={{ background:"#fff", borderRadius:16, padding:28, border:`1px solid ${cc.border}` }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color: cc.textLight, marginBottom:20 }}>Donation Receipt</div>
              <div className="receipt-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px 24px", marginBottom:20 }}>
                {[
                  { label:"Donation ID",    value:`#${d.donationId}` },
                  { label:"Date",           value:d.date },
                  { label:"Amount",         value:`${d.symbol}${Number(d.amount).toLocaleString()}`, highlight:true },
                  { label:"Currency",       value:d.currency },
                  { label:"Program",        value:d.program },
                  { label:"Frequency",      value:freqLabel },
                  { label:"Payment via",    value:gatewayLabel },
                  d.state ? { label:"State / UT", value:d.state } : null,
                  { label:"Transaction ID", value:d.paymentId, mono:true },
                ].filter(Boolean).map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize:11, color: cc.textLight, marginBottom:3 }}>{item.label}</div>
                    <div style={{ fontSize:item.mono?11:13, fontWeight:item.highlight?700:600, color:item.highlight?accentColor:cc.text, fontFamily:item.mono?"monospace":"Inter,sans-serif", wordBreak:"break-all" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              {/* Tax note */}
              <div style={{ padding:"14px 16px", background:d.currency==="INR"?"#f0fdf4":"#eff6ff", borderRadius:10, borderLeft:`3px solid ${accentColor}` }}>
                <div style={{ fontSize:12, fontWeight:700, color:accentColor, marginBottom:4, display:"flex", alignItems:"center", gap:6 }}>
                  <Landmark size={13} color={accentColor} />
                  {d.currency==="INR" ? "Section 80G & 12A — Tax Deduction" : "IRS 501(c)(3) — Tax Deductible"}
                </div>
                <div style={{ fontSize:12, color: cc.textMid, lineHeight:1.6 }}>
                  {d.currency==="INR"
                    ? "Your 80G certificate will be emailed within 7 working days. Keep this receipt for your records."
                    : "This donation may be tax-deductible. Please retain this confirmation for your tax records."}
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="fu3" style={{ background:"#fff", borderRadius:16, padding:28, border:`1px solid ${cc.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <Share2 size={18} color={accentColor} />
                <div style={{ fontSize:15, fontWeight:700 }}>Spread the word</div>
              </div>
              <p style={{ fontSize:13, color: cc.textMid, lineHeight:1.65, marginBottom:18 }}>
                Every share could inspire another donor. Help us reach more villages.
              </p>
              <div style={{ background: cc.cream, borderRadius:10, padding:"13px 16px", marginBottom:20, fontSize:13, color: cc.textMid, lineHeight:1.65, fontStyle:"italic", border:`1px solid ${cc.border}` }}>
                "{shareText}"
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[
                  { label:"WhatsApp", href:shareLinks.whatsapp, bg:"#25D366", icon:<MessageCircle size={14} color="#fff" /> },
                  { label:"X / Twitter", href:shareLinks.twitter, bg:"#000",
                    icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.638 5.903-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label:"LinkedIn", href:shareLinks.linkedin, bg:"#0A66C2",
                    icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                  { label:"Facebook", href:shareLinks.facebook, bg:"#1877F2",
                    icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                ].map((btn, i) => (
                  <a key={i} href={btn.href} target="_blank" rel="noopener noreferrer" className="share-btn"
                    style={{ flex:"1 1 auto", display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"11px 12px", borderRadius:10, background:btn.bg, color:"#fff", fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:12 }}>
                    {btn.icon} {btn.label}
                  </a>
                ))}
                <button onClick={copyLink} className="share-btn"
                  style={{ flex:"1 1 auto", display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"11px 12px", borderRadius:10, background:copied?cc.forest:cc.cream, color:copied?"#fff":cc.text, border:`1px solid ${cc.border}`, fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}>
                  <Copy size={13} color={copied?"#fff":cc.text} /> {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

            {/* Support another program — FIRST */}
            <div className="fu2" style={{ background:"#fff", borderRadius:16, padding:22, border:`1px solid ${cc.border}` }}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:6, color: cc.text }}>Support another program</h3>
              <p style={{ fontSize:12, color: cc.textMid, lineHeight:1.6, marginBottom:14 }}>
                Explore other ways to make an impact.
              </p>
              {[
                { label:"SwasthManthan", sub:"Rural Healthcare", href:"/programs/swasthmanthan#donate" },
                { label:"Saksham",       sub:"Youth Skilling",   href:"/programs/saksham#donate" },
                { label:"Shudhvayu",     sub:"Clean Air",        href:"/programs/shudhvayu#donate" },
                { label:"General Fund",  sub:"Where needed most", href:"/#donate" },
              ].filter(p => p.label !== d.program).map((p, i) => (
                <a key={i} href={p.href} className="prog-link"
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 12px", borderRadius:10, background: cc.cream, border:`1px solid ${cc.border}`, marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color: cc.text }}>{p.label}</div>
                    <div style={{ fontSize:10, color: cc.textLight }}>{p.sub}</div>
                  </div>
                  <ArrowRight size={14} color={cc.textLight} />
                </a>
              ))}
            </div>

            {/* Track app — SECOND */}
            <div className="fu3" style={{ background:"#0F172A", borderRadius:16, overflow:"hidden", position:"relative" }}>
              {/* Decorative background circles */}
              <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:-20, left:-20, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />

              <div style={{ padding:22, position:"relative", zIndex:1 }}>
                {/* Header row */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Smartphone size={22} color="rgba(255,255,255,0.85)" />
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.2 }}>Swasthgram App</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:2 }}>iOS & Android</div>
                  </div>
                </div>

                {/* Feature pills */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                  {["Live camp map", "Track donation", "Reports"].map((f, i) => (
                    <span key={i} style={{ fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:20, background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.55)", border:"1px solid rgba(255,255,255,0.08)", fontFamily:"Inter,sans-serif" }}>
                      {f}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.65, marginBottom:18, fontFamily:"Inter,sans-serif" }}>
                  See exactly where your money went — live camp locations, diagnostic reports, and real-time impact updates.
                </p>

                {/* Divider */}
                <div style={{ height:1, background:"rgba(255,255,255,0.07)", marginBottom:16 }} />

                {/* Store buttons */}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <a href="https://apps.apple.com/in/app/swasthgram/id6746193769"
                    target="_blank" rel="noopener noreferrer"
                    style={{ display:"block", transition:"opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <img src={appStoreImg} alt="Download on App Store" style={{ height:38, objectFit:"contain", display:"block" }} />
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.app.swasthgram"
                    target="_blank" rel="noopener noreferrer"
                    style={{ display:"block", transition:"opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <img src={playStoreImg} alt="Get it on Google Play" style={{ height:38, objectFit:"contain", display:"block" }} />
                  </a>
                </div>
              </div>
            </div>

            {/* Need Help — THIRD */}
            <div className="fu4" style={{ background: cc.cream, borderRadius:14, padding:20, border:`1px solid ${cc.border}` }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color: cc.textLight, marginBottom:10 }}>Need Help?</div>
              <p style={{ fontSize:12, color: cc.textMid, lineHeight:1.65, marginBottom:10 }}>
                Questions about your receipt, 80G certificate, or donation details?
              </p>
              <a href="mailto:support@swasthgram.org"
                style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, color:accentColor }}>
                <ExternalLink size={12} color={accentColor} /> support@swasthgram.org
              </a>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}