"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function toLocal(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fmt(s: string) {
  const d = toLocal(s);
  if (!d) return null;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function CalendarPane({
  label,
  value,
  onSelect,
  highlight,
}: {
  label: string;
  value: string;
  onSelect: (iso: string) => void;
  highlight?: { from: string; to: string };
}) {
  const selected = toLocal(value);
  const today    = new Date();
  const [view, setView] = useState(() => {
    const d = toLocal(value) ?? new Date(today.getFullYear(), today.getMonth(), 1);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year  = view.getFullYear();
  const month = view.getMonth();

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const fromDate = toLocal(highlight?.from ?? "");
  const toDate   = toLocal(highlight?.to   ?? "");

  function inRange(day: number) {
    if (!fromDate || !toDate) return false;
    const d = new Date(year, month, day);
    return d > fromDate && d < toDate;
  }
  function isFrom(day: number) {
    if (!fromDate) return false;
    return fromDate.getFullYear() === year && fromDate.getMonth() === month && fromDate.getDate() === day;
  }
  function isTo(day: number) {
    if (!toDate) return false;
    return toDate.getFullYear() === year && toDate.getMonth() === month && toDate.getDate() === day;
  }
  function isSelected(day: number) {
    if (!selected) return false;
    return selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day;
  }
  function isToday(day: number) {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  }

  return (
    <div className="flex-1 min-w-[200px]">
      {/* Label */}
      <p className="label-mono text-ivory/30 mb-3">{label}</p>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setView(new Date(year, month - 1, 1))}
          className="w-6 h-6 rounded-full flex items-center justify-center text-ivory/40 hover:text-ivory hover:bg-white/10 transition-all"
        >
          <ChevronLeft size={13} />
        </button>
        <span className="text-xs font-bold text-ivory">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="w-6 h-6 rounded-full flex items-center justify-center text-ivory/40 hover:text-ivory hover:bg-white/10 transition-all"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[0.55rem] font-bold tracking-widest text-ivory/20 py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const sel   = isSelected(day);
          const from  = isFrom(day);
          const to    = isTo(day);
          const range = inRange(day);
          const todayFlag = isToday(day);
          return (
            <div key={i} className="flex items-center justify-center">
              <button
                onClick={() => onSelect(toISO(new Date(year, month, day)))}
                className={`w-7 h-7 rounded-full text-[0.7rem] font-medium transition-all relative
                  ${sel || from || to
                    ? "bg-chartreuse text-charcoal font-bold shadow-[0_0_10px_-4px_hsl(59_73%_52%/0.8)]"
                    : range
                      ? "bg-chartreuse/15 text-chartreuse"
                      : todayFlag
                        ? "text-chartreuse border border-chartreuse/40 hover:bg-chartreuse/10"
                        : "text-ivory/60 hover:text-ivory hover:bg-white/10"
                  }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({ from, to, onFromChange, onToChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const hasRange = from || to;

  // Trigger label
  let triggerLabel: React.ReactNode;
  if (from && to) {
    triggerLabel = <><span className="text-chartreuse">{fmt(from)}</span><span className="text-ivory/30 mx-1">→</span><span className="text-chartreuse">{fmt(to)}</span></>;
  } else if (from) {
    triggerLabel = <><span className="text-chartreuse">From {fmt(from)}</span><span className="text-ivory/30 ml-1">→ ?</span></>;
  } else if (to) {
    triggerLabel = <><span className="text-ivory/30">? →</span><span className="text-chartreuse ml-1">Until {fmt(to)}</span></>;
  } else {
    triggerLabel = <span>Date range</span>;
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="inline-flex items-center gap-2 h-9 px-3.5 text-sm font-medium tracking-wide transition-all focus:outline-none rounded-xl"
          style={{
            background: hasRange ? "rgba(200,210,50,0.1)" : "rgba(255,255,255,0.06)",
            border: hasRange
              ? "1px solid rgba(200,210,50,0.35)"
              : open
                ? "1px solid rgba(200,210,50,0.35)"
                : "1px solid rgba(255,255,255,0.12)",
            color: hasRange ? "hsl(59 73% 52%)" : "hsl(84 64% 98% / 0.8)",
            minWidth: "130px",
          }}
        >
          <CalendarDays size={12} className={hasRange ? "text-chartreuse opacity-100" : "text-ivory/50"} />
          <span className="flex-1 text-left">{triggerLabel}</span>
          {hasRange ? (
            <span
              className="text-ivory/30 hover:text-ivory transition-colors"
              onClick={(e) => { e.stopPropagation(); onFromChange(""); onToChange(""); }}
            >
              <X size={11} />
            </span>
          ) : (
            <ChevronLeft
              size={11}
              className={`text-ivory/20 transition-transform duration-200 ${open ? "-rotate-90" : "rotate-180"}`}
            />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 p-5"
          style={{
            background: "#1a1a1f",
            border: "1px dashed rgba(255,255,255,0.18)",
            borderRadius: "1rem",
            boxShadow: "0 20px 50px -10px rgba(0,0,0,0.7)",
            width: "480px",
            maxWidth: "calc(100vw - 2rem)",
          }}
          sideOffset={8}
          align="start"
        >
          {/* Two calendars side by side */}
          <div className="flex gap-5">
            <CalendarPane
              label="FROM"
              value={from}
              onSelect={onFromChange}
              highlight={{ from, to }}
            />
            <div className="w-px bg-white/10 self-stretch" />
            <CalendarPane
              label="TO"
              value={to}
              onSelect={onToChange}
              highlight={{ from, to }}
            />
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between mt-4 pt-3"
            style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <button
              onClick={() => { onFromChange(""); onToChange(""); }}
              className="text-[0.65rem] font-medium text-ivory/30 hover:text-ivory/60 transition-colors tracking-wider uppercase"
            >
              Clear range
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-1.5 text-[0.65rem] font-bold tracking-wider bg-chartreuse text-charcoal rounded-full hover:bg-chartreuse-soft transition-colors"
            >
              Apply
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
