// 🛍️ PRODUTOS - EDITE OS PRODUTOS DA LW STREETWEAR AQUI
// Para trocar fotos, coloque novas imagens dentro da pasta /public e mude o campo image.

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images?: string[]
  sizes?: string[]
  inStock?: boolean
  stockBySizes?: Record<string, number>
  reservationPrice?: number
  deliveryEstimate?: string
  dropName?: string
  gender?: "Masculino" | "Feminino" | "Unissex"
}

export const products: Product[] = [
  {
    id: "1",
    name: "Camiseta Oversized Preta",
    description: "Camiseta oversized 100% algodão, conforto e estilo urbano. Peça principal da coleção LW Streetwear.",
    price: 89.9,
    reservationPrice: 40,
    deliveryEstimate: "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    dropName: "DROP 001 — GOLD BLACK",
    image: "/black-oversized-streetwear-t-shirt.jpg",
    images: ["/black-oversized-streetwear-t-shirt.jpg", "/black-t-shirt-with-gold-logo-streetwear.jpg"],
    sizes: ["P", "M", "G", "GG"],
    inStock: true,
    gender: "Masculino",
    stockBySizes: { P: 30, M: 30, G: 30, GG: 30 },
  },
  {
    id: "2",
    name: "Moletom LW Gold Edition",
    description: "Moletom premium com detalhes dourados, capuz ajustável e bolso canguru.",
    price: 189.9,
    reservationPrice: 80,
    deliveryEstimate: "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    dropName: "DROP 001 — GOLD BLACK",
    image: "/black-hoodie-with-gold-details-streetwear.jpg",
    images: ["/black-hoodie-with-gold-details-streetwear.jpg"],
    sizes: ["P", "M", "G", "GG"],
    inStock: true,
    gender: "Masculino",
    stockBySizes: { P: 20, M: 20, G: 20, GG: 20 },
  },
  {
    id: "3",
    name: "Calça Cargo Black",
    description: "Calça cargo com múltiplos bolsos, ajuste perfeito e tecido resistente.",
    price: 159.9,
    reservationPrice: 60,
    deliveryEstimate: "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    dropName: "DROP 001 — GOLD BLACK",
    image: "/black-cargo-pants-streetwear.png",
    images: ["/black-cargo-pants-streetwear.png"],
    sizes: ["38", "40", "42", "44", "46"],
    inStock: true,
    gender: "Masculino",
    stockBySizes: { "38": 20, "40": 20, "42": 20, "44": 20, "46": 20 },
  },
  {
    id: "4",
    name: "Jaqueta Corta-Vento",
    description: "Jaqueta impermeável com forro interno, ideal para compor o visual streetwear.",
    price: 249.9,
    reservationPrice: 100,
    deliveryEstimate: "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    dropName: "DROP 001 — GOLD BLACK",
    image: "/black-windbreaker-jacket-streetwear.jpg",
    images: ["/black-windbreaker-jacket-streetwear.jpg"],
    sizes: ["P", "M", "G", "GG"],
    inStock: true,
    gender: "Masculino",
    stockBySizes: { P: 15, M: 15, G: 15, GG: 15 },
  },
  {
    id: "5",
    name: "Bermuda Streetwear",
    description: "Bermuda confortável com modelagem urbana e cordão ajustável.",
    price: 79.9,
    reservationPrice: 35,
    deliveryEstimate: "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    dropName: "DROP 001 — GOLD BLACK",
    image: "/black-streetwear-shorts.jpg",
    images: ["/black-streetwear-shorts.jpg"],
    sizes: ["P", "M", "G", "GG"],
    inStock: true,
    gender: "Masculino",
    stockBySizes: { P: 30, M: 30, G: 30, GG: 30 },
  },
  {
    id: "6",
    name: "Camiseta LW Logo Gold",
    description: "Camiseta preta com logo LW em dourado, visual limpo e premium.",
    price: 99.9,
    reservationPrice: 40,
    deliveryEstimate: "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    dropName: "DROP 001 — GOLD BLACK",
    image: "/black-t-shirt-with-gold-logo-streetwear.jpg",
    images: ["/black-t-shirt-with-gold-logo-streetwear.jpg", "/black-oversized-streetwear-t-shirt.jpg"],
    sizes: ["P", "M", "G", "GG"],
    inStock: true,
    gender: "Masculino",
    stockBySizes: { P: 30, M: 30, G: 30, GG: 30 },
  },
]


export function getProductImages(product: Product): string[] {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : []
  const mainImage = product.image || images[0] || "/placeholder.svg"
  const uniqueImages = [mainImage, ...images].filter((image, index, array) => image && array.indexOf(image) === index)

  return uniqueImages.length > 0 ? uniqueImages : ["/placeholder.svg"]
}
