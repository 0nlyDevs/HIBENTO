"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ value, onValueChange, options, placeholder }: SelectProps) {
  const selected = options.find((o) => o.value === value);
  const isActive = value !== "all" && value !== "";

  return (
    <div className="relative inline-flex">
      <RadixSelect.Root value={value} onValueChange={onValueChange}>
        <RadixSelect.Trigger
          className="group inline-flex items-center gap-2 h-9 text-sm font-medium tracking-wide transition-all focus:outline-none rounded-xl"
          style={{
            background: isActive ? "rgba(200,210,50,0.1)" : "rgba(255,255,255,0.06)",
            border: isActive
              ? "1px solid rgba(200,210,50,0.35)"
              : "1px solid rgba(255,255,255,0.12)",
            color: isActive ? "hsl(59 73% 52%)" : "hsl(84 64% 98% / 0.8)",
            paddingLeft: "0.875rem",
            paddingRight: isActive ? "2rem" : "0.875rem",
            minWidth: "120px",
          }}
        >
          {selected?.icon && (
            <span className="shrink-0 opacity-50">{selected.icon}</span>
          )}
          <RadixSelect.Value placeholder={placeholder}>
            {selected?.label}
          </RadixSelect.Value>
          {!isActive && (
            <RadixSelect.Icon className="ml-auto pl-1">
              <ChevronDown
                size={12}
                className="text-ivory/40 group-data-[state=open]:text-chartreuse group-data-[state=open]:rotate-180 transition-all duration-200"
              />
            </RadixSelect.Icon>
          )}
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="overflow-hidden z-50 min-w-40 py-1.5"
            style={{
              background: "#18181c",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "0.75rem",
              boxShadow: "0 20px 50px -10px rgba(0,0,0,0.8)",
            }}
            position="popper"
            sideOffset={6}
            align="start"
          >
            <RadixSelect.Viewport>
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium tracking-wide cursor-pointer select-none outline-none transition-colors rounded-lg mx-1"
                  style={{ color: "hsl(84 64% 98% / 0.65)" }}
                >
                  {option.icon && (
                    <span className="opacity-50">{option.icon}</span>
                  )}
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-auto">
                    <Check size={11} className="text-chartreuse" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {isActive && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onValueChange("all");
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-chartreuse/60 hover:text-chartreuse transition-colors z-10"
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}
