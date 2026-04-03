import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setKeyword(params.get("search") || "");
  }, [location.search]);

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    const params = new URLSearchParams(location.search);

    if (value) {
      params.set("search", value);
      params.set("page", 1);
    } else {
      params.delete("search");
    }

    navigate(`/?${params.toString()}`);
  };

  return (
    <div className={className}>
      <input
        type="text"
        value={keyword}
        onChange={handleChange}
        placeholder="Search products..."
        className="w-full rounded-md border border-gray-700 bg-[#161616] px-4 py-2 text-sm text-white placeholder:text-gray-400 focus:border-orange-400 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
