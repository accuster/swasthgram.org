import { useEffect, useState } from "react";
import QRCode from "qrcode";
import appStoreImg  from "../assets/app_store.png";
import playStoreImg from "../assets/play_store.png";
import swasthgramLogo from "../assets/SwasthgramLogo.png";

const APP_STORE_URL  = "https://apps.apple.com/in/app/swasthgram/id6746193769";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.app.swasthgram";
const DOWNLOAD_URL   = "https://swasthgram.org/download";

function QRImage({ value, size = 200 }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setSrc).catch(console.error);
  }, [value, size]);

  if (!src) return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #eee", borderTopColor: "#1B6B3A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );
  return <img src={src} alt="QR Code" style={{ width: size, height: size, display: "block", borderRadius: 8 }} />;
}

export default function DownloadPage() {

  // On mobile: auto-redirect to the right store
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isAndroid) {
      setTimeout(() => { window.location.href = PLAY_STORE_URL; }, 800);
    } else if (isIOS) {
      setTimeout(() => { window.location.href = APP_STORE_URL; }, 800);
    }
    // Desktop: just show the page normally
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        .store-badge {
          display: block;
          transition: opacity 0.2s, transform 0.2s;
        }
        .store-badge:hover {
          opacity: 0.85;
          transform: translateY(-2px);
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
      `}</style>

      {/* Logo */}
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}>
        <img src={swasthgramLogo} alt="Swasthgram" style={{ width: 48, height: 48, objectFit: "contain" }} />
      </div>

      {/* Title */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6, textAlign: "center" }}>
        Swasthgram App
      </h1>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 36, textAlign: "center" }}>
        Free · Healthcare · iOS & Android
      </p>

      {/* QR Code box */}
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 18,
        boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
      }}>
        <QRImage value={DOWNLOAD_URL} size={200} />
      </div>

      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 28, textAlign: "center" }}>
        Scan this QR code on your phone to download the app.
      </p>

      {/* OR divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 320, marginBottom: 28 }}>
        <div className="divider-line" />
        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: 2 }}>OR</span>
        <div className="divider-line" />
      </div>

      {/* Store badges — side by side */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="store-badge"
        >
          <img src={appStoreImg} alt="Download on the App Store" style={{ height: 48, display: "block", objectFit: "contain" }} />
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="store-badge"
        >
          <img src={playStoreImg} alt="Get it on Google Play" style={{ height: 48, display: "block", objectFit: "contain" }} />
        </a>
      </div>

      {/* Back link */}
      <a
        href="https://swasthgram.org"
        style={{ marginTop: 40, fontSize: 12, color: "rgba(255,255,255,0.2)", transition: "color 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
      >
        ← Back to swasthgram.org
      </a>
    </div>
  );
}