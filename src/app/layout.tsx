import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "V'imo Dashboard",
  description: "V'imo Dashboard",
  icons: {
    icon: [
      { url: "/icon-black.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-white.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export const revalidate = 60;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextIntlClientProvider>
      <Providers>
        <html lang="en">
          <body className="flex flex-col items-center min-h-screen">
            {children}
            <Toaster position="bottom-right" />
          </body>
        </html>
      </Providers>
    </NextIntlClientProvider>
  );
}
