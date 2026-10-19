import Channel from '#models/channel'
import { createMessageValidator } from '#validators/message'
import transmit from '@adonisjs/transmit/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class MessageController {
  async store({ params, request, auth, response }: HttpContext) {
    const channel = await Channel.findOrFail(params.channelId)
    const { content } = await request.validateUsing(createMessageValidator)
    const message = await channel.related('messages').create({
      content,
      userId: auth.user!.id,
    })

    await message.load('user')

    const payload = {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISO() ?? '',
      user: {
        id: message.user.id,
        fullName: message.user.fullName,
        initials: message.user.initials,
      },
    }

    transmit.broadcast(`channels/${channel.id}/messages`, payload)

    return response.redirect().back()
  }
}
