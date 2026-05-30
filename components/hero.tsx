export function Hero() {
  return (
    <section className="relative border-b border-primary/20 bg-black px-4 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:mb-6 sm:px-4 sm:py-2 sm:text-xs">
          DROP 001 — GOLD BLACK
        </div>

        <h1 className="mb-3 text-4xl font-black tracking-tight text-primary sm:mb-6 sm:text-6xl lg:text-7xl">LW STREETWEAR</h1>
        <p className="mx-auto mb-5 max-w-2xl text-sm font-light leading-relaxed text-muted-foreground sm:mb-8 sm:text-2xl">
          Estilo urbano autêntico em lote limitado. Escolha sua peça e finalize pelo WhatsApp.
        </p>

        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-primary/20 bg-card/70 p-4 text-left shadow-lg shadow-primary/5 sm:p-5">
            <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-primary sm:text-sm">Coleção</p>
            <p className="text-lg font-black text-foreground sm:text-2xl">limitada</p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-card/70 p-4 text-left shadow-lg shadow-primary/5 sm:p-5">
            <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-primary sm:text-sm">Entrega</p>
            <p className="text-lg font-black text-foreground sm:text-2xl">10 a 15 dias</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute left-10 top-10 h-24 w-24 rotate-45 border border-primary sm:h-32 sm:w-32" />
        <div className="absolute bottom-10 right-10 h-28 w-28 rotate-12 border border-primary sm:h-40 sm:w-40" />
      </div>
    </section>
  )
}
