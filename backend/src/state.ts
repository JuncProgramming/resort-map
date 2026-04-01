import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import type { BookingRecord, Guest } from './types.js'

export const state = {
  mapGrid: [] as string[][],
  validGuests: [] as Guest[],
  bookedCabanas: new Map<string, BookingRecord>()
}

export function initializeState() {
  if (process.env.NODE_ENV === 'test') return

  const { values } = parseArgs({
    options: {
      map: { type: 'string', default: 'map.ascii' },
      bookings: { type: 'string', default: 'bookings.json' }
    },
    strict: false
  })

  try {
    const mapInputPath = values.map as string
    const bookingsInputPath = values.bookings as string

    const mapPath = path.isAbsolute(mapInputPath)
      ? mapInputPath
      : path.resolve(process.cwd(), mapInputPath)
    const bookingsPath = path.isAbsolute(bookingsInputPath)
      ? bookingsInputPath
      : path.resolve(process.cwd(), bookingsInputPath)

    const rawMap = fs.readFileSync(mapPath, 'utf-8')
    const lines = rawMap.split(/\r?\n/).filter((line) => line.trim() !== '')

    const maxCols = Math.max(...lines.map((line) => line.length))

    state.mapGrid = lines.map((line) => line.padEnd(maxCols, '.').split(''))
    const bookingsRaw = fs.readFileSync(bookingsPath, 'utf-8')
    state.validGuests = JSON.parse(bookingsRaw)
  } catch (error) {
    console.error('Could not read base files', error)
    process.exit(1)
  }
}
