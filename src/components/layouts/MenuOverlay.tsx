"use client";

import { useCallback } from "react";

interface MenuItem {
  id: string;
  label: string;
}

interface MenuOverlayProps {
  items: readonly MenuItem[];
  isClosing: boolean;
  onItemClick: (item: MenuItem) => void;
  onClose: () => void;
}

function MenuItemButton({
  item,
  onClick,
  isSmall,
}: {
  item: MenuItem;
  onClick: () => void;
  isSmall: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer transition-transform duration-300 ease-out hover:translate-x-2 text-left"
    >
      <span
        className={`inline-block ${isSmall ? "text-charcoal text-2xl lg:text-3xl" : "font-black text-charcoal text-4xl lg:text-5xl"} leading-tight`}
        style={{ transform: "scaleY(0.9)" }}
      >
        {item.label}
      </span>
    </button>
  );
}

export function MenuOverlay({ items, isClosing, onItemClick, onClose }: MenuOverlayProps) {
  const midpoint = Math.ceil(items.length / 2);
  const showDivider = items.length > 3;
  const leftItems = items.slice(0, midpoint);
  const rightItems = items.slice(midpoint);

  return (
    <div
      className={`
        fixed z-70
        top-5 left-8 right-8 bottom-4 md:bottom-auto
        rounded-2xl bg-cover bg-center bg-no-repeat overflow-hidden
        ${isClosing ? "pointer-events-none" : ""}
      `}
      style={{
        backgroundImage: "url('/images/navbar-bg.png')",
        animation: isClosing
          ? `waterUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards`
          : `waterDown 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
      }}
    >
      <div className="flex md:hidden flex-col pt-24 h-full">
        <div className="flex flex-col gap-2 pl-5">
          {items.map((item) => (
            <MenuItemButton
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
              isSmall={item.id === "whatsnew" || item.id === "infofaq"}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-start h-full px-12 lg:px-20">
        <div className="flex flex-col items-start gap-2 lg:gap-3 py-12 lg:py-16">
          {leftItems.map((item) => (
            <MenuItemButton
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
              isSmall={item.id === "whatsnew" || item.id === "infofaq"}
            />
          ))}
        </div>

        {showDivider && (
          <div
            className="w-0.5 self-stretch mx-6 lg:mx-10 opacity-20"
            style={{
              backgroundImage: "repeating-linear-gradient(to bottom, #222 0px, #222 5px, transparent 5px, transparent 10px)",
              backgroundSize: "2px 100%",
            }}
          />
        )}

        <div className="flex flex-col items-start gap-2 lg:gap-3 py-12 lg:py-16">
          {rightItems.map((item) => (
            <MenuItemButton
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
              isSmall={item.id === "whatsnew" || item.id === "infofaq"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
