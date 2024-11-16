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
}

const Button: React.FC<ButtonProps> = ({
  text,
  cls = "",
  type = "button",
  onClick,
  linkTag = false,
  link = "/",
}) => {
  return (
    <div>
      {linkTag ? (
        <Link href={link} passHref>
          <p className={cls}>{text}</p>
        </Link>
      ) : (
        <button type={type} onClick={onClick} className={cls}>
          <p className="p2">{text}</p>
        </button>
      )}
    </div>
  );
};

export default Button;
