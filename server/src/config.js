import 'dotenv/config'

export function loadConfig(overrides = {}) {
  const config = {
    port: Number(overrides.port ?? process.env.PORT ?? 5000),
    jwtSecret: overrides.jwtSecret ?? process.env.JWT_SECRET,
    jwtExpiresIn: overrides.jwtExpiresIn ?? process.env.JWT_EXPIRES_IN ?? '8h',
    clientOrigins: String(overrides.clientOrigin ?? process.env.CLIENT_ORIGIN ?? 'http://localhost:5173').split(',').map((value) => value.trim()).filter(Boolean),
    environment: overrides.environment ?? process.env.NODE_ENV ?? 'development',
  }
  if (!config.jwtSecret || config.jwtSecret.length < 16) throw new Error('JWT_SECRET is required and must contain at least 16 characters.')
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) throw new Error('PORT must be a valid TCP port.')
  return config
}
