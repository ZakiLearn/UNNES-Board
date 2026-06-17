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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://unnes-board.com"),
  title: {
    default: "UNNES-Board - Forum & Marketplace Mahasiswa UNNES",
    template: "%s | UNNES-Board",
  },
  description: "Platform terintegrasi mahasiswa UNNES untuk marketplace, informasi kos, event, dan forum diskusi.",
  keywords: ["UNNES", "Universitas Negeri Semarang", "Marketplace UNNES", "Info Kos UNNES", "Forum Mahasiswa"],
  authors: [{ name: "UNNES-Board" }],
  openGraph: {
    title: "UNNES-Board - Forum & Marketplace Mahasiswa UNNES",
    description: "Platform terintegrasi mahasiswa UNNES untuk marketplace, informasi kos, event, dan forum diskusi.",
    url: "https://unnes-board.com",
    siteName: "UNNES-Board",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UNNES-Board Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNNES-Board - Forum & Marketplace Mahasiswa UNNES",
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
