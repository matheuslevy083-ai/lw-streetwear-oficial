"use client"

import { getProductImages, type Product } from "@/lib/products"
import Image from "next/image"
import { useState } from "react"
import { ProductModal } from "./product-modal"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const images = getProductImages(product)
  const mainImage = images[0]

  return (
    <>
      <article
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-primary/20"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950 sm:aspect-square">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-2 top-2 rounded-full bg-black/75 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-primary backdrop-blur sm:left-3 sm:top-3 sm:text-xs">
            Drop 001
          </div>

          {images.length > 1 && (
            <div className="absolute right-2 top-2 rounded-full border border-primary/30 bg-black/80 px-2 py-1 text-[9px] font-black text-primary backdrop-blur sm:right-3 sm:top-3 sm:text-xs">
              +{images.length - 1} fotos
            </div>
          )}
        </div>

        <div className="space-y-2 p-3 sm:p-4">
          <h3 className="line-clamp-2 min-h-[38px] text-sm font-black leading-tight text-foreground transition-colors group-hover:text-primary sm:min-h-0 sm:text-base">
            {product.name}
          </h3>

          <p className="hidden text-sm text-muted-foreground sm:line-clamp-2">{product.description}</p>

          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="block text-lg font-black text-primary sm:text-2xl">R$ {product.price.toFixed(2)}</span>
              {product.reservationPrice && (
                <span className="text-[10px] font-semibold text-muted-foreground sm:text-xs">
                  Reserva: R$ {product.reservationPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <p className="truncate text-[10px] text-muted-foreground sm:text-xs">Tam: {product.sizes.join(", ")}</p>
          )}
        </div>
      </article>

      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
