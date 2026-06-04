"use client"

import { getProductImages, type Product } from "@/lib/products"
import Image from "next/image"
import { Heart } from "lucide-react"
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
        className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#090909] shadow-xl shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[0_0_28px_rgba(212,175,55,0.12)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_center,#2b271f,#0f0f0f_62%)]">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          <div className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-black lg:text-[10px]">
            Novo
          </div>
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-primary hover:text-black"
            aria-label="Favoritar"
          >
            <Heart className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-full bg-black/80 px-2 py-1 text-[9px] font-black text-primary backdrop-blur">
              +{images.length - 1} fotos
            </div>
          )}
        </div>

        <div className="flex min-h-[145px] flex-col p-3 lg:min-h-[180px] lg:p-4">
          <h3 className="line-clamp-2 min-h-[34px] text-[12px] font-black uppercase leading-tight tracking-[0.02em] text-white transition group-hover:text-primary sm:text-[13px] lg:text-base">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-zinc-500 sm:text-[11px] lg:text-xs">
            {product.description || "Peça premium da coleção LW Streetwear."}
          </p>

          <div className="mt-auto pt-3">
            <span className="block text-base font-black text-primary lg:text-xl">R$ {formatPrice(product.price)}</span>
            <span className="text-[10px] font-semibold text-zinc-500 lg:text-xs">4x de R$ {formatPrice(installment)}</span>
          </div>
        </div>
      </article>

      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
