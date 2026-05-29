"use client"

import { useEffect, useMemo, useState } from "react"
import { Lock, ShieldCheck, User } from "lucide-react"

const ADMIN_EMAIL = "matheuslevy083@gmail.com"
const ADMIN_PASSWORD = "@Mtl1608"

export function AdminPanel() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const canLogin = useMemo(() => email.trim().length > 0 && password.trim().length > 0, [email, password])

  useEffect(() => {
    if (typeof window === "undefined") return
    const alreadyLogged = window.localStorage.getItem("lw-admin-auth") === "true"
    if (alreadyLogged) setMessage("Você já está logado. Entre novamente ou abra o painel pelo botão abaixo.")
  }, [])

  function handleLogin() {
    if (!canLogin) return

    const cleanEmail = email.trim().toLowerCase()

    if (cleanEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      window.localStorage.removeItem("lw-admin-auth")
      window.localStorage.removeItem("lw-admin-user")
      setMessage("")
      setError("Email ou senha incorretos.")
      return
    }

    window.localStorage.setItem("lw-admin-auth", "true")
    window.localStorage.setItem("lw-admin-user", cleanEmail)
    setError("")
    setMessage("Login feito. O painel abriu em outra aba.")
    window.open("/admin/dashboard", "_blank", "noopener,noreferrer")
  }

  function openDashboard() {
    const alreadyLogged = window.localStorage.getItem("lw-admin-auth") === "true"
    if (!alreadyLogged) {
      setError("Faça login primeiro para abrir o painel.")
      return
    }
    window.open("/admin/dashboard", "_blank", "noopener,noreferrer")
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <section className="w-full max-w-xl rounded-2xl border border-primary/25 bg-card p-6 shadow-2xl shadow-primary/10 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-black">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <p className="mb-3 text-xs font-black tracking-[0.35em] text-primary">LW STREETWEAR</p>
            <h1 className="text-3xl font-black text-foreground sm:text-4xl">Login do admin</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Entre com o email e a senha cadastrados para abrir o painel em outra aba e gerenciar produtos, fotos, nomes e preços.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
                <User className="h-4 w-4" /> Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Digite o email do admin"
                className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-foreground outline-none transition focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
                <Lock className="h-4 w-4" /> Senha
              </span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Digite sua senha"
                className="w-full rounded-xl border border-primary/20 bg-black px-4 py-3 text-foreground outline-none transition focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin()
                }}
              />
            </label>

            <button
              type="button"
              onClick={handleLogin}
              disabled={!canLogin}
              className="w-full rounded-xl bg-primary px-4 py-3 font-black text-black transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Entrar e abrir painel
            </button>

            <button
              type="button"
              onClick={openDashboard}
              className="w-full rounded-xl border border-primary/25 px-4 py-3 text-center font-bold text-primary transition hover:bg-primary/10"
            >
              Abrir painel se já estiver logado
            </button>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm font-semibold text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-center text-sm font-semibold text-primary">
                {message}
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Login funcional para uso demonstrativo no navegador. Para proteger de verdade em produção, depois conectamos autenticação com backend.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
