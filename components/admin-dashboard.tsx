"use client"

import { products as defaultProducts, type Product } from "@/lib/products"
import { hasSupabaseConfig, supabase } from "@/lib/supabase"
import {
  createProductInSupabase,
  deleteProductFromSupabase,
  getProductsFromSupabase,
  updateProductInSupabase,
  uploadProductImage,
} from "@/lib/supabase-products"
import { Camera, LogOut, PackagePlus, Plus, Save, Star, Trash2, Upload, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const ADMIN_EMAIL = "matheuslevy083@gmail.com"

type EditableProduct = Product & {
  sizesText?: string
}

const CLOTHING_SIZE_OPTIONS = ["P", "M", "G", "GG"]
const SHOE_SIZE_OPTIONS = ["38", "39", "40", "41", "42", "43"]

function parseSizesText(value: string) {
  return value
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean)
}

function toggleSizeInText(value: string, size: string) {
  const current = parseSizesText(value)
  const exists = current.includes(size)
  const next = exists ? current.filter((item) => item !== size) : [...current, size]
  return next.join(", ")
}

function getSizeOptions(value: string) {
  const current = parseSizesText(value)
  const hasShoeSize = current.some((size) => /^\d{2}$/.test(size))
  return hasShoeSize ? SHOE_SIZE_OPTIONS : CLOTHING_SIZE_OPTIONS
}

function SizePicker({
  value,
  onChange,
  compact = false,
}: {
  value: string
  onChange: (value: string) => void
  compact?: boolean
}) {
  const current = parseSizesText(value)
  const options = getSizeOptions(value)

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((size) => {
          const active = current.includes(size)
          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(toggleSizeInText(value, size))}
              className={`${compact ? "h-9 min-w-10 text-xs" : "h-10 min-w-11 text-sm"} rounded-xl border px-3 font-black transition ${
                active
                  ? "border-primary bg-primary text-black"
                  : "border-primary/25 bg-black text-zinc-300 hover:border-primary hover:text-primary"
              }`}
            >
              {size}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(CLOTHING_SIZE_OPTIONS.join(", "))}
          className="rounded-lg border border-primary/25 px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-primary hover:text-black"
        >
          Usar tamanhos de roupa
        </button>
        <button
          type="button"
          onClick={() => onChange(SHOE_SIZE_OPTIONS.join(", "))}
          className="rounded-lg border border-primary/25 px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-primary hover:text-black"
        >
          Usar números de tênis
        </button>
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={options === SHOE_SIZE_OPTIONS ? "38, 39, 40, 41, 42, 43" : "P, M, G, GG"}
        className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-foreground outline-none focus:border-primary"
      />
    </div>
  )
}


function uniqueImages(images: string[]) {
  return images.filter((image, index, array) => Boolean(image) && array.indexOf(image) === index)
}

function getImages(product: Product): string[] {
  const images = uniqueImages([product.image, ...(product.images || [])])
  return images.length > 0 ? images : ["/placeholder.svg"]
}

function toEditable(product: Product): EditableProduct {
  const images = getImages(product)

  return {
    ...product,
    image: images[0],
    images,
    sizesText: product.sizes?.join(", ") || "P, M, G, GG",
  }
}

function normalizeProduct(product: EditableProduct): Product {
  const sizes = (product.sizesText || "")
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean)
  const images = uniqueImages([product.image, ...(product.images || [])])
  const safeImages = images.length > 0 ? images : ["/placeholder.svg"]

  return {
    id: product.id,
    name: product.name || "Produto sem nome",
    description: product.description || "Peça streetwear LW.",
    price: Number(product.price) || 0,
    image: safeImages[0],
    images: safeImages,
    sizes,
    inStock: true,
    reservationPrice: product.reservationPrice,
    deliveryEstimate: product.deliveryEstimate || "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    dropName: product.dropName || "DROP 001 — GOLD BLACK",
    gender: product.gender || "Unissex",
  }
}

async function uploadFiles(files: FileList | null): Promise<string[]> {
  if (!files || files.length === 0) return []
  const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
  if (imageFiles.length === 0) return []
  return Promise.all(imageFiles.map((file) => uploadProductImage(file)))
}

export function AdminDashboard() {
  const [items, setItems] = useState<EditableProduct[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [newName, setNewName] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newSizes, setNewSizes] = useState("P, M, G, GG")
  const [newGender, setNewGender] = useState<"Masculino" | "Feminino" | "Unissex">("Masculino")
  const [newDescription, setNewDescription] = useState("")
  const [savedMessage, setSavedMessage] = useState("")
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const normalized = useMemo(() => items.map(normalizeProduct), [items])

  function showMessage(message: string) {
    setSavedMessage(message)
    window.setTimeout(() => setSavedMessage(""), 5000)
  }

  async function loadProducts() {
    setLoading(true)
    const onlineProducts = await getProductsFromSupabase()
    setItems((onlineProducts.length > 0 ? onlineProducts : defaultProducts).map(toEditable))
    setLoading(false)
  }

  useEffect(() => {
    async function init() {
      if (!hasSupabaseConfig || !supabase) {
        setLogged(false)
        setItems(defaultProducts.map(toEditable))
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      const userEmail = data.session?.user.email?.toLowerCase()

      if (!data.session || userEmail !== ADMIN_EMAIL) {
        setLogged(false)
        setLoading(false)
        return
      }

      setLogged(true)
      await loadProducts()
    }

    init()
  }, [])

  async function saveProducts(nextItems = items) {
    if (!hasSupabaseConfig || !supabase) {
      showMessage("Configure o Supabase para salvar online.")
      return
    }

    setSaving(true)
    try {
      const cleanProducts = nextItems.map(normalizeProduct)
      const saved = await Promise.all(cleanProducts.map((product, index) => updateProductInSupabase(product, index)))
      setItems(saved.map(toEditable))
      showMessage("Alterações salvas online. Agora aparecem em qualquer navegador.")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Não foi possível salvar online.")
    } finally {
      setSaving(false)
    }
  }

  async function addNewImages(files: FileList | null) {
    setSaving(true)
    try {
      const urls = await uploadFiles(files)
      setSelectedImages((current) => uniqueImages([...current, ...urls]))
      if (urls.length > 0) showMessage("Fotos enviadas para o Supabase.")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Erro ao enviar fotos.")
    } finally {
      setSaving(false)
    }
  }

  function removeNewImage(image: string) {
    setSelectedImages((current) => current.filter((item) => item !== image))
  }

  function updateItem(id: string, field: keyof EditableProduct, value: string | number) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  async function addImagesToItem(id: string, files: FileList | null) {
    setSaving(true)
    try {
      const urls = await uploadFiles(files)
      const nextItems = items.map((item) => {
        if (item.id !== id) return item
        const nextImages = uniqueImages([...(item.images || []), ...urls])
        return { ...item, image: nextImages[0] || item.image || "/placeholder.svg", images: nextImages }
      })
      setItems(nextItems)

      const itemToSave = nextItems.find((item) => item.id === id)
      if (itemToSave) await updateProductInSupabase(normalizeProduct(itemToSave), nextItems.findIndex((item) => item.id === id))
      showMessage("Fotos adicionadas e salvas online.")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Erro ao enviar fotos.")
    } finally {
      setSaving(false)
    }
  }

  function removeItemImage(id: string, imageToRemove: string) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const nextImages = uniqueImages([item.image, ...(item.images || [])]).filter((image) => image !== imageToRemove)
        const safeImages = nextImages.length > 0 ? nextImages : ["/placeholder.svg"]
        return { ...item, image: safeImages[0], images: safeImages }
      }),
    )
  }

  function setMainImage(id: string, imageToMain: string) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const otherImages = uniqueImages([item.image, ...(item.images || [])]).filter((image) => image !== imageToMain)
        return { ...item, image: imageToMain, images: [imageToMain, ...otherImages] }
      }),
    )
  }

  async function addProduct() {
    if (!newName.trim() || !newPrice.trim()) {
      showMessage("Coloque pelo menos nome e preço para adicionar.")
      return
    }

    setSaving(true)
    try {
      const images = selectedImages.length > 0 ? selectedImages : ["/placeholder.svg"]

      const product: Product = {
        id: crypto.randomUUID(),
        name: newName.trim(),
        description: newDescription.trim() || "Nova peça da coleção LW Streetwear.",
        price: Number(newPrice.replace(",", ".")) || 0,
        image: images[0],
        images,
        sizes: newSizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),
        gender: newGender,
        inStock: true,
        deliveryEstimate: "Entrega em 10 a 15 dias úteis após o fechamento do lote",
        dropName: "DROP 001 — GOLD BLACK",
      }

      const savedProduct = await createProductInSupabase(product, 0)
      const next = [toEditable(savedProduct), ...items]
      setItems(next)
      setNewName("")
      setNewPrice("")
      setNewDescription("")
      setNewSizes("P, M, G, GG")
      setNewGender("Masculino")
      setSelectedImages([])
      showMessage("Produto adicionado online.")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Erro ao adicionar produto.")
    } finally {
      setSaving(false)
    }
  }

  async function saveSingleProduct(id: string) {
    setSaving(true)
    try {
      const index = items.findIndex((item) => item.id === id)
      const item = items[index]
      if (!item) return
      const saved = await updateProductInSupabase(normalizeProduct(item), index)
      setItems((current) => current.map((product) => (product.id === id ? toEditable(saved) : product)))
      showMessage("Produto salvo online.")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Erro ao salvar produto.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(id: string) {
    setSaving(true)
    try {
      await deleteProductFromSupabase(id)
      setItems((current) => current.filter((item) => item.id !== id))
      showMessage("Produto apagado online.")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Erro ao apagar produto.")
    } finally {
      setSaving(false)
    }
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut()
    window.location.href = "/admin"
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="rounded-2xl border border-primary/25 bg-card p-6 text-center font-black text-primary">Carregando painel...</div>
      </main>
    )
  }

  if (!logged) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="max-w-md rounded-2xl border border-primary/25 bg-card p-6 text-center">
          <h1 className="text-2xl font-black text-primary">Acesso bloqueado</h1>
          <p className="mt-3 text-muted-foreground">Faça login primeiro para acessar o painel.</p>
          <a href="/admin" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 font-black text-black">
            Ir para login
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-black tracking-[0.3em] text-primary">PAINEL ADMIN LW</p>
            <h1 className="text-4xl font-black text-primary sm:text-5xl">Gerenciar produtos</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Agora as mudanças ficam salvas no Supabase e aparecem para todos os navegadores.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-primary/30 px-4 py-3 font-bold text-primary transition hover:bg-primary/10"
            >
              Ver loja
            </a>
            <button
              type="button"
              onClick={() => loadProducts()}
              className="rounded-xl border border-primary/30 px-4 py-3 font-bold text-primary transition hover:bg-primary/10"
            >
              Atualizar
            </button>
            <button
              type="button"
              onClick={() => saveProducts()}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-black text-black transition hover:bg-primary/90 disabled:opacity-60"
            >
              <Save className="h-5 w-5" /> {saving ? "Salvando..." : "Salvar tudo"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 font-bold text-red-300 transition hover:bg-red-500/10"
            >
              <LogOut className="h-5 w-5" /> Sair
            </button>
          </div>
        </div>

        {savedMessage && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 p-4 text-center font-bold text-primary">
            {savedMessage}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-primary/25 bg-card p-6 shadow-xl shadow-primary/5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-black">
              <PackagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Adicionar nova peça</h2>
              <p className="text-sm text-muted-foreground">Coloque uma ou mais fotos, nome, preço, descrição, tamanhos e público.</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
            <div className="space-y-3">
              <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-black/40 p-4 text-center transition hover:border-primary hover:bg-primary/5">
                {selectedImages.length > 0 ? (
                  <img src={selectedImages[0]} alt="Prévia" className="h-full max-h-64 w-full rounded-lg object-cover" />
                ) : (
                  <>
                    <Upload className="mb-3 h-10 w-10 text-primary" />
                    <span className="font-black text-foreground">Adicionar fotos</span>
                    <span className="mt-1 text-xs text-muted-foreground">Pode selecionar mais de uma</span>
                  </>
                )}
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addNewImages(e.target.files)} />
              </label>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-primary/20 bg-black">
                      <img src={image} alt={`Nova foto ${index + 1}`} className="h-full w-full object-cover" />
                      {index === 0 && (
                        <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-black text-black">Principal</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewImage(image)}
                        className="absolute right-1 top-1 rounded bg-black/80 p-1 text-red-300 hover:bg-red-500 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-primary">Nome do produto</span>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Camiseta Oversized Preta"
                  className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-primary">Preço</span>
                <input
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="89,90"
                  className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-primary">Descrição</span>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descrição da peça"
                  className="min-h-24 w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-foreground outline-none focus:border-primary"
                />
              </label>
              <div className="block">
                <span className="mb-2 block text-sm font-bold text-primary">Tamanhos disponíveis</span>
                <p className="mb-2 text-xs text-muted-foreground">Selecione só os tamanhos que você tem. Para tênis, clique em “Usar números de tênis”.</p>
                <SizePicker value={newSizes} onChange={setNewSizes} />
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-primary">Masculino/Feminino</span>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as "Masculino" | "Feminino" | "Unissex")}
                  className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-foreground outline-none focus:border-primary"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Unissex">Unissex</option>
                </select>
              </label>
              <div className="flex items-end md:col-span-2">
                <button
                  type="button"
                  onClick={addProduct}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-black text-black transition hover:bg-primary/90 disabled:opacity-60"
                >
                  <Plus className="h-5 w-5" /> {saving ? "Salvando..." : "Adicionar produto"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/25 bg-card p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-foreground">Produtos da loja</h2>
              <p className="text-sm text-muted-foreground">Total: {normalized.length} produtos.</p>
            </div>
          </div>

          <div className="grid gap-5">
            {items.map((item, index) => {
              const images = getImages(item)

              return (
                <div key={item.id} className="grid gap-4 rounded-xl border border-primary/15 bg-black/40 p-4 lg:grid-cols-[240px_1fr_auto]">
                  <div className="space-y-3">
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-primary/20 bg-black">
                      {images[0] ? (
                        <img src={images[0]} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-8 w-8 text-primary" />
                      )}
                      <span className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/80 px-2 py-1 text-center text-xs font-bold text-primary">
                        Foto principal
                      </span>
                    </div>

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/10">
                      <Upload className="h-4 w-4" /> Adicionar fotos
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addImagesToItem(item.id, e.target.files)} />
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                      {images.map((image, photoIndex) => (
                        <div key={`${image}-${photoIndex}`} className="relative aspect-square overflow-hidden rounded-lg border border-primary/20 bg-black">
                          <img src={image} alt={`${item.name} foto ${photoIndex + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setMainImage(item.id, image)}
                            className="absolute left-1 top-1 rounded bg-black/80 p-1 text-primary hover:bg-primary hover:text-black"
                            title="Definir como principal"
                          >
                            <Star className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItemImage(item.id, image)}
                            className="absolute right-1 top-1 rounded bg-black/80 p-1 text-red-300 hover:bg-red-500 hover:text-white"
                            title="Remover foto"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold text-primary">Nome</span>
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        className="w-full rounded-lg border border-primary/20 bg-black px-3 py-2 text-foreground outline-none focus:border-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold text-primary">Preço</span>
                      <input
                        value={String(item.price)}
                        onChange={(e) => updateItem(item.id, "price", Number(e.target.value.replace(",", ".")) || 0)}
                        className="w-full rounded-lg border border-primary/20 bg-black px-3 py-2 text-foreground outline-none focus:border-primary"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="mb-1 block text-xs font-bold text-primary">Descrição</span>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className="min-h-20 w-full rounded-lg border border-primary/20 bg-black px-3 py-2 text-foreground outline-none focus:border-primary"
                      />
                    </label>
                    <div className="block">
                      <span className="mb-1 block text-xs font-bold text-primary">Tamanhos disponíveis</span>
                      <SizePicker
                        value={item.sizesText || ""}
                        onChange={(value) => updateItem(item.id, "sizesText", value)}
                        compact
                      />
                    </div>
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold text-primary">Masculino/Feminino</span>
                      <select
                        value={item.gender || "Unissex"}
                        onChange={(e) => updateItem(item.id, "gender", e.target.value)}
                        className="w-full rounded-lg border border-primary/20 bg-black px-3 py-2 text-foreground outline-none focus:border-primary"
                      >
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Unissex">Unissex</option>
                      </select>
                    </label>
                    <p className="md:col-span-2 text-xs text-muted-foreground">Ordem: {index + 1} • ID: {item.id}</p>
                  </div>

                  <div className="flex flex-row gap-2 lg:flex-col">
                    <button
                      type="button"
                      onClick={() => saveSingleProduct(item.id)}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/10 disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" /> Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(item.id)}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-bold text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" /> Apagar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
