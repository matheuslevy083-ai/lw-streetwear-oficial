import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#2a210c] bg-[#030303]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(212,175,55,0.16),transparent_35%),linear-gradient(90deg,#030303_0%,#050505_44%,rgba(5,5,5,0.78)_68%,rgba(5,5,5,0.28)_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(135deg,rgba(255,255,255,0.05)_25%,transparent_25%),linear-gradient(225deg,rgba(255,255,255,0.035)_25%,transparent_25%)] [background-size:44px_44px]" />

      <div className="relative mx-auto max-w-[1440px] px-4 py-6 lg:px-8 lg:py-0 xl:px-12">
        <div className="grid min-h-[390px] items-center gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 xl:min-h-[455px]">
          <div className="z-10 max-w-[760px] py-4 lg:py-10">
            <p className="mb-4 inline-flex rounded-full border border-primary/45 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-primary">
              Drop 001 — Gold Black
            </p>
            <h1 className="max-w-[720px] text-[42px] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-6xl lg:text-[70px] xl:text-[78px]">
              Streetwear<br /><span className="text-primary">urbano</span> em<br />drop limitado
            </h1>
            <p className="mt-5 max-w-[540px] text-sm leading-relaxed text-zinc-300 lg:text-base">
              Peças selecionadas, visual premium preto e dourado, reserva rápida e atendimento final pelo WhatsApp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#colecao" className="inline-flex h-12 items-center gap-3 rounded-full bg-primary px-6 text-[12px] font-black uppercase tracking-wide text-black transition hover:brightness-110">
                Ver coleção <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#como-reservar" className="inline-flex h-12 items-center rounded-full border border-primary/60 px-6 text-[12px] font-black uppercase tracking-wide text-primary transition hover:bg-primary hover:text-black">
                Como reservar
              </a>
            </div>
            <div className="mt-7 grid max-w-[620px] grid-cols-3 gap-3">
              <div className="rounded-2xl border border-primary/25 bg-black/50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Coleção</p>
                <p className="mt-1 text-lg font-black text-white">Limitada</p>
              </div>
              <div className="rounded-2xl border border-primary/25 bg-black/50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Entrega</p>
                <p className="mt-1 text-lg font-black text-white">10–15 dias</p>
              </div>
              <div className="rounded-2xl border border-primary/25 bg-black/50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Reserva</p>
                <p className="mt-1 text-lg font-black text-white">Via Pix</p>
              </div>
            </div>
          </div>

          <div className="relative h-[310px] overflow-hidden rounded-[28px] border border-primary/25 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14),transparent_55%)] shadow-[0_0_70px_rgba(212,175,55,0.12)] lg:h-[395px] xl:h-[430px]">
            <Image
              src="/black-hoodie-with-gold-details-streetwear.jpg"
              alt="Moletom LW Gold Edition"
              fill
              priority
              className="object-cover object-center brightness-[0.84] contrast-110 saturate-95"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
