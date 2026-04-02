import { state } from './state.js'
import type { ApiError, ApiErrorCode, BookingRequestPayload } from './types.js'

export const getMapSnapshot = () => {
  return {
    mapGrid: state.mapGrid,
    bookedCabanas: Array.from(state.bookedCabanas.keys())
  }
}

export const parseBookingRequest = (body: unknown): BookingRequestPayload => {
  if (!isObject(body)) {
    throw createApiError(400, 'Missing reservation data')
  }

  const rowIndex = body.rowIndex
  const colIndex = body.colIndex
  const room = body.room
  const guestName = body.guestName

  if (
    typeof rowIndex !== 'number' ||
    !Number.isInteger(rowIndex) ||
    typeof colIndex !== 'number' ||
    !Number.isInteger(colIndex)
  ) {
    throw createApiError(400, 'Invalid cabana coordinates')
  }

  if (typeof room !== 'string' || typeof guestName !== 'string') {
    throw createApiError(400, 'Missing reservation data')
  }

  const normalizedRoom = room.trim()
  const normalizedGuestName = guestName.trim()

  if (!normalizedRoom || !normalizedGuestName) {
    throw createApiError(400, 'Missing reservation data')
  }

  return {
    rowIndex,
    colIndex,
    room: normalizedRoom,
    guestName: normalizedGuestName
  }
}

export const reserveCabana = (payload: BookingRequestPayload) => {
  const cabanaKey = `${payload.rowIndex},${payload.colIndex}`
  const row = state.mapGrid[payload.rowIndex]

  if (!row || row[payload.colIndex] !== 'W') {
    throw createApiError(400, 'Cabana not found')
  }

  if (state.bookedCabanas.has(cabanaKey)) {
    throw createApiError(409, 'This cabana is already reserved')
  }

  const normalizedGuestName = payload.guestName.toLowerCase()
  const matchedGuest = state.validGuests.find(
    (guest) =>
      guest.room === payload.room &&
      guest.guestName.toLowerCase() === normalizedGuestName
  )

  if (!matchedGuest) {
    throw createApiError(401, 'Only members can reserve a cabana')
  }

  state.bookedCabanas.set(cabanaKey, {
    room: matchedGuest.room,
    guestName: matchedGuest.guestName
  })

  return { cabanaKey, guest: matchedGuest }
}

// using "is" => if it returns true, the type is a Record<string, unknown>
const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const createApiError = (
  statusCode: ApiErrorCode,
  message: string
): ApiError => {
  return { statusCode, message }
}

// using "is" => if it returns true, the type is an ApiError
export const isApiError = (value: unknown): value is ApiError => {
  if (!isObject(value)) {
    return false
  }

  return (
    typeof value.message === 'string' &&
    (value.statusCode === 400 ||
      value.statusCode === 401 ||
      value.statusCode === 409)
  )
}
