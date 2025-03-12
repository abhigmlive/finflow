import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentInvoices() {
  const invoices = [
    {
      id: "INV-001",
      client: "Acme Inc",
      email: "info@acme.com",
      amount: 1250.0,
      status: "paid",
      date: "2023-01-15",
    },
    {
      id: "INV-002",
      client: "Globex Corp",
      email: "billing@globex.com",
      amount: 3450.0,
      status: "pending",
      date: "2023-01-20",
    },
    {
      id: "INV-003",
      client: "Stark Industries",
      email: "accounts@stark.com",
      amount: 2100.0,
      status: "overdue",
      date: "2023-01-05",
    },
    {
      id: "INV-004",
      client: "Wayne Enterprises",
      email: "finance@wayne.com",
      amount: 890.0,
      status: "paid",
      date: "2023-01-12",
    },
  ]

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {invoice.client
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{invoice.client}</p>
              <p className="text-xs text-muted-foreground">{invoice.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium leading-none">${invoice.amount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{invoice.date}</p>
            </div>
            <Badge
              variant={
                invoice.status === "paid" ? "outline" : invoice.status === "pending" ? "secondary" : "destructive"
              }
            >
              {invoice.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

