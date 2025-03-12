"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, CreditCard, FileText, Home, Receipt, Settings, Users } from "lucide-react"
import { Logo } from "@/components/logo"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    title: "Banking",
    href: "/banking",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Team",
    href: "/team",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 px-2">
      <Link href="/" className="flex items-center gap-2 px-3 py-2 mb-6">
        <Logo />
        <span className="font-bold text-xl">FinFlow</span>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href || pathname.startsWith(`${item.href}/`)
              ? "bg-accent text-accent-foreground"
              : "transparent",
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

