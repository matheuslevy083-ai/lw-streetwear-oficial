"use client"

import { getProductImages, type Product } from "@/lib/products"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
import { useState } from "react"
import { ProductModal } from "./product-modal"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const images = getProductImages(product)
  const mainImage = images[0]
  const installment = product.price / 4

  return (
    <>
      <article
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-zinc-950 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/10 sm:rounded-3xl"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[9px] font-black uppercase tracking-wide text-black shadow-lg sm:left-3 sm:top-3 sm:text-[10px]">
            Novo
          </div>

          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:text-primary sm:right-3 sm:top-3"
            aria-label="Favoritar"
          >
            <Heart className="h-4 w-4" />
          </button>

          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-full border border-primary/30 bg-black/80 px-2 py-1 text-[9px] font-black text-primary backdrop-blur sm:text-xs">
              +{images.length - 1} fotos
            </div>
          )}
        </div>

        <div className="space-y-2 p-3 sm:p-4">
          <div className="min-h-[42px]">
            <h3 className="line-clamp-2 text-[13px] font-black leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
              {product.name}
            </h3>
          </div>

          <p className="hidden text-sm text-muted-foreground sm:line-clamp-2">{product.description}</p>

          <div>
            <span className="block text-lg font-black text-primary sm:text-2xl">R$ {product.price.toFixed(2)}</span>
            <span className="text-[10px] font-semibold text-zinc-500 sm:text-xs">4x de R$ {installment.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {product.sizes && product.sizes.length > 0 ? (
              <p className="truncate text-[10px] text-muted-foreground sm:text-xs">Tam: {product.sizes.join(", ")}</p>
            ) : (
              <p className="text-[10px] text-muted-foreground sm:text-xs">Tamanho único</p>
            )}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary transition group-hover:bg-primary group-hover:text-black">
              <ShoppingBag className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>

      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
