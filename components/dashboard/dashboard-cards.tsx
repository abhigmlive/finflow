"use client"

import { useOrganization } from "@/lib/organization-provider"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CreditCard, DollarSign, FileText, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function DashboardCards() {
  const { currentOrganization } = useOrganization()
  const router = useRouter()

  // Organization-specific stats
  const stats = {
    revenue: currentOrganization?.id === "1" ? 45231.89 : 32450.65,
    revenueChange: currentOrganization?.id === "1" ? 20.1 : 15.3,
    invoices: currentOrganization?.id === "1" ? 6354.12 : 4250.8,
    invoicesChange: currentOrganization?.id === "1" ? 12.5 : 8.2,
    expenses: currentOrganization?.id === "1" ? 12234.56 : 8750.25,
    expensesChange: currentOrganization?.id === "1" ? -4.3 : -2.8,
    clients: currentOrganization?.id === "1" ? 24 : 16,
    clientsChange: currentOrganization?.id === "1" ? 2 : 1,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">+{stats.revenueChange}% from last month</p>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="h-8 w-full justify-start px-0 text-xs"
            onClick={() => router.push("/reports")}
          >
            View details
            <ArrowRightIcon className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.invoices.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive flex items-center">
              <ArrowUpIcon className="mr-1 h-3 w-3" />+{stats.invoicesChange}% from last month
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="h-8 w-full justify-start px-0 text-xs"
            onClick={() => router.push("/invoices")}
          >
            View invoices
            <ArrowRightIcon className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.expenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              <ArrowDownIcon className="mr-1 h-3 w-3" />
              {stats.expensesChange}% from last month
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="h-8 w-full justify-start px-0 text-xs"
            onClick={() => router.push("/expenses")}
          >
            View expenses
            <ArrowRightIcon className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.clients}</div>
          <p className="text-xs text-muted-foreground">+{stats.clientsChange} new clients this month</p>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="h-8 w-full justify-start px-0 text-xs"
            onClick={() => router.push("/clients")}
          >
            View clients
            <ArrowRightIcon className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

