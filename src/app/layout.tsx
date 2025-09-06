import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "V'imo Dashboard",
  description: "V'imo Dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center min-h-screen">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
