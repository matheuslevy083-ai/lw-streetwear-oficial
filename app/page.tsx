import { ProductGrid } from "@/components/product-grid"
import { Hero } from "@/components/hero"
import { products } from "@/lib/products"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <ProductGrid products={products} />
    </main>
  )
}
