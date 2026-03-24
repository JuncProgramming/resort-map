import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initializeState, state } from './state.js'

initializeState()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/map', (req, res) => {
  res.json({
    mapGrid: state.mapGrid,
    bookedCabanas: Array.from(state.bookedCabanas.entries())
  })
})

app.post('/api/book', (req, res) => {
  const { rowIndex, colIndex, room, guestName } = req.body

  if (rowIndex === undefined || colIndex === undefined || !room || !guestName) {
    return res.status(400).json({ error: 'Missing reservation data' })
  }

  const cabanaKey = `${rowIndex},${colIndex}`

  const row = state.mapGrid[rowIndex]
  if (!row || row[colIndex] !== 'W') {
    return res.status(400).json({ error: 'Cabana not found' })
  }

  if (state.bookedCabanas.has(cabanaKey)) {
    return res.status(409).json({ error: 'This cabana is already reserved' })
  }

  const normalizedRoom = room.toString().trim()
  const normalizedName = guestName.toString().trim().toLowerCase()

  const matchedGuest = state.validGuests.find(
    (guest) =>
      guest.room === normalizedRoom &&
      guest.guestName.toLowerCase() === normalizedName
  )

  if (!matchedGuest) {
    return res.status(401).json({ error: 'Only members can reserve a cabana' })
  }

  state.bookedCabanas.set(cabanaKey, {
    room: matchedGuest.room,
    guestName: matchedGuest.guestName
  })

  console.log(
    `Successfully reserved cabana [${cabanaKey}] for ${guestName}, Room ${room}`
  )
  return res.status(200).json({ message: 'Successfully reserved!' })
})

const PORT = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}

export default app
