import { ImageResponse } from "next/og";

export const alt = "Бурнашев Равшан — разработчик сайтов и приложений";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#0b0e1a",
          color: "#e9edfb",
          backgroundImage:
            "linear-gradient(rgba(124,151,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(124,151,255,0.09) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            letterSpacing: 8,
            color: "#8fa8ff",
          }}
        >
          <div style={{ width: 56, height: 2, backgroundColor: "#ff7ab8" }} />
          PORTFOLIO // BURNASHEV.DEV
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              fontSize: 190,
              fontWeight: 700,
              lineHeight: 1,
              color: "#c7d3ff",
            }}
          >
            РБ
          </div>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 700 }}>
            Бурнашев Равшан
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#8b94b8" }}>
            Разработчик сайтов и приложений · NamDTU
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 160, height: 8, backgroundColor: "#4d74ff" }} />
          <div style={{ width: 80, height: 8, backgroundColor: "#f0619e" }} />
          <div style={{ fontSize: 22, color: "#8b94b8", marginLeft: 12 }}>
            сайты · приложения · код
          </div>
        </div>
      </div>
    ),
    size
  );
}
