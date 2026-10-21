import { Navigate, useSearchParams } from 'react-router-dom'
import ResetPasswordForm from './components/ResetPasswordForm'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim()

  if (!token) {
    return <Navigate to="/" replace />
  }

  return <ResetPasswordForm token={token} />
}