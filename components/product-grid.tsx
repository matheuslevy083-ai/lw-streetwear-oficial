"use client"

import type { Product } from "@/lib/products"
import { getProductsFromSupabase } from "@/lib/supabase-products"
import { Grid2X2, Heart, List, Package, Search, Shirt, SlidersHorizontal, Star, Tag, Truck, Watch } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: Product[]
}

const categories = [
  { label: "All", value: "Todos", icon: Grid2X2 },
  { label: "T-Shirts", value: "Camisetas", icon: Shirt },
  { label: "Hoodies", value: "Moletons", icon: Package },
  { label: "Pants", value: "Calças", icon: Watch },
  { label: "Jackets", value: "Jaquetas", icon: Shirt },
  { label: "Shorts", value: "Bermudas", icon: Package },
  { label: "Accessories", value: "Acessórios", icon: Truck },
  { label: "New arrivals", value: "Novidades", icon: Star },
  { label: "Sale", value: "Sale", icon: Tag },
]


function mixedOrderKey(product: Product, seed: number) {
  const text = `${product.id}-${product.name}-${seed}`
  let hash = 0
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0
  }
  return hash
}

function getStyle(product: Product) {
  const text = `${product.name} ${product.description}`.toLowerCase()
  if (text.includes("moletom") || text.includes("hoodie") || text.includes("blusa")) return "Moletons"
  if (text.includes("calça") || text.includes("cargo") || text.includes("pants")) return "Calças"
  if (text.includes("jaqueta") || text.includes("corta-vento") || text.includes("jacket")) return "Jaquetas"
  if (text.includes("bermuda") || text.includes("short")) return "Bermudas"
  if (text.includes("camiseta") || text.includes("t-shirt") || text.includes("shirt") || text.includes("tee")) return "Camisetas"
  return "Camisetas"
}

export function ProductGrid({ products }: ProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>(products)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Todos")
  const [gender, setGender] = useState("Todos")
  const [sort, setSort] = useState("recentes")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [shuffleSeed, setShuffleSeed] = useState(() => Math.random())

  async function loadProducts() {
    setLoading(true)
    const onlineProducts = await getProductsFromSupabase()
    setVisibleProducts(onlineProducts.length > 0 ? onlineProducts : products)
    setShuffleSeed(Math.random())
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const list = visibleProducts.filter((product) => {
      const style = getStyle(product)
      const productGender = product.gender || "Unissex"
      const matchesCategory = category === "Todos" || category === "Novidades" || category === "Sale" || category === "Acessórios" || style === category
      const matchesGender = gender === "Todos" || productGender === gender || productGender === "Unissex"
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        style.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesGender && matchesSearch
    })

    const hasActiveFilter = Boolean(normalizedSearch) || category !== "Todos" || gender !== "Todos" || sort !== "recentes"

    if (!hasActiveFilter) {
      // Vitrine principal misturada: não mostra na mesma ordem que você cadastrou no admin.
      // Quando o cliente filtra ou ordena, a lista volta para uma ordem previsível.
      return [...list].sort((a, b) => mixedOrderKey(a, shuffleSeed) - mixedOrderKey(b, shuffleSeed))
    }

    return [...list].sort((a, b) => {
      if (sort === "menor") return a.price - b.price
      if (sort === "maior") return b.price - a.price
      if (sort === "az") return a.name.localeCompare(b.name)
      return 0
    })
  }, [visibleProducts, search, category, gender, sort, shuffleSeed])

  function clearFilters() {
    setSearch("")
    setCategory("Todos")
    setGender("Todos")
    setSort("recentes")
  }

  return (
    <section id="colecao" className="bg-[#050505] pb-24 lg:pb-10">
      <div id="categorias" className="sticky top-[140px] z-30 border-b border-white/10 border-t border-white/10 bg-black/92 backdrop-blur-xl lg:top-[108px]">
        <div className="mx-auto max-w-[1540px] overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:px-12">
          <div className="flex min-w-max items-center gap-2 py-3 lg:gap-5">
            {categories.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={`flex h-11 items-center gap-2 rounded-full border px-4 text-[10px] font-black uppercase tracking-[0.08em] transition lg:h-14 lg:rounded-none lg:border-0 lg:border-b-2 lg:px-6 ${
                  category === value
                    ? "border-primary bg-primary/10 text-primary lg:bg-transparent"
                    : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-primary/40 hover:text-primary lg:bg-transparent"
                }`}
              >
                <Icon className="h-4 w-4 lg:h-6 lg:w-6" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1540px] px-4 py-4 lg:px-12 lg:py-6">
        <div className="mb-4 grid gap-3 lg:grid-cols-[120px_140px_120px_120px_120px_150px_1fr_190px_82px] lg:items-center">
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="flex h-11 items-center justify-center gap-2 rounded border border-white/12 bg-white/[0.025] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-200 transition hover:border-primary/50 hover:text-primary lg:justify-start"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>

          <select value={category} onChange={(event) => setCategory(event.target.value)} className="hidden h-11 rounded border border-white/12 bg-black px-4 text-[11px] font-black uppercase tracking-[0.08em] text-zinc-200 outline-none focus:border-primary lg:block">
            {categories.slice(0, 6).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>

          <select className="hidden h-11 rounded border border-white/12 bg-black px-4 text-[11px] font-black uppercase tracking-[0.08em] text-zinc-200 outline-none focus:border-primary lg:block" defaultValue="size">
            <option value="size">Size</option><option>P</option><option>M</option><option>G</option><option>GG</option>
          </select>

          <select className="hidden h-11 rounded border border-white/12 bg-black px-4 text-[11px] font-black uppercase tracking-[0.08em] text-zinc-200 outline-none focus:border-primary lg:block" defaultValue="color">
            <option value="color">Color</option><option>Black</option><option>Gold</option><option>White</option>
          </select>

          <select className="hidden h-11 rounded border border-white/12 bg-black px-4 text-[11px] font-black uppercase tracking-[0.08em] text-zinc-200 outline-none focus:border-primary lg:block" defaultValue="price">
            <option value="price">Price</option><option>Até R$100</option><option>R$100+</option>
          </select>

          <select value={gender} onChange={(event) => setGender(event.target.value)} className="hidden h-11 rounded border border-white/12 bg-black px-4 text-[11px] font-black uppercase tracking-[0.08em] text-zinc-200 outline-none focus:border-primary lg:block">
            <option value="Todos">Availability</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Unissex">Unissex</option>
          </select>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded border border-white/12 bg-white/[0.025] pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-primary"
            />
          </div>

          <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 rounded border border-white/12 bg-black px-4 text-[11px] font-black uppercase tracking-[0.08em] text-zinc-200 outline-none focus:border-primary">
            <option value="recentes">Sort by: Newest</option><option value="menor">Lowest price</option><option value="maior">Highest price</option><option value="az">A-Z</option>
          </select>

          <div className="hidden grid-cols-2 overflow-hidden rounded border border-white/12 lg:grid">
            <button className="flex h-11 items-center justify-center bg-primary/10 text-primary"><Grid2X2 className="h-5 w-5" /></button>
            <button className="flex h-11 items-center justify-center text-zinc-500"><List className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
          <p>{loading ? "Loading online products..." : `${filteredProducts.length} products found`}</p>
          <button onClick={loadProducts} className="font-black uppercase tracking-[0.08em] text-primary hover:underline">Update</button>
        </div>

        {filteredProducts.length > 0 ? (
          <div id="novidades" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-primary/20 bg-white/[0.03] p-10 text-center">
            <h3 className="text-2xl font-black uppercase tracking-tight text-primary">No products found</h3>
            <p className="mt-3 text-zinc-400">Try changing your filters or search term.</p>
            <button onClick={clearFilters} className="mt-6 rounded border border-primary px-6 py-3 text-sm font-black uppercase text-primary hover:bg-primary hover:text-black">Clear filters</button>
          </div>
        )}
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-primary/30 bg-[#080808] p-5" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-tight text-white">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-zinc-400">Close</button>
            </div>
            <div className="space-y-3">
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-black px-4 text-sm font-bold text-white">
                {categories.slice(0, 6).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
              <select value={gender} onChange={(event) => setGender(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-black px-4 text-sm font-bold text-white">
                <option value="Todos">Todos os públicos</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Unissex">Unissex</option>
              </select>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-12 w-full rounded-xl border border-white/12 bg-black px-4 text-sm font-bold text-white">
                <option value="recentes">Mais recentes</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option><option value="az">A-Z</option>
              </select>
            </div>
            <button onClick={() => setShowMobileFilters(false)} className="mt-5 h-12 w-full rounded-xl bg-primary text-sm font-black uppercase text-black">Apply filters</button>
          </div>
        </div>
      )}
    </section>
  )
}
