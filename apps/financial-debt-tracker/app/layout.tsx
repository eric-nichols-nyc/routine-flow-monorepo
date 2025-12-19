import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@repo/design-system/styles/globals.css";
import { createClient } from "@/utils/supabase/server";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import { Providers } from "@/providers/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Financial Tracker",
    template: "%s | Financial Tracker",
  },
  description:
    "Track your finances, manage debt, and achieve financial freedom.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Layout - User:", user?.email ?? "not logged in");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
