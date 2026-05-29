"use client"

import { useCart } from "@/contexts/cart-context"
import { pixConfig, whatsappConfig } from "@/lib/config"
import { X, CreditCard, MessageCircle, ArrowLeft, HelpCircle, Copy, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type PaymentMethod = "pix" | "card" | "delivery" | null

export function CheckoutModal() {
  const { items, totalPrice, isCheckoutOpen, setIsCheckoutOpen } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)

  const reservationTotal = items.reduce(
    (sum, item) => sum + (item.product.reservationPrice || item.product.price) * item.quantity,
    0,
  )
  const remainingTotal = Math.max(totalPrice - reservationTotal, 0)

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixConfig.key)
    } catch {
      // Se o navegador bloquear a cópia, a chave continua visível na tela.
    }
  }

  const handleFinalize = () => {
    if (!paymentMethod) return

    const itemsList = items
      .map((item) => {
        const reservation = item.product.reservationPrice || item.product.price
        return `- ${item.product.name} (Tam: ${item.size}) x${item.quantity}\n  Valor da peça: R$ ${(item.product.price * item.quantity).toFixed(2)}\n  Reserva sugerida: R$ ${(reservation * item.quantity).toFixed(2)}`
      })
      .join("\n\n")

    let paymentText = ""
    if (paymentMethod === "pix") {
      paymentText = `💠 *Pagamento via Pix*\nChave Pix: ${pixConfig.key}\nNome: ${pixConfig.receiverName}\n(Enviei/irei enviar o comprovante pelo WhatsApp para confirmar a reserva)`
    } else if (paymentMethod === "card") {
      paymentText = "💳 *Pagamento por cartão*\n(Quero receber o link de pagamento para reservar)"
    } else if (paymentMethod === "delivery") {
      paymentText = "💵 *Combinar pelo WhatsApp*\n(Quero confirmar disponibilidade e forma de pagamento)"
    }

    const message = `Olá! Quero reservar peça(s) da pré-venda LW Streetwear:\n\n${itemsList}\n\n*Total das peças: R$ ${totalPrice.toFixed(2)}*\n*Valor de reserva estimado: R$ ${reservationTotal.toFixed(2)}*\n*Restante estimado: R$ ${remainingTotal.toFixed(2)}*\n\nPrazo informado no site: 10 a 15 dias úteis após o fechamento do drop.\n\n${paymentText}`
    const whatsappUrl = `https://wa.me/${whatsappConfig.phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (!isCheckoutOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-card border border-primary/20 rounded-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <div>
            <p className="text-xs font-bold text-primary tracking-[0.25em]">DROP 001 — PRÉ-VENDA</p>
            <h2 className="text-xl font-bold text-foreground">Finalizar Reserva</h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">RESUMO DA RESERVA</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex justify-between gap-4 text-sm">
                  <span className="text-foreground">
                    {item.product.name} (Tam: {item.size}) x{item.quantity}
                  </span>
                  <span className="text-primary font-semibold whitespace-nowrap">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="space-y-1 pt-2 border-t border-primary/20">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total das peças</span>
                  <span className="text-primary">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reserva estimada</span>
                  <span className="text-primary font-semibold">R$ {reservationTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Restante estimado</span>
                  <span className="text-foreground font-semibold">R$ {remainingTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
            <p className="text-sm text-foreground font-semibold mb-1">Como funciona a pré-venda?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Você envia a reserva pelo WhatsApp, confirma a forma de pagamento e garante seu tamanho no primeiro
              lote. A produção começa após o fechamento do drop. Entrega estimada: 10 a 15 dias úteis.
            </p>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">FORMA DE PAGAMENTO</h3>
            <div className="space-y-3">
              {/* Pix */}
              <button
                onClick={() => setPaymentMethod("pix")}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === "pix"
                    ? "border-primary bg-primary/10"
                    : "border-primary/20 bg-black/30 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      paymentMethod === "pix" ? "bg-primary text-background" : "bg-primary/20 text-primary"
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Pagar com Pix</p>
                    <p className="text-xs text-muted-foreground">Copie a chave Pix e envie o comprovante pelo WhatsApp</p>
                  </div>
                </div>
              </button>


              {/* Card */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/10"
                    : "border-primary/20 bg-black/30 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      paymentMethod === "card" ? "bg-primary text-background" : "bg-primary/20 text-primary"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Pagar por Cartão</p>
                    <p className="text-xs text-muted-foreground">Receba o link de pagamento pelo WhatsApp</p>
                  </div>
                </div>
              </button>

              {/* Payment on Delivery */}
              <button
                onClick={() => setPaymentMethod("delivery")}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === "delivery"
                    ? "border-primary bg-primary/10"
                    : "border-primary/20 bg-black/30 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      paymentMethod === "delivery" ? "bg-primary text-background" : "bg-primary/20 text-primary"
                    }`}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Combinar pelo WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Tire dúvidas antes de reservar</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Pix Info */}
          {paymentMethod === "pix" && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Chave Pix para reserva</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Copie a chave, faça o pagamento da reserva e envie o comprovante no WhatsApp.
                </p>
              </div>
              <div className="rounded-md border border-primary/20 bg-black/40 p-3">
                <p className="text-xs text-muted-foreground">Chave Pix</p>
                <p className="text-sm font-bold text-primary break-all">{pixConfig.key}</p>
                <p className="text-xs text-muted-foreground mt-1">Nome: {pixConfig.receiverName}</p>
              </div>
              <Button
                type="button"
                onClick={handleCopyPix}
                className="w-full bg-primary hover:bg-primary/90 text-background font-bold gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar chave Pix
              </Button>
            </div>
          )}


          {/* Card Info */}
          {paymentMethod === "card" && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-foreground">
                Após continuar, você receberá o link de pagamento seguro pelo WhatsApp.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary/20 space-y-3">
          <Button
            onClick={handleFinalize}
            disabled={!paymentMethod}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-5 h-5" />
            {paymentMethod === "pix" ? "Enviar comprovante no WhatsApp" : "Continuar no WhatsApp"}
          </Button>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar às reservas
          </button>
        </div>
      </div>
    </>
  )
}
