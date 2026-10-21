import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/landing/LandingPage'
import ResetPasswordPage from '../pages/reset-password/ResetPasswordPage'
import RequireToken from './RequireToken'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/recuperar-senha"
          element={
            <RequireToken>
              <ResetPasswordPage />
            </RequireToken>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
