"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DatePickerProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
  placeholder?: string;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function toLocal(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date" }: DatePickerProps) {
  const selected = toLocal(value);
  const today = new Date();

  const [view, setView] = useState<Date>(selected ?? new Date(today.getFullYear(), today.getMonth(), 1));
  const [open, setOpen] = useState(false);

  const year  = view.getFullYear();
  const month = view.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() { setView(new Date(year, month - 1, 1)); }
  function nextMonth() { setView(new Date(year, month + 1, 1)); }

  function selectDay(day: number) {
    const d = new Date(year, month, day);
    onChange(toISO(d));
    setOpen(false);
  }

  function isSelected(day: number) {
    if (!selected) return false;
    return selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day;
  }

  function isToday(day: number) {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  }

  const displayValue = selected
    ? selected.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors focus:outline-none rounded-xl"
          style={{
            background: "#222222E6",
            border: open ? "1px dashed rgba(200,210,50,0.4)" : "1px dashed rgba(255,255,255,0.18)",
            color: displayValue ? "hsl(84 64% 98% / 0.8)" : "hsl(84 64% 98% / 0.4)",
            minWidth: "130px",
          }}
        >
          <CalendarDays size={12} className={displayValue ? "text-chartreuse" : "text-ivory/30"} />
          <span className="flex-1 text-left">{displayValue ?? placeholder}</span>
          {displayValue && (
            <span
              className="text-ivory/30 hover:text-ivory transition-colors"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
            >
              <X size={11} />
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 p-4 w-[280px]"
          style={{
            background: "#1a1a1f",
            border: "1px dashed rgba(255,255,255,0.18)",
            borderRadius: "1rem",
            boxShadow: "0 16px 40px -8px rgba(0,0,0,0.6)",
          }}
          sideOffset={6}
          align="start"
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center text-ivory/40 hover:text-ivory hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-bold text-ivory tracking-tight">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center text-ivory/40 hover:text-ivory hover:bg-white/10 transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[0.6rem] font-bold tracking-widest text-ivory/25 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => (
              <div key={i} className="flex items-center justify-center">
                {day ? (
                  <button
                    onClick={() => selectDay(day)}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                      isSelected(day)
                        ? "bg-chartreuse text-charcoal font-bold shadow-[0_0_12px_-4px_hsl(59_73%_52%/0.8)]"
                        : isToday(day)
                          ? "text-chartreuse border border-chartreuse/40 hover:bg-chartreuse/10"
                          : "text-ivory/60 hover:text-ivory hover:bg-white/10"
                    }`}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className="text-[0.65rem] font-medium text-ivory/30 hover:text-ivory/60 transition-colors tracking-wider uppercase"
            >
              Clear
            </button>
            <button
              onClick={() => { selectDay(today.getDate()); setView(new Date(today.getFullYear(), today.getMonth(), 1)); }}
              className="text-[0.65rem] font-medium text-chartreuse hover:text-chartreuse-soft transition-colors tracking-wider uppercase"
            >
              Today
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
