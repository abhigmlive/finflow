import type React from "react"
import { BarChart3, CreditCard, DollarSign, FileText, PieChart, Receipt, Users, Wallet } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="bg-muted py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to manage your finances</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed for small businesses and sole traders
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-primary" />}
            title="Invoicing"
            description="Create and send professional invoices in seconds"
          />
          <FeatureCard
            icon={<Receipt className="h-10 w-10 text-primary" />}
            title="Expense Tracking"
            description="Track and categorize all your business expenses"
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10 text-primary" />}
            title="Financial Reports"
            description="Get insights with powerful financial reports"
          />
          <FeatureCard
            icon={<CreditCard className="h-10 w-10 text-primary" />}
            title="Bank Connections"
            description="Connect your bank accounts for real-time updates"
          />
          <FeatureCard
            icon={<DollarSign className="h-10 w-10 text-primary" />}
            title="Tax Preparation"
            description="Simplify tax time with organized financial data"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Multi-user Access"
            description="Collaborate with your team or accountant"
          />
          <FeatureCard
            icon={<PieChart className="h-10 w-10 text-primary" />}
            title="Budget Planning"
            description="Create and track budgets for your business"
          />
          <FeatureCard
            icon={<Wallet className="h-10 w-10 text-primary" />}
            title="Payment Processing"
            description="Accept online payments directly from invoices"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

