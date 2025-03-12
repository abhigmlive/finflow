"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useOrganization } from "./organization-provider"

// Product structure
export type Product = {
  id: string
  name: string
  sku: string
  description: string
  price: number
  cost: number
  quantity: number
  reorderPoint: number
  category: string
  organizationId: string
}

// Inventory transaction structure
export type InventoryTransaction = {
  id: string
  date: string
  type: "purchase" | "sale" | "adjustment"
  productId: string
  quantity: number
  unitPrice: number
  total: number
  reference: string
  notes: string
  organizationId: string
}

// Context type
type InventoryContextType = {
  products: Product[]
  transactions: InventoryTransaction[]
  loading: boolean
  createProduct: (product: Omit<Product, "id" | "organizationId">) => Promise<void>
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  adjustInventory: (
    productId: string,
    quantity: number,
    type: "purchase" | "sale" | "adjustment",
    reference: string,
    notes: string,
    unitPrice?: number,
  ) => Promise<void>
  getLowStockProducts: () => Product[]
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { currentOrganization } = useOrganization()
  const [products, setProducts] = useState<Product[]>([])
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize with sample data
  useEffect(() => {
    // In a real app, this would be an API call
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Laptop",
        sku: "TECH-001",
        description: "High-performance laptop",
        price: 1299.99,
        cost: 900,
        quantity: 15,
        reorderPoint: 5,
        category: "Electronics",
        organizationId: "1",
      },
      {
        id: "2",
        name: "Desk Chair",
        sku: "FURN-002",
        description: "Ergonomic office chair",
        price: 249.99,
        cost: 150,
        quantity: 8,
        reorderPoint: 3,
        category: "Furniture",
        organizationId: "1",
      },
      {
        id: "3",
        name: "Wireless Mouse",
        sku: "TECH-003",
        description: "Bluetooth wireless mouse",
        price: 39.99,
        cost: 20,
        quantity: 25,
        reorderPoint: 10,
        category: "Electronics",
        organizationId: "1",
      },
      {
        id: "4",
        name: "Notebook",
        sku: "STAT-004",
        description: "Premium hardcover notebook",
        price: 12.99,
        cost: 5,
        quantity: 50,
        reorderPoint: 15,
        category: "Stationery",
        organizationId: "1",
      },
      {
        id: "5",
        name: "Desk Lamp",
        sku: "FURN-005",
        description: "LED desk lamp",
        price: 49.99,
        cost: 25,
        quantity: 12,
        reorderPoint: 5,
        category: "Furniture",
        organizationId: "1",
      },
      {
        id: "6",
        name: "Tablet",
        sku: "TECH-006",
        description: "10-inch tablet",
        price: 399.99,
        cost: 250,
        quantity: 10,
        reorderPoint: 3,
        category: "Electronics",
        organizationId: "2",
      },
    ]

    const sampleTransactions: InventoryTransaction[] = [
      {
        id: "1",
        date: "2023-01-10",
        type: "purchase",
        productId: "1",
        quantity: 5,
        unitPrice: 900,
        total: 4500,
        reference: "PO-123",
        notes: "Initial stock purchase",
        organizationId: "1",
      },
      {
        id: "2",
        date: "2023-01-15",
        type: "sale",
        productId: "1",
        quantity: 2,
        unitPrice: 1299.99,
        total: 2599.98,
        reference: "INV-001",
        notes: "Customer sale",
        organizationId: "1",
      },
      {
        id: "3",
        date: "2023-01-20",
        type: "purchase",
        productId: "2",
        quantity: 10,
        unitPrice: 150,
        total: 1500,
        reference: "PO-124",
        notes: "Restock order",
        organizationId: "1",
      },
      {
        id: "4",
        date: "2023-01-25",
        type: "adjustment",
        productId: "3",
        quantity: -2,
        unitPrice: 20,
        total: -40,
        reference: "ADJ-001",
        notes: "Inventory count adjustment",
        organizationId: "1",
      },
    ]

    setProducts(sampleProducts)
    setTransactions(sampleTransactions)
    setLoading(false)
  }, [])

  // Create a new product
  const createProduct = async (product: Omit<Product, "id" | "organizationId">) => {
    if (!currentOrganization) return

    setLoading(true)
    try {
      // In a real app, this would be an API call
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        organizationId: currentOrganization.id,
      }

      setProducts([...products, newProduct])
    } catch (error) {
      console.error("Failed to create product:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update a product
  const updateProduct = async (id: string, data: Partial<Product>) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      const updatedProducts = products.map((product) => (product.id === id ? { ...product, ...data } : product))

      setProducts(updatedProducts)
    } catch (error) {
      console.error("Failed to update product:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Delete a product
  const deleteProduct = async (id: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // Check if product has transactions
      const hasTransactions = transactions.some((transaction) => transaction.productId === id)

      if (hasTransactions) {
        throw new Error("Cannot delete product with existing transactions")
      }

      const updatedProducts = products.filter((product) => product.id !== id)
      setProducts(updatedProducts)
    } catch (error) {
      console.error("Failed to delete product:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Adjust inventory (purchase, sale, or adjustment)
  const adjustInventory = async (
    productId: string,
    quantity: number,
    type: "purchase" | "sale" | "adjustment",
    reference: string,
    notes: string,
    unitPrice?: number,
  ) => {
    if (!currentOrganization) return

    setLoading(true)
    try {
      // Find the product
      const productIndex = products.findIndex((p) => p.id === productId)
      if (productIndex === -1) {
        throw new Error("Product not found")
      }

      const product = products[productIndex]

      // Calculate the new quantity
      let newQuantity = product.quantity
      if (type === "purchase") {
        newQuantity += quantity
      } else if (type === "sale") {
        if (product.quantity < quantity) {
          throw new Error("Insufficient inventory")
        }
        newQuantity -= quantity
      } else if (type === "adjustment") {
        newQuantity += quantity // Can be positive or negative
        if (newQuantity < 0) {
          throw new Error("Adjustment would result in negative inventory")
        }
      }

      // Use the provided unit price or default to product cost/price
      const actualUnitPrice = unitPrice ?? (type === "purchase" ? product.cost : product.price)

      // Create the transaction
      const transaction: InventoryTransaction = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        type,
        productId,
        quantity: Math.abs(quantity),
        unitPrice: actualUnitPrice,
        total:
          Math.abs(quantity) * actualUnitPrice * (type === "sale" ? 1 : type === "adjustment" && quantity < 0 ? -1 : 1),
        reference,
        notes,
        organizationId: currentOrganization.id,
      }

      // Update the product quantity
      const updatedProducts = [...products]
      updatedProducts[productIndex] = {
        ...product,
        quantity: newQuantity,
      }

      setProducts(updatedProducts)
      setTransactions([...transactions, transaction])
    } catch (error) {
      console.error("Failed to adjust inventory:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Get products with stock below reorder point
  const getLowStockProducts = () => {
    if (!currentOrganization) return []

    return products.filter(
      (product) => product.organizationId === currentOrganization.id && product.quantity <= product.reorderPoint,
    )
  }

  return (
    <InventoryContext.Provider
      value={{
        products,
        transactions,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        adjustInventory,
        getLowStockProducts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}

