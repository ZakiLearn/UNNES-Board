import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://unnesboard.com"),
  title: {
    default: "Unnesboard - Forum & Marketplace Mahasiswa UNNES",
    template: "%s | Unnesboard",
  },
  description: "Platform terintegrasi mahasiswa UNNES untuk marketplace, informasi kos, event, dan forum diskusi.",
  keywords: ["UNNES", "Universitas Negeri Semarang", "Marketplace UNNES", "Info Kos UNNES", "Forum Mahasiswa"],
  authors: [{ name: "Unnesboard" }],
  openGraph: {
    title: "Unnesboard - Forum & Marketplace Mahasiswa UNNES",
    description: "Platform terintegrasi mahasiswa UNNES untuk marketplace, informasi kos, event, dan forum diskusi.",
    url: "https://unnesboard.com",
    siteName: "Unnesboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Unnesboard Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unnesboard - Forum & Marketplace Mahasiswa UNNES",
    description: "Platform terintegrasi mahasiswa UNNES untuk marketplace, informasi kos, event, dan forum diskusi.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
