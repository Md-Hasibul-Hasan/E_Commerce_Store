import React from "react";

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center gap-1">
      
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3"
            fill={
              value >= star
                ? "#f97316" // full
                : value >= star - 0.5
                ? "#fb923c" // half-like color
                : "#374151" // empty
            }
          >
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.845L19.335 24 12 20.201 4.665 24 6 15.593 0 9.748l8.332-1.73z" />
          </svg>
        </span>
      ))}

      {/* Text */}
      {text && (
        <span className="text-xs text-gray-400 ml-1">
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;