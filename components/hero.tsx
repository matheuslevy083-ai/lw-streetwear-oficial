import Image from "next/image"
import { ChevronRight, ShieldCheck, Truck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-primary/15 bg-black">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-16">
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-xs">
            DROP 001 — GOLD BLACK
          </div>

          <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            STREETWEAR <span className="text-primary">URBANO</span> EM DROP LIMITADO
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-lg">
            Peças selecionadas, visual premium preto e dourado, reserva rápida e atendimento final pelo WhatsApp.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#colecao" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black text-black transition hover:bg-primary/90">
              Ver coleção <ChevronRight className="h-4 w-4" />
            </a>
            <button className="rounded-full border border-primary/30 px-5 py-3 text-sm font-black text-primary transition hover:bg-primary/10">
              Como reservar
            </button>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-3">
            <div className="rounded-2xl border border-primary/15 bg-white/[0.03] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Coleção</p>
              <p className="mt-1 text-lg font-black text-white">Limitada</p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-white/[0.03] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Entrega</p>
              <p className="mt-1 text-lg font-black text-white">10–15 dias</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-primary/15 bg-white/[0.03] p-4 sm:col-span-1">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Reserva</p>
              <p className="mt-1 text-lg font-black text-white">Via Pix</p>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-[470px] lg:block">
          <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute right-14 top-6 h-[430px] w-[330px] overflow-hidden rounded-[2rem] border border-primary/20 bg-zinc-950 shadow-2xl shadow-primary/10">
            <Image src="/black-oversized-streetwear-t-shirt.jpg" alt="Camiseta LW" fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Mais vendida</p>
              <p className="mt-1 text-2xl font-black text-white">Camiseta Oversized</p>
              <p className="mt-1 text-xl font-black text-primary">R$ 89,90</p>
            </div>
          </div>
          <div className="absolute bottom-7 left-4 rounded-2xl border border-primary/20 bg-black/85 p-4 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-black text-white">Entrega nacional</p>
                <p className="text-xs text-zinc-400">Prazo informado no checkout</p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-10 rounded-2xl border border-primary/20 bg-black/85 p-4 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-black text-white">Drop reservado</p>
                <p className="text-xs text-zinc-400">Finalização pelo WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_30%)]" />
    </section>
  )
}
