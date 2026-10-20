import { Link } from 'react-router-dom'

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-earth-900">
        Rota protegida funcionando
      </h1>

      <p className="max-w-lg text-slate-600">
        O parâmetro token está presente. O formulário de redefinição será
        integrado nas próximas etapas.
      </p>

      <Link
        to="/"
        className="font-semibold text-primary-700 underline underline-offset-4"
      >
        Voltar para a página inicial
      </Link>
    </main>
  )
}
