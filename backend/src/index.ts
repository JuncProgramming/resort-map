import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initializeState } from './state.js'
import {
  getMapSnapshot,
  isApiError,
  parseBookingRequest,
  reserveCabana
} from './bookingService.js'

initializeState()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/map', (req, res) => {
  res.json(getMapSnapshot())
})

app.post('/api/book', (req, res) => {
  try {
    const payload = parseBookingRequest(req.body)
    reserveCabana(payload)

    return res.status(200).json({ message: 'Successfully reserved!' })
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    return res
      .status(500)
      .json({ error: 'Unexpected reservation error, please try again' })
  }
})

const PORT = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}

export default app
