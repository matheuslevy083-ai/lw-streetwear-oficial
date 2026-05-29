import { supabase, hasSupabaseConfig } from "@/lib/supabase"
import type { Product } from "@/lib/products"

export const PRODUCT_IMAGES_BUCKET = "product-images"

type ProductRow = {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  images: string[] | null
  sizes: string[] | null
  in_stock: boolean | null
  reservation_price: number | null
  delivery_estimate: string | null
  drop_name: string | null
  gender: "Masculino" | "Feminino" | "Unissex" | null
  sort_order: number | null
}

function rowToProduct(row: ProductRow): Product {
  const images = Array.isArray(row.images) ? row.images.filter(Boolean) : []
  const image = row.image || images[0] || "/placeholder.svg"

  return {
    id: row.id,
    name: row.name,
    description: row.description || "Peça streetwear LW.",
    price: Number(row.price) || 0,
    image,
    images: [image, ...images].filter((item, index, array) => item && array.indexOf(item) === index),
    sizes: Array.isArray(row.sizes) ? row.sizes : ["P", "M", "G", "GG"],
    inStock: row.in_stock ?? true,
    reservationPrice: row.reservation_price ?? undefined,
    deliveryEstimate: row.delivery_estimate || "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    dropName: row.drop_name || "DROP 001 — GOLD BLACK",
    gender: row.gender || "Unissex",
  }
}

function productToPayload(product: Product, sortOrder = 0) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : []
  const image = product.image || images[0] || "/placeholder.svg"

  return {
    name: product.name || "Produto sem nome",
    description: product.description || "Peça streetwear LW.",
    price: Number(product.price) || 0,
    image,
    images: [image, ...images].filter((item, index, array) => item && array.indexOf(item) === index),
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    in_stock: product.inStock ?? true,
    reservation_price: product.reservationPrice ?? null,
    delivery_estimate: product.deliveryEstimate || "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    drop_name: product.dropName || "DROP 001 — GOLD BLACK",
    gender: product.gender || "Unissex",
    sort_order: sortOrder,
  }
}

export async function getProductsFromSupabase(): Promise<Product[]> {
  if (!hasSupabaseConfig || !supabase) return []

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos no Supabase:", error.message)
    return []
  }

  return (data || []).map((row) => rowToProduct(row as ProductRow))
}

export async function createProductInSupabase(product: Product, sortOrder = 0): Promise<Product> {
  if (!hasSupabaseConfig || !supabase) throw new Error("Supabase não configurado.")

  const { data, error } = await supabase
    .from("products")
    .insert(productToPayload(product, sortOrder))
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  return rowToProduct(data as ProductRow)
}

export async function updateProductInSupabase(product: Product, sortOrder = 0): Promise<Product> {
  if (!hasSupabaseConfig || !supabase) throw new Error("Supabase não configurado.")

  const { data, error } = await supabase
    .from("products")
    .update(productToPayload(product, sortOrder))
    .eq("id", product.id)
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  return rowToProduct(data as ProductRow)
}

export async function deleteProductFromSupabase(id: string): Promise<void> {
  if (!hasSupabaseConfig || !supabase) throw new Error("Supabase não configurado.")

  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function uploadProductImage(file: File): Promise<string> {
  if (!hasSupabaseConfig || !supabase) throw new Error("Supabase não configurado.")

  const extension = file.name.split(".").pop()?.toLowerCase() || "webp"
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
  const path = `products/${safeName}`

  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
