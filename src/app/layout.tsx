import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NavMenu } from "@/components/navigation/NavMenu";

export const metadata: Metadata = {
  title: "V'imo Dashboard",
  description: "V'imo Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center min-h-screen">
        <header className="hidden md:block w-full border-b">
          <nav className=" flex h-16 items-center justify-center !w-full">
            <NavMenu />
          </nav>
        </header>
        <main className="flex-1 w-full pb-20 md:pb-0 flex flex-col items-center m-2">{children}</main>
        <footer className="md:hidden w-full border-t fixed bottom-0 bg-background z-50">
          <nav className="container flex h-16 items-center justify-center w-full">
            <NavMenu />
          </nav>
        </footer>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
