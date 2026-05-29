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
      <div
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer bg-card border border-primary/20 rounded-lg overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
      >
        <div className="aspect-square relative overflow-hidden bg-black/50">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {images.length > 1 && (
            <div className="absolute right-3 top-3 rounded-full border border-primary/30 bg-black/80 px-3 py-1 text-xs font-black text-primary">
              +{images.length - 1} fotos
            </div>
          )}
          {product.dropName && (
            <div className="absolute bottom-3 left-3 right-3 rounded-md bg-black/75 border border-primary/30 px-3 py-2">
              <p className="text-xs font-bold text-primary">{product.dropName}</p>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-2xl font-bold text-primary">R$ {product.price.toFixed(2)}</span>
              {product.sizes && (
                <span className="text-xs text-muted-foreground text-right">Tamanhos: {product.sizes.join(", ")}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{product.deliveryEstimate}</p>
          </div>
        </div>
      </div>

      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
