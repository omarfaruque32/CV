import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;
  const socialImage = new URL("/og.png", baseUrl).toString();

  return {
    title: "Omar Faruque — Project Manager & Cross-Functional Operator",
    description:
      "Project manager and cross-functional generalist connecting strategy, people, and delivery across technology, operations, and growth.",
    authors: [{ name: "Omar Faruque" }],
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
    alternates: { canonical: baseUrl },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Omar Faruque — Project Manager & Cross-Functional Operator",
      description:
        "Turning complex ideas into clear, executable projects across technology, operations, and growth.",
      type: "profile",
      url: baseUrl,
      images: [
        {
          url: socialImage,
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
      images: [socialImage],
    },
  };
}

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
