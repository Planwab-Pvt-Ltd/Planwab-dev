import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeClerkProvider from "../lib/ThemeClerkProvider";
import NextTopLoader from "nextjs-toploader";

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
          <link rel="preload" href="/Loading/loading1.mp4" as="video" type="video/mp4" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover"
          />
          <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-50 text-gray-900`}>
            <NextTopLoader
              color="#2563eb" // Your theme blue
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false} // We already have a tab spinner
              easing="ease"
              speed={200}
              shadow="0 0 10px #2563eb,0 0 5px #2563eb"
            />
            {children}
          </body>
        </html>
      </ThemeClerkProvider>
    </ThemeProvider>
  );
}
