import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function TestimonialsSection() {
  return (
    <section className="bg-muted py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trusted by businesses worldwide</h2>
          <p className="mt-4 text-lg text-muted-foreground">See what our customers have to say about FinFlow</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <TestimonialCard
            quote="FinFlow has completely transformed how I manage my business finances. The invoicing feature alone has saved me hours each week."
            name="Sarah Johnson"
            role="Freelance Designer"
            avatar="SJ"
          />
          <TestimonialCard
            quote="As a small business owner, I needed something simple yet powerful. FinFlow delivers exactly that, with excellent customer support."
            name="Michael Chen"
            role="Cafe Owner"
            avatar="MC"
          />
          <TestimonialCard
            quote="The reporting features in FinFlow give me clear insights into my business performance. I can make better decisions with real-time data."
            name="Emma Rodriguez"
            role="Marketing Agency"
            avatar="ER"
          />
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  quote,
  name,
  role,
  avatar,
}: {
  quote: string
  name: string
  role: string
  avatar: string
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 pt-6">
        <p className="italic">&ldquo;{quote}&rdquo;</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{avatar}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

