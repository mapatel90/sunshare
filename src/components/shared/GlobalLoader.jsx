"use client";

import { useEffect, useState } from "react";
import { subscribeToLoading } from "@/contexts/LoadingStore";

export default function GlobalLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToLoading(setVisible);
    return () => unsubscribe();
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(1px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}>
      <div style={{
        width: 56,
        height: 56,
        border: "4px solid #e5e7eb",
        borderTopColor: "#2563eb",
        borderRadius: "50%",
        animation: "sunshare-spin 0.8s linear infinite",
      }} />
      <style>{`
        @keyframes sunshare-spin { 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}


