import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RecentExpenses() {
  const expenses = [
    {
      id: "EXP-001",
      description: "Office Supplies",
      category: "Office",
      amount: 125.5,
      date: "2023-01-10",
      status: "reconciled",
    },
    {
      id: "EXP-002",
      description: "Client Lunch",
      category: "Meals",
      amount: 85.2,
      date: "2023-01-12",
      status: "pending",
    },
    {
      id: "EXP-003",
      description: "Software Subscription",
      category: "Software",
      amount: 49.99,
      date: "2023-01-15",
      status: "reconciled",
    },
    {
      id: "EXP-004",
      description: "Travel Expenses",
      category: "Travel",
      amount: 350.0,
      date: "2023-01-18",
      status: "pending",
    },
    {
      id: "EXP-005",
      description: "Marketing Campaign",
      category: "Marketing",
      amount: 500.0,
      date: "2023-01-20",
      status: "reconciled",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.description}</TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>{expense.date}</TableCell>
            <TableCell>${expense.amount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={expense.status === "reconciled" ? "outline" : "secondary"}>{expense.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

