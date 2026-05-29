"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, UserCog } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function Header() {
  const { setIsOpen, totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-primary/20">
      <div className="bg-primary text-black text-center text-xs sm:text-sm font-black tracking-wide py-2 px-4">
        DROP 001 • RESERVE SUA PEÇA • ENTREGA EM 10 A 15 DIAS ÚTEIS APÓS O FECHAMENTO DO LOTE
      </div>
      <div className="flex items-center justify-between h-28 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative h-24 w-56 hover:opacity-80 transition-opacity bg-background rounded">
          <Image src="/logo-lw.png" alt="LW StreetWear" fill className="object-contain mix-blend-lighten" priority />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
          >
            <UserCog className="w-5 h-5" />
            Admin
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Reservas</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
