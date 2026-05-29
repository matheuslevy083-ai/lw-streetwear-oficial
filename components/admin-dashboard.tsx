"use client"

import { products as defaultProducts, type Product } from "@/lib/products"
import { Camera, LogOut, PackagePlus, Plus, Save, Star, Trash2, Upload, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "lw-admin-products"

type EditableProduct = Product & {
  sizesText?: string
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
    deliveryEstimate: product.deliveryEstimate || "Entrega em 10 a 15 dias úteis após o fechamento do lote",
    dropName: product.dropName || "DROP 001 — GOLD BLACK",
    gender: product.gender || "Unissex",
  }
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = () => {
      const img = new Image()

      img.onload = () => {
        const maxSize = 900
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const width = Math.max(1, Math.round(img.width * scale))
        const height = Math.max(1, Math.round(img.height * scale))

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(String(reader.result || ""))
          return
        }

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        const compressed = canvas.toDataURL("image/webp", 0.72)
        resolve(compressed)
      }

      img.onerror = () => resolve(String(reader.result || ""))
      img.src = String(reader.result || "")
    }

    reader.onerror = () => resolve("")
    reader.readAsDataURL(file)
  })
}

function readFiles(files: FileList | null, callback: (images: string[]) => void) {
  if (!files || files.length === 0) return

  const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
  if (imageFiles.length === 0) return

  Promise.all(imageFiles.map((file) => compressImage(file))).then((images) => callback(images.filter(Boolean)))
}

export function AdminDashboard() {
  const [items, setItems] = useState<EditableProduct[]>(() => defaultProducts.map(toEditable))
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [newName, setNewName] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newSizes, setNewSizes] = useState("P, M, G, GG")
  const [newGender, setNewGender] = useState<"Masculino" | "Feminino" | "Unissex">("Masculino")
  const [newDescription, setNewDescription] = useState("")
  const [savedMessage, setSavedMessage] = useState("")
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    const auth = window.localStorage.getItem("lw-admin-auth") === "true"
    setLogged(auth)

    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Product[]
        if (Array.isArray(parsed)) {
          setItems(parsed.map(toEditable))
        }
      } catch {
        setItems(defaultProducts.map(toEditable))
      }
    }
  }, [])

  const normalized = useMemo(() => items.map(normalizeProduct), [items])

  function saveProducts(nextItems = items) {
    const cleanProducts = nextItems.map(normalizeProduct)
    const payload = JSON.stringify(cleanProducts)

    try {
      window.localStorage.setItem(STORAGE_KEY, payload)
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: payload }))
      setSavedMessage("Alterações salvas. Atualize a loja se não aparecer automaticamente.")
    } catch {
      setSavedMessage("As fotos ainda estão muito pesadas para salvar no navegador. Use menos fotos ou imagens menores.")
    }

    window.setTimeout(() => setSavedMessage(""), 4500)
  }

  function addNewImages(files: FileList | null) {
    readFiles(files, (images) => setSelectedImages((current) => uniqueImages([...current, ...images])))
  }

  function removeNewImage(image: string) {
    setSelectedImages((current) => current.filter((item) => item !== image))
  }

  function updateItem(id: string, field: keyof EditableProduct, value: string | number) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  function addImagesToItem(id: string, files: FileList | null) {
    readFiles(files, (images) => {
      setItems((current) =>
        current.map((item) => {
          if (item.id !== id) return item
          const nextImages = uniqueImages([...(item.images || []), ...images])
          return { ...item, image: nextImages[0] || item.image || "/placeholder.svg", images: nextImages }
        }),
      )
    })
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

  function addProduct() {
    if (!newName.trim() || !newPrice.trim()) {
      setSavedMessage("Coloque pelo menos nome e preço para adicionar.")
      window.setTimeout(() => setSavedMessage(""), 3000)
      return
    }

    const images = selectedImages.length > 0 ? selectedImages : ["/placeholder.svg"]

    const product: EditableProduct = {
      id: String(Date.now()),
      name: newName.trim(),
      description: newDescription.trim() || "Nova peça da coleção LW Streetwear.",
      price: Number(newPrice.replace(",", ".")) || 0,
      image: images[0],
      images,
      sizesText: newSizes,
      sizes: newSizes.split(",").map((size) => size.trim()).filter(Boolean),
      gender: newGender,
      inStock: true,
      deliveryEstimate: "Entrega em 10 a 15 dias úteis após o fechamento do lote",
      dropName: "DROP 001 — GOLD BLACK",
    }

    const next = [product, ...items]
    setItems(next)
    saveProducts(next)
    setNewName("")
    setNewPrice("")
    setNewDescription("")
    setNewSizes("P, M, G, GG")
    setNewGender("Masculino")
    setSelectedImages([])
  }

  function deleteProduct(id: string) {
    const next = items.filter((item) => item.id !== id)
    setItems(next)
    saveProducts(next)
  }

  function logout() {
    window.localStorage.removeItem("lw-admin-auth")
    setLogged(false)
    window.location.href = "/admin"
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
              Adicione produtos, coloque várias fotos, altere nome, preço, tamanhos e público masculino/feminino. As mudanças ficam salvas no navegador.
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
              onClick={() => saveProducts()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-black text-black transition hover:bg-primary/90"
            >
              <Save className="h-5 w-5" /> Salvar tudo
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
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-primary">Tamanhos</span>
                <input
                  value={newSizes}
                  onChange={(e) => setNewSizes(e.target.value)}
                  placeholder="P, M, G, GG"
                  className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-foreground outline-none focus:border-primary"
                />
              </label>
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-black text-black transition hover:bg-primary/90"
                >
                  <Plus className="h-5 w-5" /> Adicionar produto
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
                            title="Usar como principal"
                            onClick={() => setMainImage(item.id, image)}
                            className={`absolute left-1 top-1 rounded p-1 ${photoIndex === 0 ? "bg-primary text-black" : "bg-black/80 text-primary hover:bg-primary hover:text-black"}`}
                          >
                            <Star className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            title="Apagar foto"
                            onClick={() => removeItemImage(item.id, image)}
                            className="absolute right-1 top-1 rounded bg-black/80 p-1 text-red-300 hover:bg-red-500 hover:text-white"
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
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold text-primary">Tamanhos</span>
                      <input
                        value={item.sizesText || ""}
                        onChange={(e) => updateItem(item.id, "sizesText", e.target.value)}
                        className="w-full rounded-lg border border-primary/20 bg-black px-3 py-2 text-foreground outline-none focus:border-primary"
                      />
                    </label>
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
                    <div className="flex items-end text-sm text-muted-foreground">Produto #{index + 1} • {images.length} foto{images.length === 1 ? "" : "s"}</div>
                  </div>

                  <div className="flex flex-row gap-2 lg:flex-col">
                    <button
                      type="button"
                      onClick={() => saveProducts()}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/30 px-3 py-2 font-bold text-primary hover:bg-primary/10 lg:flex-none"
                    >
                      <Save className="h-4 w-4" /> Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(item.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 font-bold text-red-300 hover:bg-red-500/10 lg:flex-none"
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
