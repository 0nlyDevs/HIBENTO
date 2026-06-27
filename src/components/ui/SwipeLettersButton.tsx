"use client";

import { useMemo, type ReactNode } from "react";
import s from "./css/SwipeLettersButton.module.css";

interface Props {
  label?: string;
  children?: string;
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
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export default function SwipeLettersButton({
  label,
  children,
  href,
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
  const resolvedLabel = label ?? children ?? "";
  const chars = useMemo(
    () => Array.from(resolvedLabel).map((c) => (c === " " ? "\u00A0" : c)),
    [resolvedLabel]
  );

  const rootVars = {
    "--swipe-color": textColor,
    "--swipe-hover-color": hoverTextColor ?? textColor,
  } as React.CSSProperties;

  const inner = (
    <>
      {icon && iconPosition === "left" && (
        <span className={s.icon}>{icon}</span>
      )}
      <span className={s.letters}>
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
              className={`${s.slot} ${s[dir]}`}
              style={{ fontSize, fontWeight }}
            >
              <span
                className={s.stack}
                style={{
                  transitionDuration: `${duration}ms`,
                  transitionDelay: `${i * stagger}ms`,
                }}
              >
                <span className={s.char}>{ch}</span>
                <span className={s.char}>{ch}</span>
              </span>
            </span>
          );
        })}
      </span>
      {icon && iconPosition === "right" && (
        <span className={s.icon}>{icon}</span>
      )}
    </>
  );

  const shared = {
    className: `${s.root} ${className}`,
    style: { ...rootVars, ...style },
    ...(onClick ? { onClick } : {}),
  };

  if (as === "button") {
    return (
      <button type="button" {...shared}>
        {inner}
      </button>
    );
  }

  return (
    <a href={href} {...shared}>
      {inner}
    </a>
  );
}
