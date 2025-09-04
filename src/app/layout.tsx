import type { Metadata } from "next"
import "./globals.css"

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
      <body>{children}</body>
    </html>
  )
}
