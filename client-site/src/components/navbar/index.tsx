"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { classNames } from "@/utils/common";
import { usePathname } from "next/navigation";
import Button from "../common/Button";

const Navbar: () => React.JSX.Element = () => {
  const loggedIn = false;
  const [walletAddress, setWalletAddress] = useState("");
  const pathname = usePathname();
  console.log(pathname);
  const login = () => {};
  const logout = () => {};

  return (
    <div className="navbar px-9 bg-[#09090b]">
      <div className="navbar-start">
        <Link href="/">
          <Image
            src="/logo-white.png"
            width={120}
            height={100}
            quality={90}
            style={{ objectFit: "contain" }}
            alt="eco-fly"
          />
        </Link>
      </div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal px-4">
          <li>
            <Link href="/projects">
              <p
                className={classNames(
                  pathname === "/projects" ? "text-primary" : "text-white",
                  "p2 font-bold"
                )}
              >
                Projects
              </p>
            </Link>
          </li>
          <li>
            <Link href="/create-project" className="text-white">
              <p
                className={classNames(
                  pathname === "/create-project"
                    ? "text-primary"
                    : "text-white",
                  "p2 font-bold"
                )}
              >
                Create Projects
              </p>
            </Link>
          </li>
          <li>
            <Link href="/carbon-offset" className="text-white">
              <p
                className={classNames(
                  pathname === "/carbon-offset" ? "text-primary" : "text-white",
                  "p2 font-bold"
                )}
              >
                Carbon Offset
              </p>
            </Link>
          </li>
        </ul>

        {!loggedIn ? (
          <Button
            cls="btn btn-primary text-white"
            text="Log In"
            onClick={login}
          />
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-secondary">
              {walletAddress
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : "Wallet"}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-md w-52"
            >
              <li>
                <Link href="/account">Profile</Link>
              </li>
              <li>
                <a onClick={logout}>Log Out</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
