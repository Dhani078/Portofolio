import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mrr-dev.vercel.app'),
  title: "Muhammad Rizki Ramadhani — Full-Stack Software Engineer",
  description: "Portofolio resmi Muhammad Rizki Ramadhani — Mahasiswa Teknik Informatika UNISKA Banjarmasin & Full-Stack Software Engineer spesialis Next.js 16, React 19, TypeScript, dan Supabase / PostgreSQL.",
  keywords: [
    "Muhammad Rizki Ramadhani",
    "MRR.DEV",
    "Web Developer Banjarmasin",
    "Full-Stack Developer Indonesia",
    "Next.js 16",
    "React 19",
    "TypeScript",
    "UNISKA Banjarmasin",
  ],
  authors: [{ name: "Muhammad Rizki Ramadhani" }],
  openGraph: {
    title: "Muhammad Rizki Ramadhani — Full-Stack Software Engineer",
    description: "Portofolio rekayasa web modern, sistem skala produksi, dan arsitektur database performa tinggi.",
    url: "https://mrr-dev.vercel.app",
    siteName: "MRR.DEV",
    images: [
      {
        url: "/mrr.jpg",
        width: 800,
        height: 1067,
        alt: "Muhammad Rizki Ramadhani Portrait",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Rizki Ramadhani — Full-Stack Software Engineer",
    description: "Full-Stack Software Engineer & Mahasiswa Teknik Informatika UNISKA Banjarmasin.",
    images: ["/mrr.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Muhammad Rizki Ramadhani",
  "alternateName": "MRR.DEV",
  "url": "https://mrr-dev.vercel.app",
  "image": "https://mrr-dev.vercel.app/mrr.jpg",
  "jobTitle": "Full-Stack Software Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance & Independent Engineering"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Universitas Islam Kalimantan Muhammad Arsyad Al Banjari (UNISKA) Banjarmasin"
  },
  "knowsAbout": [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "PostgreSQL",
    "Full-Stack Web Engineering"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Banjarmasin",
    "addressRegion": "Kalimantan Selatan",
    "addressCountry": "ID"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`scroll-smooth dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="relative bg-[#080A0F] text-[#F8FAFC] min-h-screen antialiased selection:bg-sky-400 selection:text-black font-sans"
      >
        {children}
      </body>
    </html>
  );
}
