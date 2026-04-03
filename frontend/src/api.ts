import type { BookingRequest, MapSnapshot } from './types'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
  .replace(/\/+$/, '')

export async function fetchMap(): Promise<MapSnapshot> {
  const res = await fetch(`${API_URL}/map`)
  if (!res.ok) {
    throw new Error('Could not load the map data')
  }
  return (await res.json()) as MapSnapshot
}

export async function bookCabana(payload: BookingRequest) {
  const res = await fetch(`${API_URL}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      data.error || 'There has been an error during the reservation process'
    )
  }

  return data
}
