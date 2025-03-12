import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function PricingSection() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">Choose the plan that works best for your business</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <PricingCard
            title="Starter"
            price="$12"
            description="Perfect for freelancers and sole traders"
            features={[
              "Up to 5 invoices per month",
              "Expense tracking",
              "Basic reports",
              "Single user access",
              "Email support",
            ]}
            buttonText="Start free trial"
            buttonVariant="outline"
          />
          <PricingCard
            title="Professional"
            price="$25"
            description="Ideal for growing small businesses"
            features={[
              "Unlimited invoices",
              "Expense tracking",
              "Advanced reports",
              "Up to 3 user accounts",
              "Bank connections",
              "Priority email support",
            ]}
            buttonText="Start free trial"
            buttonVariant="default"
            popular
          />
          <PricingCard
            title="Business"
            price="$50"
            description="For established businesses with complex needs"
            features={[
              "Unlimited invoices",
              "Expense tracking",
              "Custom reports",
              "Unlimited user accounts",
              "Bank connections",
              "Inventory tracking",
              "Project tracking",
              "Phone and email support",
            ]}
            buttonText="Start free trial"
            buttonVariant="outline"
          />
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  buttonVariant = "default",
  popular = false,
}: {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant?: "default" | "outline"
  popular?: boolean
}) {
  return (
    <Card className={popular ? "border-primary shadow-lg relative" : ""}>
      {popular && (
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
          <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="ml-1 text-muted-foreground">/month</span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href="/signup" className="w-full">
          <Button variant={buttonVariant} className="w-full">
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

