const configured = import.meta.env.VITE_DATA_SOURCE || 'api'

if (!['api', 'mock'].includes(configured)) {
  throw new Error(`Unsupported VITE_DATA_SOURCE: ${configured}`)
}

export const DATA_SOURCE = configured
export const usingApi = DATA_SOURCE === 'api'
