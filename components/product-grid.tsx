"use client"

import type { Product } from "@/lib/products"
import { getProductsFromSupabase } from "@/lib/supabase-products"
import { Search, SlidersHorizontal, X, RotateCcw, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: Product[]
}

const styles = ["Todos", "Camisetas", "Moletons", "Calças", "Jaquetas", "Bermudas"]
const genders = ["Todos", "Masculino", "Feminino", "Unissex"]

function getStyle(product: Product) {
  const text = `${product.name} ${product.description}`.toLowerCase()

  if (text.includes("moletom") || text.includes("hoodie")) return "Moletons"
  if (text.includes("calça") || text.includes("cargo")) return "Calças"
  if (text.includes("jaqueta") || text.includes("corta-vento")) return "Jaquetas"
  if (text.includes("bermuda") || text.includes("short")) return "Bermudas"
  if (text.includes("camiseta") || text.includes("t-shirt") || text.includes("shirt")) return "Camisetas"

  return "Outros"
}

function FilterSelect({
  label,
  value,
  items,
  onChange,
}: {
  label: string
  value: string
  items: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-primary">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-primary/20 bg-black px-4 py-3 text-sm font-bold text-foreground outline-none transition focus:border-primary"
      >
        {items.map((item) => (
          <option key={item} value={item}>
            {item === "Todos" ? (label === "Público" ? "Masculino e feminino" : "Todos os estilos") : item}
          </option>
        ))}
      </select>
    </label>
  )
}

export function ProductGrid({ products }: ProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>(products)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [style, setStyle] = useState("Todos")
  const [gender, setGender] = useState("Todos")
  const [sort, setSort] = useState("recentes")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  async function loadProducts() {
    setLoading(true)
    const onlineProducts = await getProductsFromSupabase()
    setVisibleProducts(onlineProducts.length > 0 ? onlineProducts : products)
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const list = visibleProducts.filter((product) => {
      const productStyle = getStyle(product)
      const productGender = product.gender || "Unissex"
      const matchStyle = style === "Todos" || productStyle === style
      const matchGender = gender === "Todos" || productGender === gender
      const matchSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        productStyle.toLowerCase().includes(normalizedSearch) ||
        productGender.toLowerCase().includes(normalizedSearch)

      return matchStyle && matchGender && matchSearch
    })

    return [...list].sort((a, b) => {
      if (sort === "menor") return a.price - b.price
      if (sort === "maior") return b.price - a.price
      if (sort === "az") return a.name.localeCompare(b.name)
      return 0
    })
  }, [visibleProducts, search, style, gender, sort])

  function clearFilters() {
    setSearch("")
    setStyle("Todos")
    setGender("Todos")
    setSort("recentes")
    setShowMobileFilters(false)
  }

  const hasFilter = Boolean(search || style !== "Todos" || gender !== "Todos" || sort !== "recentes")

  return (
    <section id="colecao" className="bg-black px-3 pb-20 pt-5 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-2 text-left sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-black tracking-[0.35em] text-primary sm:text-sm">COLEÇÃO LW</p>
            <h2 className="text-2xl font-black text-white sm:text-4xl">Produtos em destaque</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Experiência mais limpa, organizada e rápida para comprar no celular e no computador.
            </p>
          </div>
          <div className="hidden rounded-full border border-primary/20 px-4 py-2 text-sm font-bold text-primary sm:block">
            {loading ? "Carregando..." : `${filteredProducts.length} peça${filteredProducts.length === 1 ? "" : "s"} encontrada${filteredProducts.length === 1 ? "" : "s"}`}
          </div>
        </div>

        <div id="categorias" className="mb-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mb-8">
          <div className="flex min-w-max gap-2">
            {styles.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStyle(item)}
                className={`rounded-full px-4 py-2 text-xs font-black transition sm:px-5 sm:py-2.5 sm:text-sm ${
                  style === item ? "bg-primary text-black" : "border border-primary/15 bg-white/[0.03] text-zinc-300 hover:border-primary/50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-primary/15 bg-card/70 p-5 shadow-2xl shadow-black/30">
              <div className="mb-5 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-black text-white">Filtros</h3>
              </div>

              <div className="space-y-5">
                <label className="relative block">
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-primary">Buscar</span>
                  <Search className="pointer-events-none absolute left-3 top-[42px] h-4 w-4 text-primary" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Nome da peça..."
                    className="w-full rounded-2xl border border-primary/20 bg-black py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary"
                  />
                </label>

                <FilterSelect label="Estilo" value={style} items={styles} onChange={setStyle} />
                <FilterSelect label="Público" value={gender} items={genders} onChange={setGender} />

                <label className="block">
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-primary">Ordenar</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="w-full rounded-2xl border border-primary/20 bg-black px-4 py-3 text-sm font-bold text-foreground outline-none transition focus:border-primary"
                  >
                    <option value="recentes">Mais recentes</option>
                    <option value="menor">Menor preço</option>
                    <option value="maior">Maior preço</option>
                    <option value="az">A-Z</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/25 px-5 py-3 text-sm font-black text-primary transition hover:bg-primary/10"
                >
                  <RotateCcw className="h-4 w-4" />
                  Limpar filtros
                </button>
              </div>
            </div>
          </aside>

          <div>
            <div className="sticky top-[82px] z-30 mb-4 rounded-3xl border border-primary/20 bg-black/92 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl lg:static lg:mb-6 lg:bg-card/60">
              <div className="flex gap-2">
                <label className="relative block flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar camiseta, cargo, moletom..."
                    className="h-11 w-full rounded-full border border-primary/20 bg-zinc-950 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary lg:hidden"
                  />
                  <div className="hidden h-11 items-center gap-2 rounded-full border border-primary/15 bg-black px-4 text-sm text-zinc-400 lg:flex">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Peças organizadas por drop, estilo e público.
                  </div>
                </label>

                <button
                  type="button"
                  onClick={() => setShowMobileFilters(true)}
                  className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-primary/25 px-4 text-xs font-black text-primary lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtrar
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground sm:text-sm">
                <p>
                  {loading
                    ? "Carregando peças online..."
                    : `${filteredProducts.length} peça${filteredProducts.length === 1 ? "" : "s"} encontrada${filteredProducts.length === 1 ? "" : "s"}`}
                </p>
                <button type="button" onClick={loadProducts} className="font-black text-primary hover:underline">
                  Atualizar
                </button>
              </div>
            </div>

            {hasFilter && (
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                {search && <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">Busca: {search}</span>}
                {style !== "Todos" && <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{style}</span>}
                {gender !== "Todos" && <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{gender}</span>}
                <button onClick={clearFilters} className="font-black text-zinc-400 underline">limpar</button>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div id="novidades" className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-primary/20 bg-card p-8 text-center sm:p-12">
                <h3 className="text-2xl font-black text-primary">Nenhuma peça encontrada</h3>
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  Tente procurar outro nome, escolher outro estilo ou trocar o filtro masculino/feminino.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-full bg-primary px-6 py-3 font-black text-black transition hover:bg-primary/90"
                >
                  Ver coleção completa
                </button>
              </div>
            )}
          </div>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t-[2rem] border border-primary/20 bg-card p-5 pb-7 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-black text-white">Filtrar peças</h3>
                <button onClick={() => setShowMobileFilters(false)} className="rounded-full border border-primary/20 p-2 text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <FilterSelect label="Estilo" value={style} items={styles} onChange={setStyle} />
                <FilterSelect label="Público" value={gender} items={genders} onChange={setGender} />
                <label className="block">
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-primary">Ordenar</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="w-full rounded-2xl border border-primary/20 bg-black px-4 py-3 text-sm font-bold text-foreground outline-none"
                  >
                    <option value="recentes">Mais recentes</option>
                    <option value="menor">Menor preço</option>
                    <option value="maior">Maior preço</option>
                    <option value="az">A-Z</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={clearFilters} className="rounded-2xl border border-primary/25 px-5 py-3 text-sm font-black text-primary">
                  Limpar
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black"
                >
                  Ver peças
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
