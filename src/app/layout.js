import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeClerkProvider from "../lib/ThemeClerkProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PlanWAB - Events Planning Made Easy",
  description: "Your one-stop solution for planning Weddings, Anniversaries, and Birthdays.",
};

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <ThemeClerkProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-50 text-gray-900`}>
            {children}
          </body>
        </html>
      </ThemeClerkProvider>
    </ThemeProvider>
  );
}
