import vine from '@vinejs/vine'

export const createChannelValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(80),
  description: vine.string().trim().maxLength(255).nullable(),
})
