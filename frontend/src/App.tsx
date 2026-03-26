import { useEffect, useState } from 'react'
import ResortMap from '@/components/ResortMap'
import BookingModal from '@/components/BookingModal'
import NotificationToast from '@/components/NotificationToast'
import type { BookingEntry, Coordinates } from '@/types'
import { fetchMap } from '@/api'

export default function App() {
  const [mapGrid, setMapGrid] = useState<string[][]>([]) // [[row], [row], [row]]
  const [bookedCabanas, setBookedCabanas] = useState<string[]>([]) // []
  const [error, setError] = useState('')
  const [bookingTarget, setBookingTarget] = useState<Coordinates | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const fetchMapData = async () => {
    try {
      const data = await fetchMap()

      setMapGrid(data.mapGrid)
      const bookedKeys = data.bookedCabanas.map(
        (entry: BookingEntry) => entry[0]
      )
      setBookedCabanas(bookedKeys)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  useEffect(() => {
    fetchMapData()
  }, [])

  useEffect(() => {
    if (!notice) return

    const timeoutId = window.setTimeout(() => {
      setNotice(null)
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [notice])

  const handleCabanaClick = (
    rowIndex: number,
    colIndex: number,
    isBooked: boolean
  ) => {
    if (isBooked) {
      setNotice('This cabana is already booked!')
      return
    }
    setNotice(null)
    setBookingTarget({ rowIndex, colIndex })
  }

  const handleBookingSuccess = () => {
    setBookingTarget(null)
    setNotice('Reserved successfully!')
    fetchMapData()
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 p-8 text-slate-900">
      {notice && (
        <NotificationToast message={notice} onClose={() => setNotice(null)} />
      )}

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Journey Resort</h1>
      </header>

      {error && <div className="mb-4 font-semibold text-red-600">{error}</div>}

      <main className="flex w-full max-w-5xl justify-center">
        <ResortMap
          grid={mapGrid}
          bookedCabanas={bookedCabanas}
          onCabanaClick={handleCabanaClick}
        />
      </main>

      {bookingTarget && (
        <BookingModal
          rowIndex={bookingTarget.rowIndex}
          colIndex={bookingTarget.colIndex}
          onClose={() => setBookingTarget(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}
