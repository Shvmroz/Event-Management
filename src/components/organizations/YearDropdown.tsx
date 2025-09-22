"use client";

import React, { useState, useRef, useEffect } from "react";

const YearDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => (new Date().getFullYear() - i).toString()
  );

  const filteredYears = years.filter((year) =>
    year.toLowerCase().includes(query.toLowerCase())
  );

  // close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-10 px-3 border rounded-md dark:bg-gray-700 dark:text-white text-left text-sm"
      >
        {value || "Select year"}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full border rounded-md bg-white dark:bg-gray-700 shadow">
          {/* Search Input */}
          <input
            type="text"
            autoFocus
            placeholder="Search year..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 border-b bg-gray-100 dark:bg-gray-700 dark:text-white outline-none"
          />

          {/* List */}
          <div className="max-h-[150px] overflow-y-auto">
            {filteredYears.length > 0 ? (
              filteredYears.map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    onChange(year);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    value === year
                      ? "bg-gray-200 dark:bg-gray-600 font-medium"
                      : ""
                  }`}
                >
                  {year}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearDropdown;
