import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumb({ items = [], theme = "dark" }) {
  const muted = theme === "light" ? "#6B7280" : "rgba(255,255,255,0.55)";
  const divider = theme === "light" ? "#9CA3AF" : "rgba(255,255,255,0.35)";
  const current = theme === "light" ? "#374151" : "rgba(255,255,255,0.92)";

  return (
    <div style={{
      position: "absolute",
      top: 64, left: 0, right: 0,
      zIndex: 3,
      padding: "10px 0",
    }}>
      <div style={{
        maxWidth: 1080, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", gap: 8,
        fontFamily: "'Inter', sans-serif", fontSize: 13,
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", color: muted }}>
          <Home size={14} />
        </a>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ChevronRight size={13} color={divider} />
              {item.href && !isLast ? (
                <a href={item.href} style={{ color: muted }}>{item.label}</a>
              ) : (
                <span style={{ color: isLast ? current : muted, fontWeight: isLast ? 600 : 400 }}>
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
