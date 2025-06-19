import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import AuthWrapper from "@/components/wrapper/AuthWrapper";
import { ToastProvider } from "@/provider/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AquaPulse",
  description: "Supplier Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastProvider>
          <AuthWrapper>
            <Navbar />
            {children}
            <Footer />
          </AuthWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
