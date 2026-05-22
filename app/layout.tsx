import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

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
    <html lang="en" className="h-full">
      <body className="h-full bg-[#1a0808] text-[#f5f0e8] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
