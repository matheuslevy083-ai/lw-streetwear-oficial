"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Grid2X2, Home, Menu, Search, ShieldCheck, ShoppingBag, User, UserCog } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

function BrandLogo({ mobile = false }: { mobile?: boolean }) {
  return (
    <Link href="/" className="group flex items-center justify-center" aria-label="LW Streetwear">
      <Image
        src="/logo-lw.png"
        alt="LW Streetwear"
        width={mobile ? 92 : 142}
        height={mobile ? 92 : 142}
        priority
        className={`${mobile ? "h-[58px] w-[58px]" : "h-[86px] w-[86px]"} rounded-full object-contain drop-shadow-[0_0_28px_rgba(212,175,55,0.38)] transition duration-300 group-hover:scale-[1.04]`}
      />
    </Link>
  )
}

export function Header() {
  const { setIsOpen, totalItems } = useCart()

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#2a210c] bg-black/96 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="bg-[linear-gradient(90deg,#b68619,#f4cf70,#b68619)] px-3 py-2 text-center text-[10px] font-black uppercase tracking-[0.14em] text-black lg:text-[11px]">
          🚚 Frete grátis acima de R$150 <span className="mx-3">|</span> ✦ New Drop • Peças limitadas
        </div>

        <div className="mx-auto hidden h-[92px] max-w-[1440px] grid-cols-[190px_1fr_430px] items-center gap-8 px-8 xl:px-12 lg:grid">
          <div className="flex items-center justify-start">
            <BrandLogo />
          </div>

          <a
            href="#colecao"
            className="group mx-auto flex h-12 w-full max-w-[560px] items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.035] px-5 text-sm text-zinc-500 transition hover:border-primary/50 hover:bg-white/[0.055] hover:text-zinc-300"
          >
            <Search className="h-5 w-5 text-zinc-400 group-hover:text-primary" />
            Buscar produtos, coleções e novidades...
          </a>

          <div className="flex items-center justify-end gap-5 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-200">
            <a href="#" className="flex items-center gap-2 transition hover:text-primary">
              <User className="h-5 w-5" /> Conta
            </a>
            <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 transition hover:text-primary">
              <CalendarDays className="h-5 w-5" /> Reservas
            </button>
            <Link href="/admin" target="_blank" className="flex items-center gap-2 transition hover:text-primary">
              <ShieldCheck className="h-5 w-5 text-primary" /> Admin
            </Link>
            <button onClick={() => setIsOpen(true)} className="relative flex items-center transition hover:text-primary" aria-label="Abrir reservas">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-black">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto grid h-[74px] grid-cols-[44px_1fr_44px] items-center px-4 lg:hidden">
          <button className="flex h-11 w-11 items-center justify-center rounded-full text-white" aria-label="Menu">
            <Menu className="h-7 w-7" />
          </button>
          <BrandLogo mobile />
          <button onClick={() => setIsOpen(true)} className="relative flex h-11 w-11 items-center justify-center rounded-full text-white" aria-label="Reservas">
            <ShoppingBag className="h-7 w-7" />
            <span className="absolute right-0 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-black">
              {totalItems}
            </span>
          </button>
        </div>

        <div className="mx-auto px-4 pb-3 lg:hidden">
          <a href="#colecao" className="flex h-11 items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.035] px-4 text-[13px] text-zinc-500">
            <Search className="h-4 w-4" /> Buscar produtos, coleções e novidades...
          </a>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-white/10 bg-black/95 px-2 py-2 text-[9px] font-black uppercase tracking-wide text-zinc-400 backdrop-blur-xl lg:hidden">
        <a href="/" className="flex flex-col items-center gap-1 text-primary"><Home className="h-5 w-5" />Início</a>
        <a href="#colecao" className="flex flex-col items-center gap-1"><Search className="h-5 w-5" />Buscar</a>
        <a href="#categorias" className="flex flex-col items-center gap-1"><Grid2X2 className="h-5 w-5" />Categorias</a>
        <button onClick={() => setIsOpen(true)} className="flex flex-col items-center gap-1"><CalendarDays className="h-5 w-5" />Reservas</button>
        <Link href="/admin" className="flex flex-col items-center gap-1"><UserCog className="h-5 w-5" />Admin</Link>
      </nav>
    </>
  )
}
