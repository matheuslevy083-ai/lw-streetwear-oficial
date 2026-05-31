"use client"

import { getProductImages, type Product } from "@/lib/products"
import Image from "next/image"
import { CalendarDays, Heart, ShoppingBag } from "lucide-react"
import { useState } from "react"
import { ProductModal } from "./product-modal"

interface ProductCardProps {
  product: Product
}

function formatPrice(value: number) {
  return value.toFixed(2).replace(".", ",")
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
        className="group cursor-pointer overflow-hidden rounded border border-white/10 bg-[#080808] shadow-xl shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-primary/10"
      >
        <div className="relative aspect-[1/1.02] overflow-hidden bg-[radial-gradient(circle_at_center,#34302a,#111)]">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-[8px] font-black uppercase tracking-wide text-black lg:text-[10px]">
            {product.dropName?.includes("SUMMER") ? "Summer '24" : "Core"}
          </div>
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-primary hover:text-black"
            aria-label="Favoritar"
          >
            <Heart className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-1 text-[9px] font-black text-primary backdrop-blur">
              +{images.length - 1} fotos
            </div>
          )}
        </div>

        <div className="space-y-2 p-3 lg:p-4">
          <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-black uppercase leading-tight tracking-[0.02em] text-white transition group-hover:text-primary lg:text-base">
            {product.name}
          </h3>
          <p className="hidden text-[12px] font-bold uppercase tracking-[0.08em] text-zinc-500 lg:block">
            Oversized fit
          </p>

          <div>
            <span className="block text-base font-black text-primary lg:text-xl">R$ {formatPrice(product.price)}</span>
            <span className="text-[10px] font-semibold text-zinc-500 lg:text-xs">4x de R$ {formatPrice(installment)}</span>
          </div>

          <button className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-none border border-primary/70 text-[10px] font-black uppercase tracking-[0.14em] text-primary transition group-hover:bg-primary group-hover:text-black lg:text-xs">
            {product.reservationPrice ? "Reserve" : "Buy now"}
            {product.reservationPrice ? <CalendarDays className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </article>

      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
