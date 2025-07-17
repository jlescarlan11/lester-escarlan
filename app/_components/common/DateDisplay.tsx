"use client";
import React from "react";

interface DateDisplayProps {
  date: string | Date;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date }) => {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;

  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();

  return <span>{`${month} ${year}`}</span>;
};

export default DateDisplay;
