"use client"

import { hasSupabaseConfig, supabase } from "@/lib/supabase"
import { Lock, ShieldCheck, User } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

export function AdminPanel() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const canLogin = useMemo(() => email.trim().length > 0 && password.trim().length > 0 && !loading, [email, password, loading])

  useEffect(() => {
    async function checkSession() {
      if (!supabase) return
      const { data } = await supabase.auth.getSession()
      if (data.session) setMessage("Você já está logado. Entre novamente ou abra o painel pelo botão abaixo.")
    }

    checkSession()
  }, [])

  async function handleLogin() {
    if (!canLogin) return

    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase ainda não foi configurado nas variáveis de ambiente.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    setLoading(false)

    if (error) {
      setError("Email ou senha incorretos, ou usuário ainda não criado no Supabase.")
      return
    }

    setMessage("Login feito. O painel abriu em outra aba.")
    window.open("/admin/dashboard", "_blank", "noopener,noreferrer")
  }

  async function openDashboard() {
    if (!supabase) {
      setError("Supabase ainda não foi configurado nas variáveis de ambiente.")
      return
    }

    const { data } = await supabase.auth.getSession()
    if (!data.session) {
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
              Entre com o usuário criado no Supabase para abrir o painel e gerenciar produtos, fotos, nomes e preços online.
            </p>
          </div>

          <div className="space-y-4">
            {!hasSupabaseConfig && (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm font-semibold text-yellow-200">
                Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel para ativar o login.
              </div>
            )}

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
              {loading ? "Entrando..." : "Entrar e abrir painel"}
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
              Agora o login usa Supabase Auth. O admin só consegue salvar online se estiver autenticado.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
