"use client"

import type { Product } from "@/lib/products"
import { useEffect, useMemo, useState } from "react"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: Product[]
}

const STORAGE_KEY = "lw-admin-products"
const styles = ["Todos", "Camisetas", "Moletons", "Calças", "Jaquetas", "Bermudas"]
const genders = ["Todos", "Masculino", "Feminino", "Unissex"]

function readAdminProducts(fallback: Product[]) {
  if (typeof window === "undefined") return fallback

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return fallback

  try {
    const parsed = JSON.parse(stored) as Product[]
    if (!Array.isArray(parsed)) return fallback
    return parsed
  } catch {
    return fallback
  }
}

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
  const [search, setSearch] = useState("")
  const [style, setStyle] = useState("Todos")
  const [gender, setGender] = useState("Todos")

  useEffect(() => {
    setVisibleProducts(readAdminProducts(products))

    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setVisibleProducts(readAdminProducts(products))
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
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
  }

  return (
    <section className="bg-black px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-primary">COLEÇÃO LW</p>
          <h2 className="mb-3 text-3xl font-bold text-primary">DROP 001 — GOLD BLACK</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Procure pelo nome da peça, escolha o estilo e filtre por masculino ou feminino.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-primary/20 bg-card/80 p-4 shadow-lg shadow-primary/5 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-primary">Procurar por nome</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ex: camiseta, cargo, moletom..."
                className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary"
              />
            </label>

            <label className="block">
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

            <label className="block">
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
              className="rounded-xl border border-primary/30 px-5 py-3 text-sm font-black text-primary transition hover:bg-primary hover:text-black"
            >
              Limpar
            </button>
          </div>

          <div className="mt-5 flex justify-end">
            <p className="text-sm font-bold text-muted-foreground">
              {filteredProducts.length} peça{filteredProducts.length === 1 ? "" : "s"} encontrada
              {filteredProducts.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-primary/20 bg-card p-10 text-center">
            <h3 className="text-2xl font-black text-primary">Nenhuma peça encontrada</h3>
            <p className="mt-3 text-muted-foreground">Tente procurar outro nome, escolher outro estilo ou trocar o filtro masculino/feminino.</p>
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
