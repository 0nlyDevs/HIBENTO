"use client";
import styles from "./css/CTAButton.module.css";

interface Props {
  label?: string;
  href?: string;
  as?: "a" | "button";
  onClick?: () => void;
  newTab?: boolean;
  className?: string;
  textClassName?: string;
  arrowClassName?: string;
  color?: string;
  textColor?: string;
}

export default function CTAButton({
  label = "Book a call",
  href = "#",
  as = "a",
  onClick,
  newTab = false,
  className = "",
  textClassName = "",
  arrowClassName = "",
  color = "#000",
  textColor = "#fff",
}: Props) {
  const inner = (
    <>
      <span
        className={`${styles.text} ${textClassName}`}
        style={{ background: color, color: textColor }}
      >
        {label}
      </span>
      <span
        className={`${styles.arrow} ${arrowClassName}`}
        style={{ background: color }}
      >
        <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 1.4 13 L 0 11.6 L 9.6 2 L 1 2 L 1 0 L 13 0 L 13 12 L 11 12 L 11 3.4 Z"
            fill={textColor}
          />
        </svg>
      </span>
    </>
  );

  if (as === "button") {
    return (
      <button type="button" onClick={onClick} className={`${styles.root} ${className}`}>
        {inner}
      </button>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={`${styles.root} ${className}`}
    >
      {inner}
    </a>
  );
}
