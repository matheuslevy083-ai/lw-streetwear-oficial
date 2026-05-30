"use client"

import { getProductImages, type Product } from "@/lib/products"
import Image from "next/image"
import { X, ShoppingBag, Truck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "")
  const [selectedImage, setSelectedImage] = useState<string>(getProductImages(product)[0])
  const { addItem } = useCart()
  const images = getProductImages(product)

  if (!isOpen) return null

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) return
    addItem(product, selectedSize || "Único")
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/82 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-[2rem] border border-primary/25 bg-zinc-950 shadow-2xl shadow-black sm:max-w-5xl sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/15 bg-zinc-950/95 p-4 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">{product.dropName || "LW STREETWEAR"}</p>
            <h2 className="line-clamp-1 text-lg font-black text-white sm:text-2xl">{product.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-primary/20 p-2 text-muted-foreground transition-colors hover:text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-4 sm:gap-7 sm:p-6 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-black sm:aspect-square">
              <Image src={selectedImage || images[0]} alt={product.name} fill unoptimized className="object-cover" />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border transition sm:h-auto sm:w-auto sm:aspect-square ${
                      selectedImage === image ? "border-primary" : "border-primary/20 hover:border-primary/60"
                    }`}
                  >
                    <Image src={image} alt={`${product.name} foto ${index + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-4 text-sm leading-relaxed text-zinc-300 sm:text-base">{product.description}</p>

              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-primary/15 bg-black/40 p-3">
                  <Truck className="mb-2 h-4 w-4 text-primary" />
                  <p className="text-xs font-black text-white">Entrega</p>
                  <p className="text-[11px] text-zinc-500">10 a 15 dias úteis</p>
                </div>
                <div className="rounded-2xl border border-primary/15 bg-black/40 p-3">
                  <CreditCard className="mb-2 h-4 w-4 text-primary" />
                  <p className="text-xs font-black text-white">Reserva</p>
                  <p className="text-[11px] text-zinc-500">Pix ou WhatsApp</p>
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <h3 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-primary">Selecione o tamanho</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 rounded-2xl border px-4 py-2 text-sm font-black transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary text-black"
                            : "border-primary/30 text-foreground hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-5 rounded-3xl border border-primary/15 bg-black/40 p-4">
                <span className="block text-3xl font-black text-primary sm:text-4xl">R$ {product.price.toFixed(2)}</span>
                <p className="mt-1 text-sm text-zinc-400">4x de R$ {(product.price / 4).toFixed(2)}</p>
                {product.reservationPrice && (
                  <p className="mt-3 text-sm text-foreground">
                    Reserva: <span className="font-black text-primary">R$ {product.reservationPrice.toFixed(2)}</span>. O restante é combinado no atendimento.
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="sticky bottom-0 w-full gap-2 rounded-2xl bg-primary py-6 text-base font-black text-black hover:bg-primary/90 sm:static sm:text-lg"
            >
              <ShoppingBag className="h-5 w-5" />
              ADICIONAR À RESERVA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
