import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from './index.js'
import { state } from './state.js'

describe('GET /api/map', () => {
  beforeEach(() => {
    state.mapGrid = [
      ['W', '.', 'p'],
      ['.', 'W', 'c']
    ]
    state.bookedCabanas = new Map()
  })

  it('should return map grid and booked cabanas with a 200 code', async () => {
    const res = await request(app).get('/api/map')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      mapGrid: state.mapGrid,
      bookedCabanas: []
    })
  })

  it('should return reserved cabanas in the response payload', async () => {
    state.bookedCabanas.set('1,1', { room: '101', guestName: 'Alice Smith' })

    const res = await request(app).get('/api/map')

    expect(res.status).toBe(200)
    expect(res.body.bookedCabanas).toContain('1,1')
  })

  it('should not expose guest reservation details in map payload', async () => {
    state.bookedCabanas.set('1,1', { room: '101', guestName: 'Alice Smith' })

    const res = await request(app).get('/api/map')

    expect(res.status).toBe(200)
    expect(res.body.bookedCabanas).toEqual(['1,1'])
  })
})

describe('POST /api/book (Booking Logic)', () => {
  beforeEach(() => {
    state.mapGrid = [
      ['W', '.', 'p'],
      ['.', 'W', 'c']
    ]
    state.validGuests = [{ room: '101', guestName: 'Alice Smith' }]
    state.bookedCabanas = new Map()
  })

  it('should reject request with missing data with a 400 code', async () => {
    const res = await request(app)
      .post('/api/book')
      .send({ rowIndex: 0, colIndex: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('should reject request with non-integer coordinates with a 400 code', async () => {
    const res = await request(app).post('/api/book').send({
      rowIndex: '0',
      colIndex: 0,
      room: '101',
      guestName: 'Alice Smith'
    })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid cabana coordinates')
  })

  it('should reject booking for invalid coordinates with a 400 code', async () => {
    const res = await request(app)
      .post('/api/book')
      .send({ rowIndex: 0, colIndex: 2, room: '101', guestName: 'Alice Smith' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('should reject unauthorized guest wih a 401 code', async () => {
    const res = await request(app)
      .post('/api/book')
      .send({ rowIndex: 0, colIndex: 0, room: '248', guestName: 'Rick Roll' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  it('should successfully book an available cabana with a OK response (code 200)', async () => {
    const res = await request(app)
      .post('/api/book')
      .send({ rowIndex: 0, colIndex: 0, room: '101', guestName: 'Alice Smith' })

    expect(res.status).toBe(200)
    expect(state.bookedCabanas.has('0,0')).toBe(true)
  })

  it('should reject booking an already reserved cabana with a 409 code', async () => {
    state.bookedCabanas.set('1,1', { room: '101', guestName: 'Alice Smith' })

    const res = await request(app)
      .post('/api/book')
      .send({ rowIndex: 1, colIndex: 1, room: '101', guestName: 'Alice Smith' })

    expect(res.status).toBe(409)
    expect(res.body).toHaveProperty('error')
  })

  it('should return the newly booked cabana in GET /api/map', async () => {
    await request(app)
      .post('/api/book')
      .send({ rowIndex: 0, colIndex: 0, room: '101', guestName: 'Alice Smith' })

    const mapRes = await request(app).get('/api/map')

    expect(mapRes.status).toBe(200)
    expect(mapRes.body.bookedCabanas).toContain('0,0')
  })
})
