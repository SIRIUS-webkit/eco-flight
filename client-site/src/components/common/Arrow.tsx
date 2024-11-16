import React from "react";

type ArrowProps = {
  bgColor?: string;
  size?: string;
  rotationClass?: string;
};

const Arrow: React.FC<ArrowProps> = ({
  bgColor = "bg-salmon-pink",
  size = "w-7 h-7",
  rotationClass = "rotate-0",
}) => {
  const bgColorMap: { [key: string]: string } = {
    "bg-salmon-blue": "#35b9ff",
    "bg-yellow": "#ffdc59",
    "bg-fuchsia": "#e879f9",
    "bg-ether": "#fe4e5b",
  };

  const fillColor = bgColorMap[bgColor] || "#6b7280";

  return (
    <div className={`inline-block transform  ${rotationClass} ${size} p-1`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill={fillColor}
      >
        <path d="m28.91 4.417-11 24a1 1 0 0 1-1.907-.334l-.93-11.157-11.156-.93a1 1 0 0 1-.334-1.906l24-11a1 1 0 0 1 1.326 1.326z" />
      </svg>
    </div>
  );
};

export default Arrow;
