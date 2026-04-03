import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const selectClasses =
  "rounded-md border border-gray-700 bg-[#161616] px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none";
const dropdownButtonClasses =
  "min-w-[140px] rounded-md border border-gray-700 bg-[#161616] px-3 py-2 text-left text-sm text-white focus:border-orange-400 focus:outline-none";

const ScrollableFilterDropdown = ({
  label,
  value,
  options,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasMoreThanSeven = options.length > 7;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={dropdownButtonClasses}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="truncate">{value || label}</span>
          <span className="text-xs text-gray-400">{open ? "▲" : "▼"}</span>
        </span>
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-2 w-full min-w-[180px] rounded-xl border border-white/10 bg-[#161616] p-1 shadow-xl">
          <div className={hasMoreThanSeven ? "max-h-[280px] overflow-y-auto" : ""}>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                !value
                  ? "bg-orange-400/10 text-orange-300"
                  : "text-gray-200 hover:bg-white/5"
              }`}
            >
              {label}
            </button>

            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  value === option
                    ? "bg-orange-400/10 text-orange-300"
                    : "text-gray-200 hover:bg-white/5"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Filter_Ordering = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchFilterOptions = async () => {
      try {
        const { data } = await axios.get(`${API}/api/products/filters/`);
        if (isMounted) {
          setFilterOptions({
            categories: data.categories || [],
            brands: data.brands || [],
          });
        }
      } catch (error) {
        console.error("Failed to load filter options", error);
      }
    };

    fetchFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(location.search);

    if (value) {
      nextParams.set(key, value);
      nextParams.set("page", 1);
    } else {
      nextParams.delete(key);
    }

    navigate(`/?${nextParams.toString()}`);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <ScrollableFilterDropdown
        label="Category"
        value={params.get("category") || ""}
        options={filterOptions.categories}
        onChange={(value) => updateParam("category", value)}
      />

      <ScrollableFilterDropdown
        label="Brand"
        value={params.get("brand") || ""}
        options={filterOptions.brands}
        onChange={(value) => updateParam("brand", value)}
      />

      <select
        value={params.get("ordering") || ""}
        onChange={(e) => updateParam("ordering", e.target.value)}
        className={selectClasses}
      >
        <option value="">Sort</option>
        <option value="price">Low to High</option>
        <option value="-price">High to Low</option>
        <option value="-rating">Top Rated</option>
      </select>
    </div>
  );
};

export default Filter_Ordering;
