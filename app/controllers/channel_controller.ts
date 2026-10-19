import Channel from '#models/channel'
import { createChannelValidator } from '#validators/channel'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChannelController {
  async index({ inertia }: HttpContext) {
    const channels = await Channel.query().orderBy('name', 'asc')
    const selectedChannel = channels[0]
    const messages = selectedChannel
      ? await selectedChannel
          .related('messages')
          .query()
          .preload('user')
          .orderBy('createdAt', 'asc')
      : []

    return inertia.render('dashboard', {
      channels: channels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        description: channel.description,
      })),
      selectedChannelId: selectedChannel?.id ?? null,
      messages: messages.map((message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt.toISO() ?? '',
        user: {
          id: message.user.id,
          fullName: message.user.fullName,
          initials: message.user.initials,
        },
      })),
    })
  }

  async show({ params, inertia }: HttpContext) {
    const channels = await Channel.query().orderBy('name', 'asc')
    const channel = await Channel.findOrFail(params.id)
    const messages = await channel
      .related('messages')
      .query()
      .preload('user')
      .orderBy('createdAt', 'asc')

    return inertia.render('dashboard', {
      channels: channels.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
      })),
      selectedChannelId: channel.id,
      messages: messages.map((message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt.toISO() ?? '',
        user: {
          id: message.user.id,
          fullName: message.user.fullName,
          initials: message.user.initials,
        },
      })),
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createChannelValidator)
    const channel = await Channel.create(payload)

    return response.redirect().toRoute('channels.show', { id: channel.id })
  }
}
