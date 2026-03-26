import { useState } from 'react'
import type { BookingModalProps } from '@/types'
import { bookCabana } from '@/api'

export function BookingModal({
  rowIndex,
  colIndex,
  onClose,
  onSuccess
}: BookingModalProps) {
  const [room, setRoom] = useState('')
  const [guestName, setGuestName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await bookCabana({ rowIndex, colIndex, room, guestName })
      onSuccess()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      data-testid="modal-backdrop"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-2xl font-bold text-slate-800">
          Cabana reservation
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="room"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Room number
            </label>
            <input
              id="room"
              type="text"
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="404"
            />
          </div>

          <div>
            <label
              htmlFor="guestName"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Full name
            </label>
            <input
              id="guestName"
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-300"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              {isLoading ? 'Reserving...' : 'Reserve'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
