import type { ResortMapProps } from '@/types'

const ResortMap = ({ grid, bookedCabanas, onCabanaClick }: ResortMapProps) => {
  const isPath = (rowIndex: number, colIndex: number) => {
    return grid[rowIndex]?.[colIndex] === '#'
  }

  const isChalet = (rowIndex: number, colIndex: number) => {
    return grid[rowIndex]?.[colIndex] === 'c'
  }

  const getPathPresentation = (rowIndex: number, colIndex: number) => {
    const pathConnections = {
      north: isPath(rowIndex - 1, colIndex),
      east: isPath(rowIndex, colIndex + 1),
      south: isPath(rowIndex + 1, colIndex),
      west: isPath(rowIndex, colIndex - 1)
    }
    const chaletNorthNeighbor = isChalet(rowIndex - 1, colIndex)

    const allPathConnections = { ...pathConnections } // all connections include the paths to homes
    const pathNeighborCount =
      Object.values(pathConnections).filter(Boolean).length

    // Homes only connect from the north side, and only when the road already continues.
    if (
      chaletNorthNeighbor &&
      !pathConnections.north &&
      pathNeighborCount > 0
    ) {
      allPathConnections.north = true
    }

    const connectionCount =
      Object.values(allPathConnections).filter(Boolean).length

    if (connectionCount >= 4) {
      return { src: '/assets/arrowCrossing.png', rotation: 0 }
    }

    if (connectionCount === 3) {
      if (!allPathConnections.west) {
        return { src: '/assets/arrowSplit.png', rotation: 0 }
      }

      if (!allPathConnections.north) {
        return { src: '/assets/arrowSplit.png', rotation: 90 }
      }

      if (!allPathConnections.east) {
        return { src: '/assets/arrowSplit.png', rotation: 180 }
      }

      return { src: '/assets/arrowSplit.png', rotation: 270 }
    }

    if (connectionCount === 2) {
      if (allPathConnections.north && allPathConnections.south) {
        return { src: '/assets/arrowStraight.png', rotation: 0 }
      }

      if (allPathConnections.east && allPathConnections.west) {
        return { src: '/assets/arrowStraight.png', rotation: 90 }
      }

      if (allPathConnections.north && allPathConnections.east) {
        return { src: '/assets/arrowCornerSquare.png', rotation: 0 }
      }

      if (allPathConnections.east && allPathConnections.south) {
        return { src: '/assets/arrowCornerSquare.png', rotation: 90 }
      }

      if (allPathConnections.south && allPathConnections.west) {
        return { src: '/assets/arrowCornerSquare.png', rotation: 180 }
      }

      return { src: '/assets/arrowCornerSquare.png', rotation: 270 }
    }

    if (connectionCount === 1) {
      if (allPathConnections.south) {
        return { src: '/assets/arrowEnd.png', rotation: 0 }
      }

      if (allPathConnections.west) {
        return { src: '/assets/arrowEnd.png', rotation: 90 }
      }

      if (allPathConnections.north) {
        return { src: '/assets/arrowEnd.png', rotation: 180 }
      }

      return { src: '/assets/arrowEnd.png', rotation: 270 }
    }

    return { src: '/assets/arrowEnd.png', rotation: 0 }
  }

  if (!grid || grid.length === 0)
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-100 border-t-amber-600"></div>
      </div>
    )

  const renderTile = (char: string, rowIndex: number, colIndex: number) => {
    const isCabana = char === 'W'
    const isBooked =
      isCabana && bookedCabanas.includes(`${rowIndex},${colIndex}`)

    let tileContent = null

    switch (char) {
      case 'W': // Cabana
        tileContent = (
          <img
            src="/assets/cabana.png"
            alt="Cabana"
            className={`h-full w-full ${isBooked ? 'cursor-not-allowed bg-red-400' : 'cursor-pointer bg-green-400'}`}
          />
        )
        break
      case 'p': // Pool
        tileContent = (
          <img src="/assets/pool.png" alt="Pool" className="h-full w-full" />
        )
        break
      case 'c': // Chalet
        tileContent = (
          <img
            src="/assets/houseChimney.png"
            alt="Chalet"
            className="h-full w-full"
          />
        )
        break
      case '#': // Path
        {
          const pathPresentation = getPathPresentation(rowIndex, colIndex)

          tileContent = (
            <img
              src={pathPresentation.src}
              alt="Path"
              className="h-full w-full"
              data-testid="path-icon"
              style={{ transform: `rotate(${pathPresentation.rotation}deg)` }}
            />
          )
        }
        break
      case '.':
        break
    }

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className="relative box-border flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden"
        data-testid="tile"
        onClick={() => {
          if (isCabana) {
            onCabanaClick(rowIndex, colIndex, isBooked)
          }
        }}
      >
        {tileContent}
      </div>
    )
  }

  return (
    <div
      className="inline-block overflow-hidden rounded-2xl border-4 border-amber-300 bg-amber-50 bg-cover bg-center bg-no-repeat"
      data-testid="map-container"
      style={{ backgroundImage: "url('/assets/parchmentBasic.png')" }}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((char, colIndex) => renderTile(char, rowIndex, colIndex))}
        </div>
      ))}
    </div>
  )
}

export default ResortMap
