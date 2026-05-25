import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "St. Lodovico Pavoni - Member Portal",
  description: "Member portal for St. Lodovico Pavoni church",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
      <body className="h-full bg-[#1a0808] text-[#f5f0e8] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
