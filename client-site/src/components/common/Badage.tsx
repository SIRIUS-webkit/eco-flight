import React from "react";

interface BadageProps {
  badageColor: string;
  text: string;
}

const Badage = ({ badageColor, text }: BadageProps) => {
  return (
    <p
      className={`inline-flex items-center px-2 py-0.5 rounded-[40px] text-xsm font-bold text-black ${badageColor}`}
    >
      {text}
    </p>
  );
};

export default Badage;
