import type { MetadataRoute } from "next";
import { site } from "@/data/site.config";

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.nameRu} — портфолио`,
    short_name: "Burnashev",
    description:
      "Портфолио разработчика сайтов и приложений Бурнашева Равшана.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0e1a",
    theme_color: "#0b0e1a",
    lang: "ru-RU",
    categories: ["portfolio", "developer", "education"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
