import React from "react";

export const Badge = ({ children, color }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${color}`}>
    {children}
  </span>
);
