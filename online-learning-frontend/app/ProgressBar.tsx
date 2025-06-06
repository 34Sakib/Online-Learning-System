"use client";

import React from "react";

export default function ProgressBar({ progress, color, className = "" }: { progress: number; color: string; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`${color} h-2.5 rounded-full`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
