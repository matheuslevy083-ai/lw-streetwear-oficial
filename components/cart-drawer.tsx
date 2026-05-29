"use client"

import { useCart } from "@/contexts/cart-context"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getProductImages } from "@/lib/products"

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, isOpen, setIsOpen, setIsCheckoutOpen, totalItems, totalPrice } =
    useCart()

  const handleCheckout = () => {
    if (items.length === 0) return
    setIsOpen(false)
    setIsCheckoutOpen(true)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card border-l border-primary/20 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Reservas ({totalItems})</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Nenhuma reserva selecionada</p>
              <p className="text-sm mt-1">Escolha uma peça do drop para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-3 p-3 bg-black/30 border border-primary/10 rounded-lg"
                >
                  <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={getProductImages(item.product)[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">Tamanho: {item.size}</p>
                    <p className="text-primary font-bold mt-1">R$ {item.product.price.toFixed(2)}</p>
                    {item.product.reservationPrice && (
                      <p className="text-xs text-muted-foreground">
                        Valor de reserva: R$ {item.product.reservationPrice.toFixed(2)}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-primary/30 rounded hover:bg-primary/20 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-primary/30 rounded hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="ml-auto text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-primary/20 space-y-4">
            <div className="rounded-lg border border-primary/20 bg-black/30 p-3 text-xs text-muted-foreground">
              Pré-venda: a produção começa após o fechamento do drop. O prazo estimado é de 10 a 15 dias úteis.
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total das peças:</span>
              <span className="text-2xl font-bold text-primary">R$ {totalPrice.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-6 text-lg"
            >
              Finalizar Reserva
            </Button>
            <button
              onClick={clearCart}
              className="w-full text-sm text-muted-foreground hover:text-red-500 transition-colors"
            >
              Limpar reservas
            </button>
          </div>
        )}
      </div>
    </>
  )
}
