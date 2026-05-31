import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(212,175,55,0.14),transparent_35%),linear-gradient(90deg,#050505_0%,#050505_36%,rgba(5,5,5,0.88)_55%,rgba(5,5,5,0.35)_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(135deg,rgba(255,255,255,0.04)_25%,transparent_25%),linear-gradient(225deg,rgba(255,255,255,0.035)_25%,transparent_25%)] [background-size:46px_46px]" />

      <div className="relative mx-auto max-w-[1540px] px-4 pb-6 pt-5 lg:px-12 lg:pb-0 lg:pt-0">
        <div className="grid min-h-[320px] overflow-hidden rounded-none lg:min-h-[380px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="z-10 flex flex-col justify-center py-8 lg:py-16">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-primary lg:mb-5 lg:text-sm">
              SUMMER '24 COLLECTION
            </p>
            <h1 className="max-w-[700px] text-[38px] font-black uppercase leading-[0.88] tracking-[-0.055em] text-white sm:text-6xl lg:text-[78px] xl:text-[90px]">
              Built different.<br />Made to stand out.
            </h1>
            <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-zinc-300 lg:text-lg">
              Premium materials. Bold designs. Limited quantities.
            </p>
            <a href="#colecao" className="mt-6 inline-flex w-fit items-center gap-3 rounded-none border border-primary px-6 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-primary transition hover:bg-primary hover:text-black lg:px-8">
              Shop the collection <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative -mt-4 h-[250px] lg:mt-0 lg:h-auto">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2),transparent_45%)]" />
            <div className="absolute inset-y-0 right-0 w-[82%] overflow-hidden lg:w-full">
              <Image
                src="/black-t-shirt-with-gold-logo-streetwear.jpg"
                alt="LW Streetwear"
                fill
                priority
                className="object-cover object-center brightness-[0.62] contrast-125 saturate-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 gap-2 lg:flex">
          <span className="h-2 w-8 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-white/45" />
          <span className="h-2 w-2 rounded-full bg-white/45" />
          <span className="h-2 w-2 rounded-full bg-white/45" />
        </div>
      </div>
    </section>
  )
}
