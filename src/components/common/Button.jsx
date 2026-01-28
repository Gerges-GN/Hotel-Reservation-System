import React from "react";

export const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
}) => {
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50";
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${styles} ${className}`}
    >
      {children}
    </button>
  );
};
