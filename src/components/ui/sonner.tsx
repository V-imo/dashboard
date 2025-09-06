"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // Success toasts
          "--success-bg":
            "color-mix(in oklch, var(--success) 12%, transparent)",
          "--success-text": "var(--success-foreground)",
          "--success-border":
            "color-mix(in oklch, var(--success) 40%, var(--border))",
          // Warning toasts
          "--warning-bg":
            "color-mix(in oklch, var(--warning) 12%, transparent)",
          "--warning-text": "var(--warning-foreground)",
          "--warning-border":
            "color-mix(in oklch, var(--warning) 40%, var(--border))",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
