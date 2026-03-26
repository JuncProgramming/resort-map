import ResortMap from '@/components/ResortMap'
import { render, screen } from '@testing-library/react'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

const mockOnCabanaClick = vi.fn()

describe('ResortMap Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the correct number of tiles based on the grid prop', () => {
    render(
      <ResortMap
        grid={[
          ['W', 'p'],
          ['c', '.']
        ]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    expect(screen.getAllByTestId(/tile/i)).toHaveLength(4)
  })

  it('should check if a booked cabana has the correct classes', () => {
    render(
      <ResortMap
        grid={[
          ['W', 'p'],
          ['c', '.']
        ]}
        bookedCabanas={['0,0']}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    expect(screen.getAllByAltText('Cabana')[0]).toHaveClass(
      'cursor-not-allowed'
    )
  })

  it('should trigger onCabanaClick when an available cabana is clicked', async () => {
    const user = userEvent.setup()

    render(
      <ResortMap
        grid={[
          ['W', 'p'],
          ['c', '.']
        ]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    // Cabana tile
    await user.click(screen.getAllByTestId(/tile/i)[0])
    expect(mockOnCabanaClick).toHaveBeenCalledOnce()
  })

  it('should not trigger onCabanaClick if a tile other than a cabana is clicked', async () => {
    const user = userEvent.setup()

    render(
      <ResortMap
        grid={[
          ['W', 'p'],
          ['c', '.']
        ]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    // not Cabana tile
    await user.click(screen.getAllByTestId(/tile/i)[3])
    expect(mockOnCabanaClick).not.toHaveBeenCalledOnce()
  })

  it('should render crossing for a path connected on all sides', () => {
    render(
      <ResortMap
        grid={[
          ['.', '#', '.'],
          ['#', '#', '#'],
          ['.', '#', '.']
        ]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    const centerTile = screen.getAllByTestId(/tile/i)[4]
    const centerPathIcon = within(centerTile).getByTestId('path-icon')

    expect(centerPathIcon).toHaveAttribute('src', '/assets/arrowCrossing.png')
  })

  it('should render horizontal straight path with rotation', () => {
    render(
      <ResortMap
        grid={[['#', '#', '#']]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    const centerTile = screen.getAllByTestId(/tile/i)[1]
    const centerPathIcon = within(centerTile).getByTestId('path-icon')

    expect(centerPathIcon).toHaveAttribute('src', '/assets/arrowStraight.png')
    expect(centerPathIcon).toHaveStyle({ transform: 'rotate(90deg)' })
  })

  it('should render corner path when connected north and east', () => {
    render(
      <ResortMap
        grid={[
          ['.', '#', '.'],
          ['.', '#', '#'],
          ['.', '.', '.']
        ]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    const centerTile = screen.getAllByTestId(/tile/i)[4]
    const centerPathIcon = within(centerTile).getByTestId('path-icon')

    expect(centerPathIcon).toHaveAttribute(
      'src',
      '/assets/arrowCornerSquare.png'
    )
    expect(centerPathIcon).toHaveStyle({ transform: 'rotate(0deg)' })
  })

  it('should render split path when connected north east and west', () => {
    render(
      <ResortMap
        grid={[
          ['.', '#', '.'],
          ['#', '#', '#'],
          ['.', '.', '.']
        ]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    const centerTile = screen.getAllByTestId(/tile/i)[4]
    const centerPathIcon = within(centerTile).getByTestId('path-icon')

    expect(centerPathIcon).toHaveAttribute('src', '/assets/arrowSplit.png')
    expect(centerPathIcon).toHaveStyle({ transform: 'rotate(270deg)' })
  })

  it('should rotate end path toward a north connection', () => {
    render(
      <ResortMap
        grid={[['#'], ['#']]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    const bottomTile = screen.getAllByTestId(/tile/i)[1]
    const bottomPathIcon = within(bottomTile).getByTestId('path-icon')

    expect(bottomPathIcon).toHaveAttribute('src', '/assets/arrowEnd.png')
    expect(bottomPathIcon).toHaveStyle({ transform: 'rotate(180deg)' })
  })

  it('should render a split next to chalet for a straight horizontal road', () => {
    render(
      <ResortMap
        grid={[
          ['.', 'c', '.'],
          ['#', '#', '#'],
          ['.', '.', '.']
        ]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    const centerTile = screen.getAllByTestId(/tile/i)[4]
    const centerPathIcon = within(centerTile).getByTestId('path-icon')

    expect(centerPathIcon).toHaveAttribute('src', '/assets/arrowSplit.png')
    expect(centerPathIcon).toHaveStyle({ transform: 'rotate(270deg)' })
  })

  it('should connect an end path to a north chalet', () => {
    render(
      <ResortMap
        grid={[['c'], ['#'], ['#']]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    const centerTile = screen.getAllByTestId(/tile/i)[1]
    const centerPathIcon = within(centerTile).getByTestId('path-icon')

    expect(centerPathIcon).toHaveAttribute('src', '/assets/arrowStraight.png')
    expect(centerPathIcon).toHaveStyle({ transform: 'rotate(0deg)' })
  })

  it('should not connect a chalet placed south of a horizontal road', () => {
    render(
      <ResortMap
        grid={[
          ['.', '.', '.'],
          ['#', '#', '#'],
          ['.', 'c', '.']
        ]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    const centerTile = screen.getAllByTestId(/tile/i)[4]
    const centerPathIcon = within(centerTile).getByTestId('path-icon')

    expect(centerPathIcon).toHaveAttribute('src', '/assets/arrowStraight.png')
    expect(centerPathIcon).toHaveStyle({ transform: 'rotate(90deg)' })
  })

  it('should render an end path for isolated tiles', () => {
    render(
      <ResortMap
        grid={[['#']]}
        bookedCabanas={[]}
        onCabanaClick={mockOnCabanaClick}
      />
    )

    const centerTile = screen.getAllByTestId(/tile/i)[0]
    const centerPathIcon = within(centerTile).getByTestId('path-icon')

    expect(centerPathIcon).toHaveAttribute('src', '/assets/arrowEnd.png')
    expect(centerPathIcon).toHaveStyle({ transform: 'rotate(0deg)' })
  })
})
