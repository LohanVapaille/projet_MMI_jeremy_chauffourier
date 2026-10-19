import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import transmit from '@adonisjs/transmit/services/main'

transmit.authorize<{ id: string }>('channels/:id/messages', async (_ctx: HttpContext, { id }) => {
  await Channel.findOrFail(Number(id))
  return true
})
