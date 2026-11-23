import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";
import Analytics from "@/components/Analytics";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "HEART Score Economic Model (HEART, HEART-AI)",
  description:
    "HEART Score Economic Model (HEART, HEART-AI): a human-centred country index ranking economies on economic resilience and household affordability. Humans Lead With Dignity, Systems Power The Decisions.",
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/favicon-180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <LayoutClient>{children}</LayoutClient>
        <Analytics />
      </body>
    </html>
  );
}
