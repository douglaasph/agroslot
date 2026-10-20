import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold text-earth-900">AgroSlot</h1>

      <p className="max-w-lg text-slate-600">
        Estrutura inicial do site configurada. A landing page completa será
        migrada na próxima etapa.
      </p>

      <Link
        to="/recuperar-senha?token=teste-local"
        className="rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
      >
        Testar rota de redefinição
      </Link>

      <p className="text-sm text-slate-500">
        O token deste link é fictício e serve apenas para testar a navegação.
      </p>
    </main>
  )
}
