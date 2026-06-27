import type { PillProps } from "./types";

export function Pill({
  label,
  isActive,
  onClick,
  index,
  setPillRef,
  uppercase = false,
}: PillProps) {
  return (
    <button
      ref={(el) => setPillRef(index, el)}
      onClick={onClick}
      className={`px-3.5 py-1.5 text-xs font-semibold squircle whitespace-nowrap transition-colors duration-300 relative z-10 ${
        uppercase ? "uppercase tracking-wider" : ""
      } ${isActive ? "text-charcoal" : "text-ivory/50 hover:text-ivory"}`}
    >
      {label}
    </button>
  );
}
