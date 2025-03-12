import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative">
      <div className="container flex flex-col items-center justify-between gap-4 py-12 md:flex-row md:py-24">
        <div className="flex flex-col items-start gap-4 md:max-w-[50%]">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Simplify your <span className="text-primary">finances</span> with FinFlow
          </h1>
          <p className="text-xl text-muted-foreground">
            Accounting software made for small businesses and sole traders.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg">Try FinFlow for free</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                Compare pricing and plans
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] w-full md:h-[400px] md:w-[50%]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-lg shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm">
              <div className="absolute top-8 left-8 right-8 h-12 bg-white/20 rounded-md"></div>
              <div className="absolute top-28 left-8 w-1/2 h-40 bg-white/20 rounded-md"></div>
              <div className="absolute top-28 right-8 w-1/3 h-40 bg-white/20 rounded-md"></div>
              <div className="absolute bottom-8 left-8 right-8 h-20 bg-white/20 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

