"use client"

import { getProductImages, type Product } from "@/lib/products"
import Image from "next/image"
import { X, ShoppingBag } from "lucide-react"
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-primary/30 bg-card sm:max-w-4xl sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/20 bg-card p-4">
          <div>
            <p className="text-xs font-bold text-primary tracking-[0.25em]">{product.dropName || "LW STREETWEAR"}</p>
            <h2 className="text-lg font-black text-primary sm:text-2xl">{product.name}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/50">
              <Image src={selectedImage || images[0]} alt={product.name} fill unoptimized className="object-cover" />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-4">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-square overflow-hidden rounded-lg border transition ${
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
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:mb-5 sm:text-lg">{product.description}</p>

              <div className="mb-5 space-y-2 rounded-2xl border border-primary/20 bg-black/30 p-4 sm:mb-6">
                <p className="text-sm text-foreground">
                  <span className="text-primary font-bold">Coleção:</span> {product.dropName || "LW Streetwear"}
                </p>
                <p className="text-sm text-foreground">
                  <span className="text-primary font-bold">Prazo:</span> {product.deliveryEstimate}
                </p>
                <p className="text-xs text-muted-foreground">
                  O atendimento continua pelo WhatsApp para confirmar tamanho, pagamento e entrega.
                </p>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">SELECIONE O TAMANHO:</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg transition-all relative ${
                          selectedSize === size
                            ? "border-primary bg-primary text-black font-semibold"
                            : "border-primary/30 text-foreground hover:border-primary"
                        }`}
                      >
                        <span className="block">{size}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6 space-y-2">
                <span className="text-3xl font-black text-primary sm:text-4xl">R$ {product.price.toFixed(2)}</span>
                {product.reservationPrice && (
                  <p className="text-sm text-foreground">
                    Valor de reserva: <span className="text-primary font-bold">R$ {product.reservationPrice.toFixed(2)}</span>{" "}
                    e o restante combinado pelo WhatsApp.
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full gap-2 rounded-2xl bg-primary py-6 text-base font-black text-black hover:bg-primary/90 sm:text-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              ADICIONAR À RESERVA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
