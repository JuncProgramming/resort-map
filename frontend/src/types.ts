export type ResortMapProps = {
  grid: string[][]
  bookedCabanas: string[]
  onCabanaClick: (rowIndex: number, colIndex: number, isBooked: boolean) => void
}

export type BookingModalProps = {
  rowIndex: number
  colIndex: number
  onClose: () => void
  onSuccess: () => void
}

export type MapSnapshot = {
  mapGrid: string[][]
  bookedCabanas: string[]
}

export type BookingRequest = {
  rowIndex: number
  colIndex: number
  room: string
  guestName: string
}

export type Coordinates = { rowIndex: number; colIndex: number }

export type NotificationToastProps = {
  message: string
  onClose?: () => void
}
