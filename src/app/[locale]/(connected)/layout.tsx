import type { Metadata } from "next";
import { NavMenu } from "@/components/navigation/nav-menu";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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
      <header className="w-full border-b">
        <nav className="flex h-16 items-center !w-full">
          <NavMenu />
        </nav>
      </header>
      <main className="flex-1 w-full flex flex-col items-center m-2">
        {children}
      </main>
    </>
  );
}
