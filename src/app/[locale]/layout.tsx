import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NavMenu } from "@/components/navigation/nav-menu";
import { NextIntlClientProvider } from "next-intl";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextIntlClientProvider>
      <html lang="en">
        <body className="flex flex-col items-center min-h-screen">
          <header className="w-full border-b">
            <nav className="flex h-16 items-center !w-full">
              <NavMenu />
            </nav>
          </header>
          <main className="flex-1 w-full flex flex-col items-center m-2">
            {children}
          </main>
          <Toaster position="bottom-right" />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
