"use client";
import { useMemo } from "react";
import styles from "./css/SwipeLettersButton.module.css";

interface Props {
  label?: string;
  href?: string;
  as?: "a" | "button";
  onClick?: () => void;
  textColor?: string;
  hoverTextColor?: string;
  fontSize?: string;
  fontWeight?: number;
  direction?: "top" | "bottom" | "alternate";
  duration?: number;
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function SwipeLettersButton({
  label = "GET IN TOUCH",
  href = "#",
  as = "a",
  onClick,
  textColor = "currentColor",
  hoverTextColor,
  fontSize = "0.875rem",
  fontWeight = 400,
  direction = "alternate",
  duration = 380,
  stagger = 18,
  className = "",
  style,
  icon,
  iconPosition = "left",
}: Props) {
  const chars = useMemo(
    () => Array.from(label).map((c) => (c === " " ? "\u00A0" : c)),
    [label]
  );

  const rootVars = {
    "--swipe-color": textColor,
    "--swipe-hover-color": hoverTextColor ?? textColor,
  } as React.CSSProperties;

  const inner = (
    <>
      {icon && iconPosition === "left" && (
        <span className={styles.icon}>{icon}</span>
      )}
      <span className={styles.letters}>
        {chars.map((ch, i) => {
          let dir: string;
          if (direction === "alternate") {
            dir = i % 2 === 0 ? "from-top" : "from-bottom";
          } else {
            dir = direction === "top" ? "from-top" : "from-bottom";
          }

          return (
            <span
              key={i}
              className={`${styles.slot} ${styles[dir]}`}
              style={{ fontSize, fontWeight }}
            >
              <span
                className={styles.stack}
                style={{
                  transitionDuration: `${duration}ms`,
                  transitionDelay: `${i * stagger}ms`,
                }}
              >
                <span className={styles.char}>{ch}</span>
                <span className={styles.char}>{ch}</span>
              </span>
            </span>
          );
        })}
      </span>
      {icon && iconPosition === "right" && (
        <span className={styles.icon}>{icon}</span>
      )}
    </>
  );

  const shared = {
    className: `${styles.root} ${className}`,
    style: { ...rootVars, ...style },
  };

  if (as === "button") {
    return (
      <button type="button" onClick={onClick} {...shared}>
        {inner}
      </button>
    );
  }

  return (
    <a href={href} onClick={onClick} {...shared}>
      {inner}
    </a>
  );
}
