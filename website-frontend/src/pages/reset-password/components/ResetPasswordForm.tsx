import {
    CheckCircle2,
    Eye,
    EyeOff,
    LoaderCircle,
    Sprout,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
    resetPassword,
    ResetPasswordError,
} from '../services/resetPassword'
import {
    passwordsMatch,
    validatePassword,
} from '../utils/validatePassword'

type ResetPasswordFormProps = {
  token: string
}

function getErrorMessage(error: unknown): string {
  if (!(error instanceof ResetPasswordError)) {
    return 'Não foi possível redefinir a senha. Tente novamente mais tarde.'
  }

  switch (error.code) {
    case 'INVALID_TOKEN':
      return 'Este link é inválido ou expirou. Solicite um novo link de recuperação.'
    case 'NETWORK_ERROR':
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
    case 'CONFIG_ERROR':
      return 'O endereço do serviço não está configurado. Verifique a variável VITE_API_URL.'
    case 'SERVER_ERROR':
      return 'Não foi possível redefinir a senha. Tente novamente mais tarde.'
  }
}

export default function ResetPasswordForm({
  token,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmationTouched, setConfirmationTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const passwordIsValid = validatePassword(password)
  const confirmationIsValid = passwordsMatch(password, confirmation)
  const formIsValid = passwordIsValid && confirmationIsValid

  const passwordHasError = passwordTouched && !passwordIsValid
  const confirmationHasError =
    confirmationTouched && !confirmationIsValid

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setPasswordTouched(true)
    setConfirmationTouched(true)

    if (!formIsValid || isLoading) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      await resetPassword(token, password)
      setIsComplete(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#fbf9f8] px-4 py-8 text-[#3b2c27] selection:bg-[#dcfce7] selection:text-[#14532d]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-[420px] rotate-[-10deg] rounded-[38%] bg-[linear-gradient(135deg,#dcfce7,#f5f0ed)] opacity-40 blur-3xl sm:size-[540px]"
      />

      <section className="relative w-full max-w-[440px] rounded-3xl border border-[#e8ded8] bg-white px-8 py-9 shadow-[0_24px_70px_-22px_rgba(74,56,50,0.22)] sm:p-10">
        {isComplete ? (
          <div
            className="flex min-h-[300px] flex-col items-center justify-center text-center"
            role="status"
            aria-live="polite"
          >
            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-[#dcfce7]">
              <CheckCircle2
                aria-hidden="true"
                className="size-8 text-[#16a34a]"
                strokeWidth={1.8}
              />
            </div>

            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#3b2c27]">
              Senha redefinida!
            </h1>

            <p className="mt-3 text-base leading-6 text-[#475569]">
              Sua senha foi alterada com sucesso.
            </p>

            <Link
              to="/"
              className="mt-8 font-semibold text-[#15803d] underline underline-offset-4"
            >
              Voltar para a página inicial
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2">
              <Sprout
                aria-hidden="true"
                className="size-7 text-[#16a34a]"
                strokeWidth={1.9}
              />
              <span className="text-[22px] font-bold tracking-[-0.025em] text-[#166534]">
                AgroSlot
              </span>
            </div>

            <div className="mt-8 text-center">
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#3b2c27]">
                Redefinir senha
              </h1>

              <p className="mt-3 text-base leading-6 text-[#475569]">
                Crie uma nova senha para acessar sua conta.
              </p>
            </div>

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-[#4a3832]"
                  htmlFor="new-password"
                >
                  Nova senha
                </label>

                <div className="relative">
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    aria-invalid={passwordHasError}
                    aria-describedby={
                      passwordHasError ? 'password-error' : undefined
                    }
                    className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-[#3b2c27] outline-none transition placeholder:text-[#94a3b8] focus:border-[#16a34a] focus:ring-4 focus:ring-[#dcfce7] ${
                      passwordHasError
                        ? 'border-[#ef4444] bg-[#fef2f2]'
                        : 'border-[#e8ded8]'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-[#8c6e61] transition hover:text-[#4a3832] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#dcfce7]"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <EyeOff
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={1.8}
                      />
                    )}
                  </button>
                </div>

                {passwordHasError && (
                  <p
                    id="password-error"
                    className="mt-2 text-sm text-[#ef4444]"
                  >
                    A senha deve ter pelo menos 8 caracteres.
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-[#4a3832]"
                  htmlFor="confirm-password"
                >
                  Confirmar senha
                </label>

                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirmation"
                    type={showConfirmation ? 'text' : 'password'}
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    onBlur={() => setConfirmationTouched(true)}
                    autoComplete="new-password"
                    required
                    aria-invalid={confirmationHasError}
                    aria-describedby={
                      confirmationHasError
                        ? 'confirmation-error'
                        : undefined
                    }
                    className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-[#3b2c27] outline-none transition placeholder:text-[#94a3b8] focus:border-[#16a34a] focus:ring-4 focus:ring-[#dcfce7] ${
                      confirmationHasError
                        ? 'border-[#ef4444] bg-[#fef2f2]'
                        : 'border-[#e8ded8]'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmation((visible) => !visible)
                    }
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-[#8c6e61] transition hover:text-[#4a3832] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#dcfce7]"
                    aria-label={
                      showConfirmation
                        ? 'Ocultar confirmação de senha'
                        : 'Mostrar confirmação de senha'
                    }
                  >
                    {showConfirmation ? (
                      <EyeOff
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={1.8}
                      />
                    )}
                  </button>
                </div>

                {confirmationHasError && (
                  <p
                    id="confirmation-error"
                    className="mt-2 text-sm text-[#ef4444]"
                  >
                    {confirmation.length === 0
                      ? 'Confirme sua senha.'
                      : 'As senhas não coincidem.'}
                  </p>
                )}
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={!formIsValid || isLoading}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 font-semibold text-white shadow-[0_8px_20px_-8px_rgba(22,163,74,0.65)] transition hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#dcfce7] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#16a34a]"
              >
                {isLoading && (
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-5 animate-spin"
                    strokeWidth={2}
                  />
                )}

                {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  )
}