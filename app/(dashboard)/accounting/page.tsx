"use client"

import { useState } from "react"
import { useAccounting, type AccountType } from "@/lib/accounting-system"
import { useOrganization } from "@/lib/organization-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check, Plus, Search } from "lucide-react"

export default function AccountingPage() {
  const { currentOrganization } = useOrganization()
  const { accounts, transactions, createAccount, createTransaction, getAccountsByType } = useAccounting()

  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false)
  const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // New account form state
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "asset" as AccountType,
    code: "",
  })

  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    reference: "",
    entries: [
      { accountId: "", debit: 0, credit: 0 },
      { accountId: "", debit: 0, credit: 0 },
    ],
  })

  // Filter accounts by organization
  const filteredAccounts = accounts.filter(
    (account) =>
      account.organizationId === currentOrganization?.id &&
      (searchQuery === "" ||
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.code.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Filter transactions by organization
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.organizationId === currentOrganization?.id &&
      (searchQuery === "" ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Handle creating a new account
  const handleCreateAccount = async () => {
    setErrorMessage("")

    try {
      if (!newAccount.name || !newAccount.code) {
        setErrorMessage("Please fill in all required fields")
        return
      }

      await createAccount(newAccount.name, newAccount.type, newAccount.code)

      // Reset form
      setNewAccount({
        name: "",
        type: "asset",
        code: "",
      })

      // Close dialog and show success message
      setIsCreateAccountOpen(false)
      setSuccessMessage("Account created successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      setErrorMessage((error as Error).message || "Failed to create account")
    }
  }

  // Handle creating a new transaction
  const handleCreateTransaction = async () => {
    setErrorMessage("")

    try {
      if (!newTransaction.description || !newTransaction.date) {
        setErrorMessage("Please fill in all required fields")
        return
      }

      // Validate entries
      const hasInvalidEntries = newTransaction.entries.some(
        (entry) => !entry.accountId || (entry.debit === 0 && entry.credit === 0),
      )

      if (hasInvalidEntries) {
        setErrorMessage("All entries must have an account and either a debit or credit amount")
        return
      }

      // Calculate totals
      const totalDebits = newTransaction.entries.reduce((sum, entry) => sum + entry.debit, 0)
      const totalCredits = newTransaction.entries.reduce((sum, entry) => sum + entry.credit, 0)

      if (totalDebits !== totalCredits) {
        setErrorMessage("Transaction is not balanced. Total debits must equal total credits.")
        return
      }

      await createTransaction(
        newTransaction.date,
        newTransaction.description,
        newTransaction.entries,
        newTransaction.reference,
      )

      // Reset form
      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        description: "",
        reference: "",
        entries: [
          { accountId: "", debit: 0, credit: 0 },
          { accountId: "", debit: 0, credit: 0 },
        ],
      })

      // Close dialog and show success message
      setIsCreateTransactionOpen(false)
      setSuccessMessage("Transaction recorded successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      setErrorMessage((error as Error).message || "Failed to record transaction")
    }
  }

  // Add a transaction entry
  const addTransactionEntry = () => {
    setNewTransaction({
      ...newTransaction,
      entries: [...newTransaction.entries, { accountId: "", debit: 0, credit: 0 }],
    })
  }

  // Update a transaction entry
  const updateTransactionEntry = (index: number, field: string, value: string | number) => {
    const updatedEntries = [...newTransaction.entries]

    if (field === "accountId") {
      updatedEntries[index] = {
        ...updatedEntries[index],
        accountId: value as string,
      }
    } else if (field === "debit") {
      const debitValue = Number.parseFloat(value as string) || 0
      updatedEntries[index] = {
        ...updatedEntries[index],
        debit: debitValue,
        // If debit is set, clear credit
        credit: debitValue > 0 ? 0 : updatedEntries[index].credit,
      }
    } else if (field === "credit") {
      const creditValue = Number.parseFloat(value as string) || 0
      updatedEntries[index] = {
        ...updatedEntries[index],
        credit: creditValue,
        // If credit is set, clear debit
        debit: creditValue > 0 ? 0 : updatedEntries[index].debit,
      }
    }

    setNewTransaction({
      ...newTransaction,
      entries: updatedEntries,
    })
  }

  // Remove a transaction entry
  const removeTransactionEntry = (index: number) => {
    if (newTransaction.entries.length <= 2) {
      setErrorMessage("A transaction must have at least two entries")

      return
    }

    const updatedEntries = newTransaction.entries.filter((_, i) => i !== index)

    setNewTransaction({
      ...newTransaction,
      entries: updatedEntries,
    })
  }

  if (!currentOrganization) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Accounting</h1>
        <Card>
          <CardContent className="py-10 text-center">
            <p>Please select or create an organization to manage accounting.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounting</h1>
        <div className="flex items-center gap-2">
          {successMessage && (
            <Alert variant="default" className="w-auto bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <Dialog open={isCreateAccountOpen} onOpenChange={setIsCreateAccountOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
                <DialogDescription>Add a new account to your chart of accounts.</DialogDescription>
              </DialogHeader>
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="e.g. Cash, Accounts Receivable"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select
                      value={newAccount.type}
                      onValueChange={(value) => setNewAccount({ ...newAccount, type: value as AccountType })}
                    >
                      <SelectTrigger id="accountType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asset">Asset</SelectItem>
                        <SelectItem value="liability">Liability</SelectItem>
                        <SelectItem value="equity">Equity</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountCode">Account Code</Label>
                    <Input
                      id="accountCode"
                      placeholder="e.g. 1000, 2000"
                      value={newAccount.code}
                      onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateAccountOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAccount}>Create Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateTransactionOpen} onOpenChange={setIsCreateTransactionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
                <DialogDescription>Record a new financial transaction.</DialogDescription>
              </DialogHeader>
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionDate">Date</Label>
                    <Input
                      id="transactionDate"
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference</Label>
                    <Input
                      id="reference"
                      placeholder="e.g. INV-001, BILL-123"
                      value={newTransaction.reference}
                      onChange={(e) => setNewTransaction({ ...newTransaction, reference: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Transaction description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Entries</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addTransactionEntry}>
                      <Plus className="h-4 w-4 mr-1" /> Add Entry
                    </Button>
                  </div>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-6">
                        <Label className="text-xs">Account</Label>
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Debit</Label>
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Credit</Label>
                      </div>
                    </div>

                    {newTransaction.entries.map((entry, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                          <Select
                            value={entry.accountId}
                            onValueChange={(value) => updateTransactionEntry(index, "accountId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="" disabled>
                                Select an account
                              </SelectItem>
                              <SelectItem value="" disabled className="font-bold">
                                Assets
                              </SelectItem>
                              {getAccountsByType("asset").map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="" disabled className="font-bold">
                                Liabilities
                              </SelectItem>
                              {getAccountsByType("liability").map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="" disabled className="font-bold">
                                Equity
                              </SelectItem>
                              {getAccountsByType("equity").map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="" disabled className="font-bold">
                                Revenue
                              </SelectItem>
                              {getAccountsByType("revenue").map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="" disabled className="font-bold">
                                Expenses
                              </SelectItem>
                              {getAccountsByType("expense").map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            value={entry.debit || ""}
                            onChange={(e) => updateTransactionEntry(index, "debit", e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            disabled={entry.credit > 0}
                          />
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <Input
                            type="number"
                            value={entry.credit || ""}
                            onChange={(e) => updateTransactionEntry(index, "credit", e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            disabled={entry.debit > 0}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTransactionEntry(index)}
                            disabled={newTransaction.entries.length <= 2}
                            className="flex-shrink-0"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-end pt-2 border-t">
                      <div className="grid grid-cols-2 gap-4 text-right">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Debits</p>
                          <p className="text-lg font-bold">
                            ${newTransaction.entries.reduce((sum, entry) => sum + entry.debit, 0).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Credits</p>
                          <p className="text-lg font-bold">
                            ${newTransaction.entries.reduce((sum, entry) => sum + entry.credit, 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateTransactionOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTransaction}>Record Transaction</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative flex-1 mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search accounts or transactions..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="chart-of-accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="journal">General Journal</TabsTrigger>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="chart-of-accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
              <CardDescription>Manage your organization's accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No accounts found. Create your first account to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {/* Assets */}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={4} className="font-bold">
                          Assets
                        </TableCell>
                      </TableRow>
                      {filteredAccounts
                        .filter((account) => account.type === "asset")
                        .map((account) => (
                          <TableRow key={account.id}>
                            <TableCell>{account.code}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell className="capitalize">{account.type}</TableCell>
                            <TableCell className="text-right">${account.balance.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}

                      {/* Liabilities */}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={4} className="font-bold">
                          Liabilities
                        </TableCell>
                      </TableRow>
                      {filteredAccounts
                        .filter((account) => account.type === "liability")
                        .map((account) => (
                          <TableRow key={account.id}>
                            <TableCell>{account.code}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell className="capitalize">{account.type}</TableCell>
                            <TableCell className="text-right">${account.balance.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}

                      {/* Equity */}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={4} className="font-bold">
                          Equity
                        </TableCell>
                      </TableRow>
                      {filteredAccounts
                        .filter((account) => account.type === "equity")
                        .map((account) => (
                          <TableRow key={account.id}>
                            <TableCell>{account.code}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell className="capitalize">{account.type}</TableCell>
                            <TableCell className="text-right">${account.balance.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}

                      {/* Revenue */}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={4} className="font-bold">
                          Revenue
                        </TableCell>
                      </TableRow>
                      {filteredAccounts
                        .filter((account) => account.type === "revenue")
                        .map((account) => (
                          <TableRow key={account.id}>
                            <TableCell>{account.code}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell className="capitalize">{account.type}</TableCell>
                            <TableCell className="text-right">${account.balance.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}

                      {/* Expenses */}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={4} className="font-bold">
                          Expenses
                        </TableCell>
                      </TableRow>
                      {filteredAccounts
                        .filter((account) => account.type === "expense")
                        .map((account) => (
                          <TableRow key={account.id}>
                            <TableCell>{account.code}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell className="capitalize">{account.type}</TableCell>
                            <TableCell className="text-right">${account.balance.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>View all financial transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No transactions found. Record your first transaction to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      // Calculate transaction amount (sum of all debits or credits)
                      const amount = transaction.entries.reduce((sum, entry) => sum + entry.debit, 0)

                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Journal</CardTitle>
              <CardDescription>View detailed journal entries.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No journal entries found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.flatMap((transaction) => [
                      // Transaction header
                      <TableRow key={`${transaction.id}-header`} className="bg-muted/30">
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell colSpan={4}>
                          <span className="font-medium">{transaction.description}</span>
                          {transaction.reference && (
                            <span className="text-muted-foreground ml-2">({transaction.reference})</span>
                          )}
                        </TableCell>
                      </TableRow>,
                      // Transaction entries
                      ...transaction.entries.map((entry, index) => {
                        const account = accounts.find((a) => a.id === entry.accountId)

                        return (
                          <TableRow key={`${transaction.id}-entry-${index}`}>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className={entry.debit > 0 ? "pl-8" : ""}>
                              {account?.name || "Unknown Account"}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : ""}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : ""}
                            </TableCell>
                          </TableRow>
                        )
                      }),
                    ])
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Ledger</CardTitle>
              <CardDescription>View account activity and balances.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-6">
                  <p>No accounts found.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredAccounts.map((account) => {
                    // Get all transactions that involve this account
                    const accountTransactions = filteredTransactions.filter((transaction) =>
                      transaction.entries.some((entry) => entry.accountId === account.id),
                    )

                    if (accountTransactions.length === 0) return null

                    return (
                      <div key={account.id} className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {account.code} - {account.name}
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Reference</TableHead>
                              <TableHead className="text-right">Debit</TableHead>
                              <TableHead className="text-right">Credit</TableHead>
                              <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell colSpan={5} className="font-medium">
                                Opening Balance
                              </TableCell>
                              <TableCell className="text-right">$0.00</TableCell>
                            </TableRow>
                            {accountTransactions.map((transaction) => {
                              const entry = transaction.entries.find((e) => e.accountId === account.id)
                              if (!entry) return null

                              return (
                                <TableRow key={`${account.id}-${transaction.id}`}>
                                  <TableCell>{transaction.date}</TableCell>
                                  <TableCell>{transaction.description}</TableCell>
                                  <TableCell>{transaction.reference}</TableCell>
                                  <TableCell className="text-right">
                                    {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : ""}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : ""}
                                  </TableCell>
                                  <TableCell className="text-right">${account.balance.toFixed(2)}</TableCell>
                                </TableRow>
                              )
                            })}
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={5} className="font-medium">
                                Ending Balance
                              </TableCell>
                              <TableCell className="text-right font-bold">${account.balance.toFixed(2)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

