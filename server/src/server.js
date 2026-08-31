import { createServerContext } from './createServerContext.js'

const { app, config } = await createServerContext()

app.listen(config.port, () => {
  console.log(`CollabBoard API listening on http://localhost:${config.port}/api`)
})
