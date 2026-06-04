"use client"

import type { Product } from "@/lib/products"
import { getProductsFromSupabase } from "@/lib/supabase-products"
import {
  Footprints,
  Grid2X2,
  List,
  Package,
  RefreshCcw,
  Search,
  Shirt,
  SlidersHorizontal,
  Star,
  Tag,
  Truck,
  Watch,
  X,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: Product[]
}

const categories = [
  { label: "Todos", value: "Todos", icon: Grid2X2 },
  { label: "Camisetas", value: "Camisetas", icon: Shirt },
  { label: "Moletons", value: "Moletons", icon: Package },
  { label: "Calças", value: "Calças", icon: Watch },
  { label: "Tênis", value: "Tênis", icon: Footprints },
  { label: "Jaquetas", value: "Jaquetas", icon: Shirt },
  { label: "Bermudas", value: "Bermudas", icon: Package },
  { label: "Acessórios", value: "Acessórios", icon: Truck },
  { label: "Novidades", value: "Novidades", icon: Star },
  { label: "Promo", value: "Sale", icon: Tag },
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
  if (text.includes("tênis") || text.includes("tenis") || text.includes("sneaker") || text.includes("shoe") || text.includes("sapato")) return "Tênis"
  if (text.includes("moletom") || text.includes("hoodie") || text.includes("blusa")) return "Moletons"
  if (text.includes("calça") || text.includes("calca") || text.includes("cargo") || text.includes("pants")) return "Calças"
  if (text.includes("jaqueta") || text.includes("corta-vento") || text.includes("jacket")) return "Jaquetas"
  if (text.includes("bermuda") || text.includes("short")) return "Bermudas"
  if (text.includes("boné") || text.includes("bone") || text.includes("cap") || text.includes("acess")) return "Acessórios"
  if (text.includes("camiseta") || text.includes("tee") || text.includes("t-shirt")) return "Camisetas"
  return "Camisetas"
}

export function ProductGrid({ products }: ProductGridProps) {
  const [onlineProducts, setOnlineProducts] = useState<Product[]>(products)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Todos")
  const [gender, setGender] = useState("Todos")
  const [sort, setSort] = useState("mix")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [mixSeed, setMixSeed] = useState(0)

  async function loadProducts() {
    setLoading(true)
    const remoteProducts = await getProductsFromSupabase()
    if (remoteProducts.length > 0) {
      setOnlineProducts(remoteProducts)
      setMixSeed(Date.now())
    }
    setLoading(false)
  }

  useEffect(() => {
    setMixSeed(Date.now())
    loadProducts()
  }, [])

  const isFiltering = search.trim() !== "" || category !== "Todos" || gender !== "Todos" || sort !== "mix"

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const filtered = onlineProducts.filter((product) => {
      const style = getStyle(product)
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        style.toLowerCase().includes(normalizedSearch)

      const matchesCategory = category === "Todos" || category === "Novidades" || category === "Sale" || style === category
      const matchesGender = gender === "Todos" || product.gender === gender || product.gender === "Unissex"

      return matchesSearch && matchesCategory && matchesGender
    })

    if (!isFiltering) {
      return [...filtered].sort((a, b) => mixedOrderKey(a, mixSeed) - mixedOrderKey(b, mixSeed))
    }

    return [...filtered].sort((a, b) => {
      if (sort === "menor") return a.price - b.price
      if (sort === "maior") return b.price - a.price
      if (sort === "az") return a.name.localeCompare(b.name)
      return getStyle(a).localeCompare(getStyle(b)) || a.name.localeCompare(b.name)
    })
  }, [onlineProducts, search, category, gender, sort, isFiltering, mixSeed])

  function clearFilters() {
    setSearch("")
    setCategory("Todos")
    setGender("Todos")
    setSort("mix")
    setMixSeed(Date.now())
  }

  const FiltersBox = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={mobile ? "space-y-4" : "sticky top-28 h-fit rounded-[22px] border border-primary/20 bg-[#080808] p-5 shadow-2xl shadow-black/40"}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-lg font-black text-white">
          <SlidersHorizontal className="h-5 w-5 text-primary" /> Filtros
        </div>
        {mobile && (
          <button onClick={() => setShowMobileFilters(false)} className="text-sm font-bold text-zinc-400">
            Fechar
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.26em] text-primary">Buscar</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome da peça..."
              className="h-12 w-full rounded-2xl border border-primary/30 bg-black pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.26em] text-primary">Estilo</label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 w-full rounded-2xl border border-primary/30 bg-black px-4 text-sm font-black text-white outline-none focus:border-primary">
            {categories.slice(0, 8).map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.26em] text-primary">Público</label>
          <select value={gender} onChange={(event) => setGender(event.target.value)} className="h-12 w-full rounded-2xl border border-primary/30 bg-black px-4 text-sm font-black text-white outline-none focus:border-primary">
            <option value="Todos">Masculino e feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Unissex">Unissex</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.26em] text-primary">Ordenar</label>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-12 w-full rounded-2xl border border-primary/30 bg-black px-4 text-sm font-black text-white outline-none focus:border-primary">
            <option value="mix">Misturados</option>
            <option value="recentes">Por categoria</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
            <option value="az">A-Z</option>
          </select>
        </div>

        <button onClick={clearFilters} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-primary/35 bg-primary/5 text-sm font-black text-primary transition hover:bg-primary hover:text-black">
          <X className="h-4 w-4" /> Limpar filtros
        </button>
      </div>
    </aside>
  )

  return (
    <section id="colecao" className="relative bg-[#030303] pb-24 pt-5 lg:pb-20 lg:pt-10">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-8 xl:px-12">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:mb-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-primary">Coleção LW</p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-5xl">Produtos em destaque</h2>
            <p className="mt-2 max-w-[640px] text-xs leading-relaxed text-zinc-400 sm:text-sm lg:text-base">
              Produtos misturados na vitrine. Quando filtrar, eles ficam organizados por estilo, público ou preço.
            </p>
          </div>
          <div className="w-fit rounded-full border border-primary/35 bg-primary/10 px-5 py-2 text-xs font-black text-primary">
            {filteredProducts.length} peças encontradas
          </div>
        </div>

        <div id="categorias" className="mb-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#070707] p-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:mb-6 [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 lg:justify-between lg:gap-3">
            {categories.map((item) => {
              const Icon = item.icon
              const active = category === item.value
              return (
                <button
                  key={item.value}
                  onClick={() => setCategory(item.value)}
                  className={`flex h-11 items-center gap-2 rounded-full border px-4 text-[11px] font-black uppercase tracking-wide transition ${
                    active
                      ? "border-primary bg-primary text-black"
                      : "border-white/12 bg-white/[0.025] text-zinc-300 hover:border-primary/60 hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <FiltersBox />
          </div>

          <div className="min-w-0">
            <div className="mb-4 rounded-[20px] border border-primary/20 bg-[#080808] p-3 shadow-xl shadow-black/30 sm:p-4 lg:mb-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Peças organizadas por drop, estilo e público..."
                    className="h-11 w-full rounded-2xl border border-primary/25 bg-black pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-primary sm:h-12 sm:pl-11"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowMobileFilters(true)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-primary/35 px-4 text-xs font-black uppercase tracking-wide text-primary lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" /> Filtros
                  </button>
                  <button onClick={loadProducts} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-primary/35 px-4 text-xs font-black uppercase tracking-wide text-primary hover:bg-primary hover:text-black">
                    <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                <p>{loading ? "Carregando produtos online..." : `${filteredProducts.length} produtos encontrados`}</p>
                <div className="hidden items-center gap-2 rounded-xl border border-white/10 p-1 lg:flex">
                  <button className="flex h-9 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><Grid2X2 className="h-5 w-5" /></button>
                  <button className="flex h-9 w-10 items-center justify-center rounded-lg text-zinc-500"><List className="h-5 w-5" /></button>
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div id="novidades" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-primary/20 bg-white/[0.03] p-10 text-center">
                <h3 className="text-2xl font-black uppercase tracking-tight text-primary">Nenhum produto encontrado</h3>
                <p className="mt-3 text-zinc-400">Tente mudar a busca ou limpar os filtros.</p>
                <button onClick={clearFilters} className="mt-6 rounded-full border border-primary px-6 py-3 text-sm font-black uppercase text-primary hover:bg-primary hover:text-black">Limpar filtros</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-primary/30 bg-[#080808] p-5" onClick={(event) => event.stopPropagation()}>
            <FiltersBox mobile />
            <button onClick={() => setShowMobileFilters(false)} className="mt-5 h-12 w-full rounded-xl bg-primary text-sm font-black uppercase text-black">Aplicar filtros</button>
          </div>
        </div>
      )}
    </section>
  )
}
