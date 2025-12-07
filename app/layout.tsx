import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AnimeProvider } from "@/app/context/AnimeContext";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AniVault",
  description: "Discover and Favorite Your Top Anime Picks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AnimeProvider>
      <html lang="en">
        <body className={`${geistSans.variable}  antialiased bg-[#f9f2e8]`}>
          <Header />
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="mt-16 lg:mx-12">{children}</div>
          </div>
          <Analytics />
        </body>
      </html>
    </AnimeProvider>
  );
}
