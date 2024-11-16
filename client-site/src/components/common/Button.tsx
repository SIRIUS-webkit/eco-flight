"use client";
import React from "react";
import Link from "next/link";

interface ButtonProps {
  text: string;
  cls?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  linkTag?: boolean;
  link?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  cls = "",
  type = "button",
  onClick,
  linkTag = false,
  link = "/",
  disabled = false,
}) => {
  return (
    <div>
      {linkTag ? (
        <Link href={link} passHref>
          <p className={cls}>{text}</p>
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          className={cls}
          disabled={disabled}
        >
          <p className="p2 text-white">{text}</p>
        </button>
      )}
    </div>
  );
};

export default Button;
