export type Guest = {
  room: string
  guestName: string
}

export type BookingRecord = {
  room: string
  guestName: string
}

export type BookingRequestPayload = {
  rowIndex: number
  colIndex: number
  room: string
  guestName: string
}

export type ApiErrorCode = 400 | 401 | 409

export type ApiError = {
  statusCode: ApiErrorCode
  message: string
}