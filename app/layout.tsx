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
    title: "Omar Faruque — Senior Tech Project Manager",
    description:
      "Senior Project Manager specialising in AI, SaaS, GovTech delivery, cross-functional execution, and compliance-critical platforms.",
    authors: [{ name: "Omar Faruque" }],
    keywords: [
      "Senior Project Manager",
      "AI Delivery",
      "GovTech",
      "SaaS",
      "Technical Project Manager",
    ],
    alternates: { canonical: baseUrl },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Omar Faruque — Senior Tech Project Manager",
      description: "AI, GovTech, and cross-functional delivery.",
      type: "profile",
      url: baseUrl,
      images: [
        {
          url: socialImage,
          width: 1734,
          height: 907,
          alt: "Omar Faruque — Senior Tech Project Manager",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Omar Faruque — Senior Tech Project Manager",
      description: "AI, GovTech, and cross-functional delivery.",
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
