"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useOrganization } from "./organization-provider"

// Account types
export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense"

// Account structure
export type Account = {
  id: string
  name: string
  type: AccountType
  code: string
  balance: number
  organizationId: string
}

// Transaction structure
export type Transaction = {
  id: string
  date: string
  description: string
  entries: {
    accountId: string
    debit: number
    credit: number
  }[]
  reference: string
  organizationId: string
}

// Context type
type AccountingContextType = {
  accounts: Account[]
  transactions: Transaction[]
  loading: boolean
  createAccount: (name: string, type: AccountType, code: string) => Promise<void>
  updateAccount: (id: string, data: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  createTransaction: (
    date: string,
    description: string,
    entries: { accountId: string; debit: number; credit: number }[],
    reference: string,
  ) => Promise<void>
  getAccountBalance: (accountId: string) => number
  getAccountsByType: (type: AccountType) => Account[]
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined)

export function AccountingProvider({ children }: { children: React.ReactNode }) {
  const { currentOrganization } = useOrganization()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize with sample data
  useEffect(() => {
    // In a real app, this would be an API call
    const sampleAccounts: Account[] = [
      // Assets
      { id: "1", name: "Cash", type: "asset", code: "1000", balance: 10000, organizationId: "1" },
      { id: "2", name: "Accounts Receivable", type: "asset", code: "1100", balance: 5000, organizationId: "1" },
      { id: "3", name: "Inventory", type: "asset", code: "1200", balance: 7500, organizationId: "1" },
      { id: "4", name: "Equipment", type: "asset", code: "1300", balance: 15000, organizationId: "1" },

      // Liabilities
      { id: "5", name: "Accounts Payable", type: "liability", code: "2000", balance: 3000, organizationId: "1" },
      { id: "6", name: "Loans Payable", type: "liability", code: "2100", balance: 10000, organizationId: "1" },

      // Equity
      { id: "7", name: "Owner's Equity", type: "equity", code: "3000", balance: 20000, organizationId: "1" },
      { id: "8", name: "Retained Earnings", type: "equity", code: "3100", balance: 4500, organizationId: "1" },

      // Revenue
      { id: "9", name: "Sales Revenue", type: "revenue", code: "4000", balance: 25000, organizationId: "1" },
      { id: "10", name: "Service Revenue", type: "revenue", code: "4100", balance: 15000, organizationId: "1" },

      // Expenses
      { id: "11", name: "Rent Expense", type: "expense", code: "5000", balance: 2000, organizationId: "1" },
      { id: "12", name: "Utilities Expense", type: "expense", code: "5100", balance: 750, organizationId: "1" },
      { id: "13", name: "Salaries Expense", type: "expense", code: "5200", balance: 8000, organizationId: "1" },

      // Organization 2 accounts
      { id: "14", name: "Cash", type: "asset", code: "1000", balance: 5000, organizationId: "2" },
      { id: "15", name: "Accounts Receivable", type: "asset", code: "1100", balance: 2500, organizationId: "2" },
      { id: "16", name: "Accounts Payable", type: "liability", code: "2000", balance: 1500, organizationId: "2" },
      { id: "17", name: "Owner's Equity", type: "equity", code: "3000", balance: 6000, organizationId: "2" },
    ]

    const sampleTransactions: Transaction[] = [
      {
        id: "1",
        date: "2023-01-15",
        description: "Client payment received",
        entries: [
          { accountId: "1", debit: 2500, credit: 0 },
          { accountId: "2", credit: 2500, debit: 0 },
        ],
        reference: "INV-001",
        organizationId: "1",
      },
      {
        id: "2",
        date: "2023-01-20",
        description: "Paid rent for office",
        entries: [
          { accountId: "11", debit: 1000, credit: 0 },
          { accountId: "1", credit: 1000, debit: 0 },
        ],
        reference: "RENT-JAN",
        organizationId: "1",
      },
      {
        id: "3",
        date: "2023-01-25",
        description: "Purchased inventory",
        entries: [
          { accountId: "3", debit: 1500, credit: 0 },
          { accountId: "5", credit: 1500, debit: 0 },
        ],
        reference: "PO-123",
        organizationId: "1",
      },
      {
        id: "4",
        date: "2023-01-18",
        description: "Client payment received",
        entries: [
          { accountId: "14", debit: 1200, credit: 0 },
          { accountId: "15", credit: 1200, debit: 0 },
        ],
        reference: "INV-001",
        organizationId: "2",
      },
    ]

    setAccounts(sampleAccounts)
    setTransactions(sampleTransactions)
    setLoading(false)
  }, [])

  // Create a new account
  const createAccount = async (name: string, type: AccountType, code: string) => {
    if (!currentOrganization) return

    setLoading(true)
    try {
      // In a real app, this would be an API call
      const newAccount: Account = {
        id: Date.now().toString(),
        name,
        type,
        code,
        balance: 0,
        organizationId: currentOrganization.id,
      }

      setAccounts([...accounts, newAccount])
    } catch (error) {
      console.error("Failed to create account:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update an account
  const updateAccount = async (id: string, data: Partial<Account>) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      const updatedAccounts = accounts.map((account) => (account.id === id ? { ...account, ...data } : account))

      setAccounts(updatedAccounts)
    } catch (error) {
      console.error("Failed to update account:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Delete an account
  const deleteAccount = async (id: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // Check if account is used in any transactions
      const isUsed = transactions.some((transaction) => transaction.entries.some((entry) => entry.accountId === id))

      if (isUsed) {
        throw new Error("Cannot delete account that is used in transactions")
      }

      const updatedAccounts = accounts.filter((account) => account.id !== id)
      setAccounts(updatedAccounts)
    } catch (error) {
      console.error("Failed to delete account:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Create a transaction (double-entry)
  const createTransaction = async (
    date: string,
    description: string,
    entries: { accountId: string; debit: number; credit: number }[],
    reference: string,
  ) => {
    if (!currentOrganization) return

    setLoading(true)
    try {
      // Validate double-entry (debits = credits)
      const totalDebits = entries.reduce((sum, entry) => sum + entry.debit, 0)
      const totalCredits = entries.reduce((sum, entry) => sum + entry.credit, 0)

      if (totalDebits !== totalCredits) {
        throw new Error("Transaction is not balanced. Total debits must equal total credits.")
      }

      // Create transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        date,
        description,
        entries,
        reference,
        organizationId: currentOrganization.id,
      }

      // Update account balances
      const updatedAccounts = [...accounts]

      for (const entry of entries) {
        const accountIndex = updatedAccounts.findIndex((a) => a.id === entry.accountId)
        if (accountIndex === -1) continue

        const account = updatedAccounts[accountIndex]

        // Update balance based on account type and debit/credit
        // Assets and Expenses increase with debits, decrease with credits
        // Liabilities, Equity, and Revenue increase with credits, decrease with debits
        if (account.type === "asset" || account.type === "expense") {
          account.balance += entry.debit - entry.credit
        } else {
          account.balance += entry.credit - entry.debit
        }

        updatedAccounts[accountIndex] = account
      }

      setTransactions([...transactions, newTransaction])
      setAccounts(updatedAccounts)
    } catch (error) {
      console.error("Failed to create transaction:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Get account balance
  const getAccountBalance = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId)
    return account ? account.balance : 0
  }

  // Get accounts by type
  const getAccountsByType = (type: AccountType) => {
    if (!currentOrganization) return []
    return accounts.filter((a) => a.type === type && a.organizationId === currentOrganization.id)
  }

  return (
    <AccountingContext.Provider
      value={{
        accounts,
        transactions,
        loading,
        createAccount,
        updateAccount,
        deleteAccount,
        createTransaction,
        getAccountBalance,
        getAccountsByType,
      }}
    >
      {children}
    </AccountingContext.Provider>
  )
}

export const useAccounting = () => {
  const context = useContext(AccountingContext)
  if (context === undefined) {
    throw new Error("useAccounting must be used within an AccountingProvider")
  }
  return context
}

