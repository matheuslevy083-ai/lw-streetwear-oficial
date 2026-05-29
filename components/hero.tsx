export function Hero() {
  return (
    <section className="relative bg-black py-20 px-4 sm:px-6 lg:px-8 border-b border-primary/20">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary mb-6">
          DROP 001 — GOLD BLACK
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary mb-6 tracking-tight">LW STREETWEAR</h1>
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-light mb-8">
          Estilo urbano autêntico em lote limitado. Escolha sua peça e finalize o atendimento pelo WhatsApp.
        </p>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-primary/20 bg-card/70 p-5 text-left">
            <p className="text-primary font-bold text-sm mb-1">Coleção</p>
            <p className="text-foreground text-2xl font-black">limitada</p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-card/70 p-5 text-left">
            <p className="text-primary font-bold text-sm mb-1">Entrega estimada</p>
            <p className="text-foreground text-2xl font-black">10 a 15 dias úteis</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-6 max-w-3xl mx-auto">
          Escolha a peça, selecione o tamanho e continue pelo WhatsApp para confirmar pagamento, entrega e disponibilidade.
        </p>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary rotate-45" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border border-primary rotate-12" />
      </div>
    </section>
  )
}
