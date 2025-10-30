import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Section from "@/components/Section/Section";
import RootLayoutClient from "./RootLayoutClient";
import { AvatarProvider } from "@/context/AvatarContext";
import { NameProvider } from "@/context/NameContext";
import ThemeProvider from "@/context/ThemeContext";
import { ConnectionProvider } from "@/context/ConnectionContext";
import { FileProgressProvider } from "@/context/FileProgressContext";

export const metadata: Metadata = {
  title: "PeerBeam",
  description:
    " A blazing-fast, peer-to-peer file transfer web app powered by WebRTC,",
  keywords: [
    "PeerBeam",
    "file transfer",
    "peer-to-peer",
    "WebRTC",
    "PWA",
    "QR code",
    "Next.js",
    "Tailwind CSS",
    "react-qr-code",
    "responsive design",
    "offline ready",
    "zero internet dependency",
    "local network sharing",
    "no cloud storage",
    "progressive web app",
    "web app",
    "browser-based file sharing",
    "fast file transfer",
    "secure file sharing",
    "easy file sharing",
    "cross-platform file sharing",
    "device discovery",
    "file sharing app",
    "file sharing website",
    "file sharing solution",
    "file sharing service",
    "file sharing technology",
    "file sharing platform",
    "file sharing system",
    "file sharing tool",
    "file sharing protocol",
    "file sharing technology",
    "file sharing with WebRTC",
  ],
  authors: [
    {
      name: "PeerBeam Team",
      url: "",
    },
  ],
  manifest: "/web.manifest.json",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-auto flex flex-col`}
      >
        <RootLayoutClient>
          <ConnectionProvider>
            <AvatarProvider>
              <NameProvider>
                <ThemeProvider>
                  <FileProgressProvider>
                    <Header />
                    <div className="relative flex flex-1 h-screen overflow-hidden">
                      <Section />
                      <main className="relative flex-1 overflow-auto">
                        {children}
                      </main>
                    </div>
                  </FileProgressProvider>
                </ThemeProvider>
              </NameProvider>
            </AvatarProvider>
          </ConnectionProvider>
        </RootLayoutClient>
      </body>
    </html>
  );
}
