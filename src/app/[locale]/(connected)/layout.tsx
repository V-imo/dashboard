import type { Metadata } from "next";
import { NavMenu } from "@/components/navigation/nav-menu";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session ) {
    return redirect("/login");
  }
  return (
    <>
      <header className="w-full border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="flex h-14 md:h-16 items-center w-full px-3 md:px-4">
          <div className="flex-shrink-0 flex items-center gap-2.5 pr-4 border-r border-primary/20 mr-3">
            <Image
              src="/logo.png"
              alt="V'imo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-primary text-lg tracking-tight hidden sm:block">
              V&apos;imo
            </span>
          </div>
          <NavMenu />
        </nav>
      </header>
      <main className="flex-1 w-full flex flex-col items-center px-4 py-8">
        {children}
      </main>
    </>
  );
}
