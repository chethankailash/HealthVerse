"use client";

import { useEffect } from "react";

export default function PWAInit() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("[HealthVerse] PWA ready ✅"))
        .catch((err) =>
          console.error("[HealthVerse] SW registration error:", err)
        );
    }
  }, []);

  return null;
}
