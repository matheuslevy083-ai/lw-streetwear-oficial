import { Instagram, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-primary/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">LW STREETWEAR</h3>
            <p className="text-muted-foreground">
              Drops limitados de streetwear masculino. Peças sob pré-venda, produzidas para quem reserva o lote.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">COMO FUNCIONA</h4>
            <p className="text-muted-foreground">
              Você escolhe a peça, envia a reserva pelo WhatsApp e garante seu tamanho. A produção começa após o
              fechamento do drop.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">REDES SOCIAIS</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/20 pt-8 text-center text-muted-foreground space-y-2">
          <p>&copy; {new Date().getFullYear()} LW Streetwear. Todos os direitos reservados.</p>
          <p className="text-xs">Pré-venda sob encomenda. Prazo informado após o fechamento do drop.</p>
        </div>
      </div>
    </footer>
  )
}
