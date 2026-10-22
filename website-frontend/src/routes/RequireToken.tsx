import type { ReactNode } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

type RequireTokenProps = {
  children: ReactNode
}

export default function RequireToken({ children }: RequireTokenProps) {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim()

  if (!token) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
