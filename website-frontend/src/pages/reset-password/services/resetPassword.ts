export type ResetPasswordErrorCode =
  | 'CONFIG_ERROR'
  | 'INVALID_TOKEN'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'

export class ResetPasswordError extends Error {
  constructor(public readonly code: ResetPasswordErrorCode) {
    super(code)
    this.name = 'ResetPasswordError'
  }
}

type ResetPasswordPayload = {
  token: string
  newPassword: string
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  const apiUrl = import.meta.env.VITE_API_URL?.trim()

  if (!apiUrl) {
    throw new ResetPasswordError('CONFIG_ERROR')
  }

  const payload: ResetPasswordPayload = {
    token,
    newPassword,
  }

  let response: Response

  try {
    response = await fetch(
      `${apiUrl.replace(/\/+$/, '')}/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )
  } catch {
    throw new ResetPasswordError('NETWORK_ERROR')
  }

  if (response.status === 400) {
    throw new ResetPasswordError('INVALID_TOKEN')
  }

  if (!response.ok) {
    throw new ResetPasswordError('SERVER_ERROR')
  }
}
