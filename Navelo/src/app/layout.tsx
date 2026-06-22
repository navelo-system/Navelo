import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import { RegistryProvider } from "@/components/store/base/registry-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Navelo",
  description: "Navelo Design System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-theme-scope="master">
      <body className={`${inter.variable} ${ibmPlexMono.variable}`}>
        <RegistryProvider>{children}</RegistryProvider>
      </body>
    </html>
  );
}