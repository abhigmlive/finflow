"use client"

import { useState, useEffect } from "react"
import { useOrganization } from "@/lib/organization-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Textarea } from "@/components/ui/textarea"
import { ChevronDownIcon, Download, FileText, MoreHorizontal, Plus, Search, Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check } from "lucide-react"
import { Switch } from "@/components/ui/switch"

// Invoice type definition
type Invoice = {
  id: string
  client: string
  email: string
  amount: number
  status: "draft" | "pending" | "paid" | "overdue"
  date: string
  dueDate: string
  items: {
    description: string
    quantity: number
    price: number
  }[]
  notes: string
  organizationId: string
}

export default function InvoicesPage() {
  const { currentOrganization } = useOrganization()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDesignDialogOpen, setIsDesignDialogOpen] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // New invoice form state
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    email: "",
    amount: "",
    status: "draft",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    items: [{ description: "", quantity: 1, price: 0 }],
    notes: "Thank you for your business.",
  })

  // Invoice design settings
  const [invoiceDesign, setInvoiceDesign] = useState({
    logo: "",
    primaryColor: "#0077C5",
    fontFamily: "Inter",
    showHeader: true,
    showFooter: true,
    template: "standard",
  })

  // Load sample invoices
  useEffect(() => {
    // In a real app, this would be an API call
    const sampleInvoices: Invoice[] = [
      {
        id: "INV-001",
        client: "Acme Inc",
        email: "info@acme.com",
        amount: 1250.0,
        status: "paid",
        date: "2023-01-15",
        dueDate: "2023-02-15",
        items: [{ description: "Website Design", quantity: 1, price: 1250.0 }],
        notes: "Thank you for your business.",
        organizationId: "1",
      },
      {
        id: "INV-002",
        client: "Globex Corp",
        email: "billing@globex.com",
        amount: 3450.0,
        status: "pending",
        date: "2023-01-20",
        dueDate: "2023-02-20",
        items: [{ description: "Consulting Services", quantity: 10, price: 345.0 }],
        notes: "Net 30 payment terms.",
        organizationId: "1",
      },
      {
        id: "INV-003",
        client: "Stark Industries",
        email: "accounts@stark.com",
        amount: 2100.0,
        status: "overdue",
        date: "2023-01-05",
        dueDate: "2023-02-05",
        items: [{ description: "Product Development", quantity: 1, price: 2100.0 }],
        notes: "Please pay promptly.",
        organizationId: "1",
      },
      {
        id: "INV-004",
        client: "Wayne Enterprises",
        email: "finance@wayne.com",
        amount: 890.0,
        status: "paid",
        date: "2023-01-12",
        dueDate: "2023-02-12",
        items: [{ description: "Security Consultation", quantity: 2, price: 445.0 }],
        notes: "Thank you for your business.",
        organizationId: "1",
      },
      {
        id: "INV-005",
        client: "Umbrella Corp",
        email: "billing@umbrella.com",
        amount: 1750.0,
        status: "pending",
        date: "2023-01-25",
        dueDate: "2023-02-25",
        items: [{ description: "Research Services", quantity: 5, price: 350.0 }],
        notes: "Net 30 payment terms.",
        organizationId: "2",
      },
      {
        id: "INV-006",
        client: "Cyberdyne Systems",
        email: "accounts@cyberdyne.com",
        amount: 3200.0,
        status: "paid",
        date: "2023-01-18",
        dueDate: "2023-02-18",
        items: [{ description: "AI Development", quantity: 1, price: 3200.0 }],
        notes: "Thank you for your business.",
        organizationId: "2",
      },
    ]

    setInvoices(sampleInvoices)
  }, [])

  // Filter invoices based on current organization, search query, and status filter
  useEffect(() => {
    if (!currentOrganization) return

    let filtered = invoices.filter((invoice) => invoice.organizationId === currentOrganization.id)

    if (searchQuery) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [invoices, currentOrganization, searchQuery, statusFilter])

  // Handle creating a new invoice
  const handleCreateInvoice = () => {
    if (!currentOrganization) return

    // Validate form
    if (!newInvoice.client || !newInvoice.email || !newInvoice.amount) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    // Calculate total from items
    const total = newInvoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0)

    // Create new invoice
    const invoice: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      client: newInvoice.client,
      email: newInvoice.email,
      amount: Number.parseFloat(newInvoice.amount),
      status: newInvoice.status as "draft" | "pending" | "paid" | "overdue",
      date: newInvoice.date,
      dueDate: newInvoice.dueDate,
      items: newInvoice.items,
      notes: newInvoice.notes,
      organizationId: currentOrganization.id,
    }

    // Add to invoices
    setInvoices([...invoices, invoice])

    // Reset form
    setNewInvoice({
      client: "",
      email: "",
      amount: "",
      status: "draft",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: [{ description: "", quantity: 1, price: 0 }],
      notes: "Thank you for your business.",
    })

    // Close dialog and show success message
    setIsCreateDialogOpen(false)
    setSuccessMessage("Invoice created successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  // Handle viewing an invoice
  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  // Handle sending an invoice
  const handleSendInvoice = (invoice: Invoice) => {
    // In a real app, this would send an email
    setSuccessMessage(`Invoice ${invoice.id} sent to ${invoice.email}`)

    // Update invoice status if it's a draft
    if (invoice.status === "draft") {
      const updatedInvoices = invoices.map((inv) => (inv.id === invoice.id ? { ...inv, status: "pending" } : inv))
      setInvoices(updatedInvoices)
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  // Handle downloading an invoice
  const handleDownloadInvoice = (invoice: Invoice) => {
    // In a real app, this would generate a PDF
    setSuccessMessage(`Invoice ${invoice.id} downloaded`)

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  // Handle saving invoice design
  const handleSaveDesign = () => {
    // In a real app, this would save to the database
    setSuccessMessage("Invoice design saved successfully")
    setIsDesignDialogOpen(false)

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  // Add an item to the invoice
  const addInvoiceItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: "", quantity: 1, price: 0 }],
    })
  }

  // Update an invoice item
  const updateInvoiceItem = (index: number, field: string, value: string | number) => {
    const updatedItems = [...newInvoice.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "quantity" || field === "price" ? Number.parseFloat(value as string) : value,
    }

    // Calculate total
    const total = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0)

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount: total.toString(),
    })
  }

  // Remove an invoice item
  const removeInvoiceItem = (index: number) => {
    const updatedItems = newInvoice.items.filter((_, i) => i !== index)

    // Calculate total
    const total = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0)

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount: total.toString(),
    })
  }

  if (!currentOrganization) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <Card>
          <CardContent className="py-10 text-center">
            <p>Please select or create an organization to manage invoices.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <div className="flex items-center gap-2">
          {successMessage && (
            <Alert variant="default" className="w-auto bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <Button onClick={() => setIsDesignDialogOpen(true)} variant="outline">
            Invoice Design
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>Fill in the details to create a new invoice.</DialogDescription>
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
                    <Label htmlFor="client">Client Name</Label>
                    <Input
                      id="client"
                      placeholder="Client name"
                      value={newInvoice.client}
                      onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Client email"
                      value={newInvoice.email}
                      onChange={(e) => setNewInvoice({ ...newInvoice, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Invoice Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newInvoice.date}
                      onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newInvoice.status}
                      onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Invoice Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  <div className="border rounded-md p-4 space-y-4">
                    {newInvoice.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-6 space-y-1">
                          <Label htmlFor={`item-${index}-desc`} className="text-xs">
                            Description
                          </Label>
                          <Input
                            id={`item-${index}-desc`}
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                            placeholder="Item description"
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label htmlFor={`item-${index}-qty`} className="text-xs">
                            Quantity
                          </Label>
                          <Input
                            id={`item-${index}-qty`}
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(index, "quantity", e.target.value)}
                            min="1"
                          />
                        </div>
                        <div className="col-span-3 space-y-1">
                          <Label htmlFor={`item-${index}-price`} className="text-xs">
                            Price
                          </Label>
                          <Input
                            id={`item-${index}-price`}
                            type="number"
                            value={item.price}
                            onChange={(e) => updateInvoiceItem(index, "price", e.target.value)}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInvoiceItem(index)}
                            disabled={newInvoice.items.length === 1}
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
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-lg font-bold">${Number.parseFloat(newInvoice.amount || "0").toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Invoice notes or payment terms"
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleCreateInvoice}>
                  Create Invoice
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Paid</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>Overdue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>Manage your invoices and track payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No invoices found. Create your first invoice to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      <div>
                        <p>{invoice.client}</p>
                        <p className="text-sm text-muted-foreground">{invoice.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "paid"
                            ? "outline"
                            : invoice.status === "pending"
                              ? "secondary"
                              : invoice.status === "draft"
                                ? "default"
                                : "destructive"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                            <Send className="mr-2 h-4 w-4" />
                            Send
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Invoice {currentInvoice?.id}</DialogTitle>
            <DialogDescription>View invoice details</DialogDescription>
          </DialogHeader>
          {currentInvoice && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{currentOrganization.name}</h3>
                  <p className="text-sm text-muted-foreground">123 Business St.</p>
                  <p className="text-sm text-muted-foreground">City, State 12345</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold">INVOICE</h3>
                  <p className="text-sm">{currentInvoice.id}</p>
                  <p className="text-sm">Date: {currentInvoice.date}</p>
                  <p className="text-sm">Due Date: {currentInvoice.dueDate}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Bill To:</h4>
                <p>{currentInvoice.client}</p>
                <p>{currentInvoice.email}</p>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total:
                      </TableCell>
                      <TableCell className="text-right font-bold">${currentInvoice.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Notes:</h4>
                <p className="text-sm">{currentInvoice.notes}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleDownloadInvoice(currentInvoice)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={() => handleSendInvoice(currentInvoice)}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Design Dialog */}
      <Dialog open={isDesignDialogOpen} onOpenChange={setIsDesignDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Invoice Design</DialogTitle>
            <DialogDescription>Customize the appearance of your invoices</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-40 rounded border border-dashed border-gray-300 flex items-center justify-center bg-muted">
                  {invoiceDesign.logo ? (
                    <img src={invoiceDesign.logo || "/placeholder.svg"} alt="Logo" className="max-h-full max-w-full" />
                  ) : (
                    <p className="text-sm text-muted-foreground">No logo uploaded</p>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Upload Logo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: invoiceDesign.primaryColor }} />
                <Input
                  id="primaryColor"
                  type="color"
                  value={invoiceDesign.primaryColor}
                  onChange={(e) => setInvoiceDesign({ ...invoiceDesign, primaryColor: e.target.value })}
                  className="w-16 h-8 p-0"
                />
                <Input
                  value={invoiceDesign.primaryColor}
                  onChange={(e) => setInvoiceDesign({ ...invoiceDesign, primaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font</Label>
              <Select
                value={invoiceDesign.fontFamily}
                onValueChange={(value) => setInvoiceDesign({ ...invoiceDesign, fontFamily: value })}
              >
                <SelectTrigger id="fontFamily">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={invoiceDesign.template}
                onValueChange={(value) => setInvoiceDesign({ ...invoiceDesign, template: value })}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showHeader">Show Header</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showHeader"
                  checked={invoiceDesign.showHeader}
                  onCheckedChange={(checked) => setInvoiceDesign({ ...invoiceDesign, showHeader: checked })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showFooter">Show Footer</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showFooter"
                  checked={invoiceDesign.showFooter}
                  onCheckedChange={(checked) => setInvoiceDesign({ ...invoiceDesign, showFooter: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDesignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDesign}>Save Design</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

