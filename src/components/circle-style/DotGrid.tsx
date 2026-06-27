"use client";

import { useEffect, useState } from "react";

const DotGrid = () => {
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) { setCols(3); setRows(6); }
      else if (w < 1024) { setCols(4); setRows(4); }
      else { setCols(6); setRows(3); }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!cols || !rows) return null;

  const p = 24;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {Array.from({ length: cols * rows }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `calc(${p}px + ${col / (cols - 1)} * (100% - ${2 * p}px))`,
              top: `calc(${p}px + ${row / (rows - 1)} * (100% - ${2 * p}px))`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="rounded-full bg-gray-400/55" style={{ width: 8, height: 8 }} />
          </div>
        );
      })}
    </div>
  );
}

export default DotGrid;