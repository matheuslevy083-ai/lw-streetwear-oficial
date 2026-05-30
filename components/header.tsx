"use client"

import Link from "next/link"
import Image from "next/image"
import { Home, Menu, Search, ShoppingBag, UserCog } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function Header() {
  const { setIsOpen, totalItems } = useCart()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-primary/15 bg-black/95 backdrop-blur-xl">
        <div className="bg-primary px-3 py-2 text-center text-[10px] font-black uppercase tracking-[0.08em] text-black sm:text-xs">
          DROP 001 • RESERVE SUA PEÇA • ENTREGA EM 10 A 15 DIAS ÚTEIS
        </div>

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-20 sm:px-6 lg:px-8">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 text-primary lg:hidden" aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="relative h-12 w-28 rounded bg-black transition-opacity hover:opacity-80 sm:h-16 sm:w-40">
            <Image src="/logo-lw.png" alt="LW Streetwear" fill className="object-contain mix-blend-lighten" priority />
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-black uppercase tracking-[0.18em] text-zinc-300 lg:flex">
            <a href="#colecao" className="transition hover:text-primary">Coleção</a>
            <a href="#categorias" className="transition hover:text-primary">Categorias</a>
            <a href="#novidades" className="transition hover:text-primary">Novidades</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href="#colecao" className="hidden h-10 items-center gap-2 rounded-full border border-primary/20 px-4 text-sm font-black text-primary transition hover:bg-primary/10 sm:flex">
              <Search className="h-4 w-4" />
              Buscar
            </a>

            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-1.5 rounded-full border border-primary/25 px-4 text-xs font-black text-primary transition-colors hover:bg-primary/10 sm:flex"
            >
              <UserCog className="h-4 w-4" />
              Admin
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative flex h-10 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-black text-black transition-colors hover:bg-primary/90 sm:px-4 sm:text-sm"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden min-[390px]:inline">Reservas</span>
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-primary/15 bg-black/95 px-2 py-2 text-[10px] font-bold text-zinc-400 backdrop-blur-xl sm:hidden">
        <a href="/" className="flex flex-col items-center gap-1 text-primary"><Home className="h-5 w-5" />Início</a>
        <a href="#colecao" className="flex flex-col items-center gap-1"><Search className="h-5 w-5" />Buscar</a>
        <button onClick={() => setIsOpen(true)} className="flex flex-col items-center gap-1"><ShoppingBag className="h-5 w-5" />Reservas</button>
        <Link href="/admin" className="flex flex-col items-center gap-1"><UserCog className="h-5 w-5" />Admin</Link>
      </nav>
    </>
  )
}
