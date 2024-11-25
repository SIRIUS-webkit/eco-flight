import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import ClientProvider from "@/components/common/ClientProvider";
import Footer from "@/components/common/Footer";

const space_gro = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "EcoFly | Offset Your Flight Emissions",
  description:
    "Offset your flight emissions and earn rewards with EcoFly. Calculate your carbon footprint, contribute to verified green projects, and track your impact—all with the power of blockchain. Join us in making air travel sustainable, one flight at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${space_gro.className}  antialiased`}>
        <ClientProvider>
          <main className="flex flex-col min-h-screen w-full">
            <header className="flex-none">
              <Navbar />
            </header>
            <section className="flex-grow">{children}</section>
            <footer className="flex-none">
              <Footer />
            </footer>
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}
