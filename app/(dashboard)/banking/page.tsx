"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrganization } from "@/lib/organization-provider"
import { CreditCard, LinkIcon, RefreshCw } from "lucide-react"

export default function BankingPage() {
  const { currentOrganization } = useOrganization()
  const [accounts, setAccounts] = useState([
    {
      id: "1",
      name: "Business Checking",
      type: "checking",
      balance: 12450.75,
      institution: "Chase Bank",
      lastSync: "2023-01-25",
      status: "connected",
    },
    {
      id: "2",
      name: "Business Savings",
      type: "savings",
      balance: 45000.0,
      institution: "Chase Bank",
      lastSync: "2023-01-25",
      status: "connected",
    },
    {
      id: "3",
      name: "Credit Card",
      type: "credit",
      balance: -2340.5,
      institution: "American Express",
      lastSync: "2023-01-24",
      status: "connected",
    },
  ])

  const [transactions, setTransactions] = useState([
    {
      id: "1",
      date: "2023-01-25",
      description: "Client Payment - ABC Corp",
      amount: 5000.0,
      type: "deposit",
      account: "Business Checking",
      category: "Income",
      status: "cleared",
    },
    {
      id: "2",
      date: "2023-01-24",
      description: "Office Supplies - Staples",
      amount: -125.5,
      type: "expense",
      account: "Business Checking",
      category: "Office Supplies",
      status: "cleared",
    },
    {
      id: "3",
      date: "2023-01-23",
      description: "Monthly Subscription - Adobe",
      amount: -52.99,
      type: "expense",
      account: "Credit Card",
      category: "Software",
      status: "cleared",
    },
    {
      id: "4",
      date: "2023-01-22",
      description: "Client Payment - XYZ Inc",
      amount: 3500.0,
      type: "deposit",
      account: "Business Checking",
      category: "Income",
      status: "cleared",
    },
    {
      id: "5",
      date: "2023-01-21",
      description: "Utility Bill - Electric",
      amount: -145.3,
      type: "expense",
      account: "Business Checking",
      category: "Utilities",
      status: "pending",
    },
  ])

  if (!currentOrganization) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Banking</h1>
        <Card>
          <CardContent className="py-10 text-center">
            <p>Please select or create an organization to manage banking.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Banking</h1>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Connect Bank Account</DialogTitle>
                <DialogDescription>Connect your bank account to automatically import transactions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Financial Institution</Label>
                  <Select>
                    <SelectTrigger id="institution">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chase">Chase Bank</SelectItem>
                      <SelectItem value="bofa">Bank of America</SelectItem>
                      <SelectItem value="wells">Wells Fargo</SelectItem>
                      <SelectItem value="citi">Citibank</SelectItem>
                      <SelectItem value="amex">American Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select>
                    <SelectTrigger id="accountType">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name (Optional)</Label>
                  <Input id="accountName" placeholder="e.g. Business Checking" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to your bank's website to securely connect your account.
                </p>
              </div>
              <DialogFooter>
                <Button type="submit">Continue to Bank</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected bank accounts and credit cards.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell className="capitalize">{account.type}</TableCell>
                      <TableCell>{account.institution}</TableCell>
                      <TableCell className={account.balance < 0 ? "text-destructive" : ""}>
                        ${Math.abs(account.balance).toFixed(2)}
                        {account.balance < 0 && " (Credit)"}
                      </TableCell>
                      <TableCell>{account.lastSync}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>Overview of your financial accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Cash</p>
                  <p className="text-2xl font-bold">
                    $
                    {accounts
                      .filter((a) => a.type === "checking" || a.type === "savings")
                      .reduce((sum, account) => sum + account.balance, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Credit</p>
                  <p className="text-2xl font-bold text-destructive">
                    $
                    {Math.abs(
                      accounts.filter((a) => a.type === "credit").reduce((sum, account) => sum + account.balance, 0),
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Net Worth</p>
                  <p className="text-2xl font-bold">
                    ${accounts.reduce((sum, account) => sum + account.balance, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View and categorize your recent bank transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{transaction.account}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className={transaction.amount < 0 ? "text-destructive" : "text-green-600"}>
                        {transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.status === "cleared" ? "outline" : "secondary"}
                          className="capitalize"
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Reconciliation</CardTitle>
              <CardDescription>Reconcile your accounts with bank statements.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Start Reconciliation</p>
                      <p className="text-sm text-muted-foreground">
                        Compare your records with your bank statement to ensure accuracy.
                      </p>
                    </div>
                    <Button className="ml-auto">Start</Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  No reconciliation in progress. Select an account and start reconciliation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

