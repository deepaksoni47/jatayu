import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jatayu App",
  description: "Created with Jatayu - Unified Marine Data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha512-m0R3r1l4v6c1gVwqQkIYV9S1b/VQ6oS+OQq8bYkJwLqzM7fKpR/HGq1f3M3b5uWcYv1jz4QmQ9X1f9mP6Cq2uw=="
          crossOrigin=""
        />
        <meta name="theme-color" content="#0a2342" />
      </head>
      <body className="font-sans bg-background text-foreground app-canvas">
        <Suspense fallback={<div>Loading...</div>}>
          <main>{children}</main>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
