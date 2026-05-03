const API_URL = (process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001').replace(/\/$/, '')

export async function fetcher<T = void>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = !!init?.body
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
