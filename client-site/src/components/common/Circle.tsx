import React from "react";

interface CircleProps {
  width: number;
  height: number;
  cls?: string;
}

const Circle = ({ width, height, cls }: CircleProps) => {
  return (
    <div
      className={`z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04] ${cls}`}
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        background: "linear-gradient(90deg, #e879f9, #38bdf8)",
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
};

export default Circle;
