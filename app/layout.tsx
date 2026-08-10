import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const configuredUrl = new URL(getSiteUrl());
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || configuredUrl.host;
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : configuredUrl.protocol.replace(":", ""));
  const origin = `${protocol}://${host}`;
  const socialImage = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "The Dunedin Herald — Ōtepoti satire",
      template: "%s | The Dunedin Herald",
    },
    description: "Dunedin's least reliable source of local news. Parody and satire from Ōtepoti.",
    icons: {
      icon: "/brand-mark.jpg",
      shortcut: "/brand-mark.jpg",
    },
    openGraph: {
      title: "The Dunedin Herald",
      description: "Alternative truths from the bottom of the South.",
      type: "website",
      locale: "en_NZ",
      images: [{ url: socialImage, width: 1733, height: 909, alt: "The Dunedin Herald — alternative truths from the bottom of the South" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Dunedin Herald",
      description: "Alternative truths from the bottom of the South.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NZ">
      <body>{children}</body>
    </html>
  );
}
