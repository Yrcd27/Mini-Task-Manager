"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_HEADERS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function formatDisplay(s: string): string {
  if (!s) return "";
  const [y, m, d] = s.split("-").map(Number);
  return `${MONTHS[m - 1].slice(0, 3)} ${d}, ${y}`;
}

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function pad(n: number) { return String(n).padStart(2, "0"); }
function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
}

export default function CustomDatePicker({
  value, onChange, placeholder = "Pick a date (YYYY-MM-DD)", className = "",
}: CustomDatePickerProps) {
  const now = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [vy, setVy] = useState(value ? +value.split("-")[0] : now.getFullYear());
  const [vm, setVm] = useState(value ? +value.split("-")[1] - 1 : now.getMonth());

  const triggerRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const calendarWidth = 280;
    const calendarHeight = 300;
    
    setPosition({
      top: Math.min(rect.top, window.innerHeight - calendarHeight - 16),
      left: Math.min(rect.right + 8, window.innerWidth - calendarWidth - 16),
      width: calendarWidth,
    });
  }, []);

  const open = () => {
    if (value) { setVy(+value.split("-")[0]); setVm(+value.split("-")[1] - 1); }
    updatePosition();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !calRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, updatePosition]);

  const dim = daysInMonth(vy, vm);
  const fd = firstDay(vy, vm);
  const prevDim = daysInMonth(vy, vm - 1);

  const cells: { day: number; type: "prev" | "cur" | "next" }[] = [];
  for (let i = fd - 1; i >= 0; i--) cells.push({ day: prevDim - i, type: "prev" });
  for (let d = 1; d <= dim; d++) cells.push({ day: d, type: "cur" });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - dim - fd + 1, type: "next" });

  const prevMonth = () => vm === 0 ? (setVm(11), setVy(y => y - 1)) : setVm(m => m - 1);
  const nextMonth = () => vm === 11 ? (setVm(0), setVy(y => y + 1)) : setVm(m => m + 1);

  const today = todayStr();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    
    // Auto-update calendar view when valid date is typed
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [y, m] = val.split("-").map(Number);
      if (y && m >= 1 && m <= 12) {
        setVy(y);
        setVm(m - 1);
      }
    }
  };

  const isValidFormat = value && /^\d{4}-\d{2}-\d{2}$/.test(value);

  return (
    <>
      <div className={`relative ${className}`} ref={triggerRef}>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={10}
          className={`w-full px-4 py-3 pr-20 border-2 rounded-xl text-sm bg-white
            transition-all duration-200 outline-none font-mono
            ${isOpen ? "border-emerald-500 ring-2 ring-emerald-500/20" : 
              value && !isValidFormat ? "border-red-300 focus:border-red-400" :
              "border-slate-200 focus:border-emerald-300"}
            text-slate-900 placeholder:text-slate-400`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={open}
            className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {isOpen && typeof window !== "undefined" &&
        createPortal(
          <div
            ref={calRef}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              zIndex: 99999,
            }}
            className="bg-white border border-slate-200 rounded-xl shadow-2xl p-3 animate-slideInRight"
          >
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={prevMonth} className="p-1 hover:bg-emerald-50 rounded transition-colors">
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <span className="text-xs font-semibold text-slate-800">{MONTHS[vm]} {vy}</span>
              <button type="button" onClick={nextMonth} className="p-1 hover:bg-emerald-50 rounded transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {DAY_HEADERS.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-0.5">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((cell, i) => {
                if (cell.type !== "cur") {
                  return <div key={i} className="text-center text-[10px] text-slate-200 py-1 px-0.5">{cell.day}</div>;
                }
                const ds = `${vy}-${pad(vm + 1)}-${pad(cell.day)}`;
                const isSel = ds === value;
                const isTod = ds === today;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { onChange(ds); setIsOpen(false); }}
                    className={`text-center text-[11px] py-1 rounded-full transition-all duration-150 font-medium w-full
                      ${isSel ? "bg-emerald-500 text-white shadow-sm" : ""}
                      ${isTod && !isSel ? "ring-1 ring-emerald-400 text-emerald-700" : ""}
                      ${!isSel && !isTod ? "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700" : ""}`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { onChange(today); setIsOpen(false); }}
                className="w-full py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
}
