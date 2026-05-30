"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, UserCog } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function Header() {
  const { setIsOpen, totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/95 backdrop-blur-xl">
      <div className="bg-primary px-3 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.06em] text-black sm:py-2 sm:text-sm sm:tracking-wide">
        DROP 001 • RESERVE SUA PEÇA • ENTREGA EM 10 A 15 DIAS ÚTEIS
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-24 sm:px-6 lg:px-8">
        <Link href="/" className="relative h-14 w-28 rounded bg-background transition-opacity hover:opacity-80 sm:h-20 sm:w-48">
          <Image src="/logo-lw.png" alt="LW StreetWear" fill className="object-contain mix-blend-lighten" priority />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center gap-1.5 rounded-full border border-primary/30 px-3 text-xs font-black text-primary transition-colors hover:bg-primary/10 sm:h-auto sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm"
          >
            <UserCog className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden min-[380px]:inline">Admin</span>
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex h-10 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-black text-black transition-colors hover:bg-primary/90 sm:h-auto sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Reservas</span>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
