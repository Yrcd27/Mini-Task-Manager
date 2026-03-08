"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  const open = () => {
    updatePosition();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, updatePosition]);

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          ref={triggerRef}
          type="button"
          onClick={open}
          className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm bg-white
            transition-all duration-200 outline-none cursor-pointer
            ${isOpen ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200 hover:border-emerald-300"}
            ${selected ? "text-slate-900" : "text-slate-400"}`}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown
            className={`w-4 h-4 shrink-0 ml-2 transition-transform duration-200
              ${isOpen ? "rotate-180 text-emerald-500" : "text-slate-400"}`}
          />
        </button>
      </div>

      {isOpen && typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              zIndex: 9999,
            }}
            className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors
                    ${opt.value === value
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"}`}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
}
