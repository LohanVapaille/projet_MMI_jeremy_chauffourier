/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import transmit from '@adonisjs/transmit/services/main'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router
      .get('/channels', [() => import('#controllers/channel_controller'), 'index'])
      .as('channels.index')
    router
      .get('/channels/:id', [() => import('#controllers/channel_controller'), 'show'])
      .as('channels.show')
    router
      .post('/channels', [() => import('#controllers/channel_controller'), 'store'])
      .as('channels.store')
    router
      .post('/channels/:channelId/messages', [
        () => import('#controllers/message_controller'),
        'store',
      ])
      .as('messages.store')
    router
      .get('/dashboard', [() => import('#controllers/channel_controller'), 'index'])
      .as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

transmit.registerRoutes((route) => {
  route.middleware(middleware.auth())
})
