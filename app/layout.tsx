import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartSidebar } from "@/components/layout/CartSidebar";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "SloPeps — Premium Research Peptides",
  description: "Premium research peptides with >99% purity. HPLC and MS verified. Free shipping over €200.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <body
        className={`${montserrat.variable} ${openSans.variable} antialiased`}
        style={{
          fontFamily: "var(--font-opensans), Helvetica Neue, Arial, sans-serif",
          background: "#0a0a0a",
          color: "#fff",
        }}
      >
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <CartSidebar />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
