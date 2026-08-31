import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const input = process.argv[2]
if (!input) throw new Error('Usage: node scripts/sanitize_newman_results.mjs <newman-results.json>')

const file = resolve(input)
const bearerToken = /Bearer\s+[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g

function sanitize(value) {
  if (typeof value === 'string') return value.replace(bearerToken, 'Bearer [REDACTED]')
  if (Array.isArray(value)) return value.map(sanitize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitize(child)]))
  }
  return value
}

const report = JSON.parse(await readFile(file, 'utf8'))
await writeFile(file, `${JSON.stringify(sanitize(report), null, 2)}\n`, 'utf8')
console.log(`Sanitized Newman evidence: ${file}`)
