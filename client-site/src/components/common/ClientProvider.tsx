"use client";
import React from "react";
import { Web3AuthProvider } from "../../utils/Web3AuthContext";

function ClientProvider({ children }: any) {
  return <Web3AuthProvider>{children}</Web3AuthProvider>;
}

export default ClientProvider;
