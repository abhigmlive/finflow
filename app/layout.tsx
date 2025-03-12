import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import { OrganizationProvider } from "@/lib/organization-provider"
import { AccountingProvider } from "@/lib/accounting-system"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FinFlow - Accounting Software for Small Businesses",
  description: "Manage your finances with ease using FinFlow accounting software",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <OrganizationProvider>
            <AccountingProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                {children}
              </ThemeProvider>
            </AccountingProvider>
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'