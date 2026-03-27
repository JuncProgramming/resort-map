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

const positionalArgs = args.filter((arg) => !arg.startsWith('--'))
const positionalMapArg = positionalArgs[0]
const positionalBookingsArg = positionalArgs[1]

const mapArg = getOptionValue('--map') ?? positionalMapArg ?? 'map.ascii'
const bookingsArg =
  getOptionValue('--bookings') ?? positionalBookingsArg ?? 'bookings.json'

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
