"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardNav } from "@/components/dashboard-nav"
import { Logo } from "@/components/logo"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <DashboardNav />
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center gap-2 ml-2">
        <Logo />
        <span className="font-bold text-xl">FinFlow</span>
      </Link>
    </div>
  )
}

