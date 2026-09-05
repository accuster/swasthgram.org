import { useRef, useState, useEffect } from "react";

const COLORS = {
  gold: "#C8963E",
  border: "#E8E4DC",
  white: "#FFFFFF",
};

// All 16 gallery images — split into two rows
const ROW1 = [
  "home (1).png",
  "home (2).jpeg",
  "home (3).jpeg",
  "home (4).jfif",
  "home (5).png",
  "home (6).jpeg",
  "home (7).jpeg",
  "home (8).png",
];

const ROW2 = [
  "home (9).png",
  "home (10).png",
  "home (11).webp",
  "home (12).webp",
  "home (13).webp",
  "home (14).jpeg",
  "home (15).png",
  "home (16).webp",
];

function GalleryRow({ files, reverse = false, speed = 35 }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", marginBottom: 12 }}>
      {/* Left fade */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 100,
          background: "linear-gradient(to right, #fff, transparent)",
          zIndex: 2, pointerEvents: "none",
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 100,
          background: "linear-gradient(to left, #fff, transparent)",
          zIndex: 2, pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 12,
          width: "max-content",
          animation: `marquee ${speed}s linear infinite ${reverse ? "reverse" : ""}`,
        }}
      >
        {/* Duplicate for seamless loop */}
        {[...files, ...files].map((file, i) => (
          <div
            key={`${file}-${i}`}
            style={{
              flexShrink: 0,
              width: 280,
              height: 186,
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            }}
          >
            <img
              src={new URL(`../assets/home/gallery/${file}`, import.meta.url).href}
              alt={`Swasthgram gallery`}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeGallery() {
  return (
    <section
      style={{
        padding: "64px 0 56px",
        background: COLORS.white,
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
          marginBottom: 36,
        }}
      >
        <div
          className="tag"
          style={{ color: COLORS.gold, marginBottom: 8 }}
        >
          On The Ground
        </div>
        <h2
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "clamp(20px, 2.8vw, 30px)",
            fontWeight: 700,
            color: "#1F2937",
            lineHeight: 1.25,
          }}
        >
          Our work in action
        </h2>
      </div>

      {/* Row 1 — scrolls left */}
      <GalleryRow files={ROW1} reverse={false} speed={38} />

      {/* Row 2 — scrolls right */}
      <GalleryRow files={ROW2} reverse={true} speed={32} />
    </section>
  );
}