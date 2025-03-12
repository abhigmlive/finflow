"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Logo } from "@/components/logo"

export function MainNav() {
  return (
    <div className="flex items-center gap-6">
      <Link href="/" className="flex items-center gap-2">
        <Logo />
        <span className="font-bold text-xl">FinFlow</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mt-4 mb-2 text-lg font-medium text-white">FinFlow</div>
                      <p className="text-sm leading-tight text-white/90">
                        Accounting software made for small businesses and sole traders.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/features/invoicing" title="Invoicing">
                  Create and send professional invoices in seconds
                </ListItem>
                <ListItem href="/features/expenses" title="Expenses">
                  Track and manage your business expenses
                </ListItem>
                <ListItem href="/features/reporting" title="Reporting">
                  Get insights with powerful financial reports
                </ListItem>
                <ListItem href="/features/banking" title="Banking">
                  Connect your bank accounts for real-time updates
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/pricing" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem href="/resources/blog" title="Blog">
                  Latest news and articles
                </ListItem>
                <ListItem href="/resources/help-center" title="Help Center">
                  Guides and support resources
                </ListItem>
                <ListItem href="/resources/webinars" title="Webinars">
                  Educational webinars and training
                </ListItem>
                <ListItem href="/resources/community" title="Community">
                  Join our community of users
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

