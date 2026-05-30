"use client"

import type { Product } from "@/lib/products"
import { getProductsFromSupabase } from "@/lib/supabase-products"
import { Search, SlidersHorizontal, X } from "lucide-react"
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

export function ProductGrid({ products }: ProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>(products)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [style, setStyle] = useState("Todos")
  const [gender, setGender] = useState("Todos")
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

    return visibleProducts.filter((product) => {
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
  }, [visibleProducts, search, style, gender])

  function clearFilters() {
    setSearch("")
    setStyle("Todos")
    setGender("Todos")
    setShowMobileFilters(false)
  }

  const hasFilter = search || style !== "Todos" || gender !== "Todos"

  return (
    <section className="bg-black px-3 py-6 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 text-center sm:mb-10">
          <p className="mb-2 text-[11px] font-black tracking-[0.35em] text-primary sm:text-sm">COLEÇÃO LW</p>
          <h2 className="mb-2 text-2xl font-black text-primary sm:text-3xl">DROP 001 — GOLD BLACK</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Procure pelo nome da peça ou filtre por estilo e público.
          </p>
        </div>

        <div className="sticky top-[94px] z-30 mb-5 rounded-2xl border border-primary/20 bg-black/90 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl sm:static sm:mb-8 sm:bg-card/80 sm:p-5">
          <div className="flex gap-2 lg:grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto] lg:items-end">
            <label className="relative block flex-1 lg:flex-none">
              <span className="mb-2 hidden text-xs font-black uppercase tracking-[0.2em] text-primary sm:block">Procurar por nome</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary sm:top-[calc(50%+12px)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar peça..."
                className="h-11 w-full rounded-full border border-primary/20 bg-zinc-950 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary sm:h-auto sm:rounded-xl sm:py-3"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-primary/25 px-4 text-xs font-black text-primary lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtrar
            </button>

            <label className="hidden lg:block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-primary">Estilo</span>
              <select
                value={style}
                onChange={(event) => setStyle(event.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-sm font-bold text-foreground outline-none transition focus:border-primary"
              >
                {styles.map((item) => (
                  <option key={item} value={item}>
                    {item === "Todos" ? "Todos os estilos" : item}
                  </option>
                ))}
              </select>
            </label>

            <label className="hidden lg:block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-primary">Público</span>
              <select
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-sm font-bold text-foreground outline-none transition focus:border-primary"
              >
                {genders.map((item) => (
                  <option key={item} value={item}>
                    {item === "Todos" ? "Masculino e feminino" : item}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="hidden rounded-xl border border-primary/25 px-5 py-3 text-sm font-black text-primary transition hover:bg-primary/10 lg:block"
            >
              Limpar
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground sm:mt-4 sm:text-sm">
            <p>
              {loading
                ? "Carregando peças online..."
                : `${filteredProducts.length} peça${filteredProducts.length === 1 ? "" : "s"}`}
            </p>
            <button type="button" onClick={loadProducts} className="font-black text-primary hover:underline">
              Atualizar
            </button>
          </div>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t-3xl border border-primary/20 bg-card p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-black text-primary">Filtros</h3>
                <button onClick={() => setShowMobileFilters(false)} className="rounded-full border border-primary/20 p-2 text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-primary">Estilo</span>
                  <select
                    value={style}
                    onChange={(event) => setStyle(event.target.value)}
                    className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-sm font-bold text-foreground outline-none"
                  >
                    {styles.map((item) => (
                      <option key={item} value={item}>
                        {item === "Todos" ? "Todos os estilos" : item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-primary">Público</span>
                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-sm font-bold text-foreground outline-none"
                  >
                    {genders.map((item) => (
                      <option key={item} value={item}>
                        {item === "Todos" ? "Masculino e feminino" : item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={clearFilters} className="rounded-xl border border-primary/25 px-5 py-3 text-sm font-black text-primary">
                  Limpar
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-black"
                >
                  Ver peças
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center sm:p-10">
            <h3 className="text-2xl font-black text-primary">Nenhuma peça encontrada</h3>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Tente procurar outro nome, escolher outro estilo ou trocar o filtro masculino/feminino.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-primary px-6 py-3 font-black text-black transition hover:bg-primary/90"
            >
              Ver coleção completa
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
