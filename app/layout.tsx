import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Omar Faruque — Project Manager & Cross-Functional Operator",
  description:
    "Project manager and cross-functional generalist connecting strategy, people, and delivery across technology, operations, and growth.",
  applicationName: "Omar Faruque Portfolio",
  authors: [{ name: "Omar Faruque", url: SITE_URL }],
  creator: "Omar Faruque",
  publisher: "Omar Faruque",
  category: "Portfolio",
  keywords: [
    "Project Manager",
    "Cross-Functional Operator",
    "Generalist",
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
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Omar Faruque — Project Manager & Cross-Functional Operator",
    description:
      "Turning complex ideas into clear, executable projects across technology, operations, and growth.",
    type: "profile",
    locale: "en_US",
    siteName: "Omar Faruque Portfolio",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1730,
        height: 909,
        alt: "Omar Faruque — Project Manager and Cross-Functional Operator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omar Faruque — Project Manager & Cross-Functional Operator",
    description:
      "Turning complex ideas into clear, executable projects across technology, operations, and growth.",
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
