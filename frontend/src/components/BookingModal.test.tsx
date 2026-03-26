import BookingModal from '@/components/BookingModal'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

const mockOnCloseClick = vi.fn()
const mockOnConfirmClick = vi.fn()

describe('BookingModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    render(
      <BookingModal
        rowIndex={12}
        colIndex={4}
        onClose={mockOnCloseClick}
        onSuccess={mockOnConfirmClick}
      />
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should call onClose when the cancel button is clicked', async () => {
    const user = userEvent.setup()

    await user.click(screen.getByText(/cancel/i))
    expect(mockOnCloseClick).toHaveBeenCalledOnce()
  })

  it('should call onClose when the backdrop is clicked', async () => {
    const user = userEvent.setup()

    await user.click(screen.getByTestId(/modal-backdrop/i))
    expect(mockOnCloseClick).toHaveBeenCalledOnce()
  })

  it('should display an error message if the request fails', async () => {
    const user = userEvent.setup()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Mock error message' })
      })
    )

    await user.type(screen.getByLabelText(/room number/i), '404')
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.click(screen.getByRole('button', { name: /reserve/i }))

    const errorMessage = await screen.findByText(/error/i)
    expect(errorMessage).toBeInTheDocument()

    expect(mockOnConfirmClick).not.toHaveBeenCalled()
  })

  it('should call onSuccess when the booking is successful', async () => {
    const user = userEvent.setup()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })
    )

    await user.type(screen.getByLabelText(/room number/i), '404')
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.click(screen.getByRole('button', { name: /reserve/i }))

    await waitFor(() => {
      expect(mockOnConfirmClick).toHaveBeenCalledOnce()
    })
  })

  it('should disable buttons and change "reserve" text while loading', async () => {
    const user = userEvent.setup()

    let resolveFetch: (value: unknown) => void = () => {}
    const pendingPromise = new Promise((resolve) => {
      resolveFetch = resolve
    })

    const fetchMock = vi.fn().mockReturnValueOnce(pendingPromise)
    vi.stubGlobal('fetch', fetchMock)

    const submitButton = screen.getByRole('button', { name: /reserve/i })
    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    await user.type(screen.getByLabelText(/room number/i), '404')
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/reserving.../i)

    resolveFetch({
      ok: true,
      json: async () => ({ success: true })
    })

    await waitFor(() => {
      expect(mockOnConfirmClick).toHaveBeenCalled()
    })
  })
})
