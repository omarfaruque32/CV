import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Omar Faruque — Technical Project Manager",
  description:
    "Technical project manager coordinating AI, GovTech, SaaS, QA, and cross-functional delivery across distributed teams.",
  applicationName: "Omar Faruque Portfolio",
  authors: [{ name: "Omar Faruque", url: SITE_URL }],
  creator: "Omar Faruque",
  publisher: "Omar Faruque",
  category: "Portfolio",
  keywords: [
    "Project Manager",
    "Technical Project Manager",
    "AI Delivery",
    "GovTech",
    "SaaS",
    "Digital Strategy",
    "Cross-Functional Leadership",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "FMBDw3l-BjmCyd3XsIGQV_9O6sS4fAkP0MC6OCR62_0",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Omar Faruque — Technical Project Manager",
    description:
      "Coordinating AI, GovTech, SaaS, QA, and cross-functional delivery across distributed teams.",
    type: "profile",
    locale: "en_US",
    siteName: "Omar Faruque Portfolio",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1730,
        height: 909,
        alt: "Omar Faruque — Technical Project Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omar Faruque — Technical Project Manager",
    description:
      "Coordinating AI, GovTech, SaaS, QA, and cross-functional delivery across distributed teams.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#f4f1e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
