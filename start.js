import { spawn } from 'child_process'
import path from 'node:path'

const args = process.argv.slice(2)

const getOptionValue = (optionName) => {
  const optionIndex = args.indexOf(optionName)
  if (optionIndex === -1) return undefined

  const optionValue = args[optionIndex + 1]
  if (!optionValue || optionValue.startsWith('--')) return undefined

  return optionValue
}

const normalizeNpmConfigValue = (value) => {
  if (value === undefined || value === 'true') {
    return undefined
  }

  return value
}

const positionalArgs = args.filter((arg) => !arg.startsWith('--'))
const explicitMapArg = getOptionValue('--map')
const explicitBookingsArg = getOptionValue('--bookings')

const mapFromNpmConfig = normalizeNpmConfigValue(process.env.npm_config_map)
const bookingsFromNpmConfig = normalizeNpmConfigValue(
  process.env.npm_config_bookings
)

const hasMapFlag =
  explicitMapArg !== undefined || process.env.npm_config_map !== undefined
const hasBookingsFlag =
  explicitBookingsArg !== undefined ||
  process.env.npm_config_bookings !== undefined
const hasExplicitFlags = args.includes('--map') || args.includes('--bookings')

let mapArgCandidate = explicitMapArg ?? mapFromNpmConfig
let bookingsArgCandidate = explicitBookingsArg ?? bookingsFromNpmConfig

if (positionalArgs.length > 0) {
  if (!hasExplicitFlags) {
    if (positionalArgs.length >= 2) {
      // npm can strip unknown flags and pass only positional values.
      mapArgCandidate = positionalArgs[0]
      bookingsArgCandidate = positionalArgs[1]
    } else if (hasBookingsFlag && !hasMapFlag) {
      bookingsArgCandidate = bookingsArgCandidate ?? positionalArgs[0]
    } else {
      mapArgCandidate = mapArgCandidate ?? positionalArgs[0]
    }
  } else if (hasMapFlag && !hasBookingsFlag && mapArgCandidate === undefined) {
    mapArgCandidate = positionalArgs[0]
  } else if (
    hasBookingsFlag &&
    !hasMapFlag &&
    bookingsArgCandidate === undefined
  ) {
    bookingsArgCandidate = positionalArgs[0]
  } else {
    mapArgCandidate = mapArgCandidate ?? positionalArgs[0]
    bookingsArgCandidate = bookingsArgCandidate ?? positionalArgs[1]
  }
}

const mapArg = mapArgCandidate ?? 'map.ascii'
const bookingsArg = bookingsArgCandidate ?? 'bookings.json'

const mapPath = path.isAbsolute(mapArg)
  ? mapArg
  : path.resolve(process.cwd(), mapArg)
const bookingsPath = path.isAbsolute(bookingsArg)
  ? bookingsArg
  : path.resolve(process.cwd(), bookingsArg)

spawn(
  'npm',
  [
    'run',
    'dev',
    '--prefix',
    'backend',
    '--',
    '--map',
    mapPath,
    '--bookings',
    bookingsPath
  ],
  {
  stdio: 'inherit',
  shell: true
  }
)

spawn('npm', ['run', 'dev', '--prefix', 'frontend'], {
  stdio: 'inherit',
  shell: true
})
