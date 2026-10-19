/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [[0,"/"]],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [[0,"signup"]],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [[0,"signup"]],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.store']['types'],
  },
  'channels.index': {
    methods: ["GET","HEAD"],
    pattern: '/channels',
    tokens: [[0,"channels"]],
    types: placeholder as Registry['channels.index']['types'],
  },
  'channels.show': {
    methods: ["GET","HEAD"],
    pattern: '/channels/:id',
    tokens: [[0,"channels"],[1,"id"]],
    types: placeholder as Registry['channels.show']['types'],
  },
  'channels.store': {
    methods: ["POST"],
    pattern: '/channels',
    tokens: [[0,"channels"]],
    types: placeholder as Registry['channels.store']['types'],
  },
  'messages.store': {
    methods: ["POST"],
    pattern: '/channels/:channelId/messages',
    tokens: [[0,"channels"],[1,"channelId"],[0,"messages"]],
    types: placeholder as Registry['messages.store']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [[0,"dashboard"]],
    types: placeholder as Registry['dashboard']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [[0,"logout"]],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'event_stream': {
    methods: ["GET","HEAD"],
    pattern: '/__transmit/events',
    tokens: [[0,"__transmit"],[0,"events"]],
    types: placeholder as Registry['event_stream']['types'],
  },
  'subscribe': {
    methods: ["POST"],
    pattern: '/__transmit/subscribe',
    tokens: [[0,"__transmit"],[0,"subscribe"]],
    types: placeholder as Registry['subscribe']['types'],
  },
  'unsubscribe': {
    methods: ["POST"],
    pattern: '/__transmit/unsubscribe',
    tokens: [[0,"__transmit"],[0,"unsubscribe"]],
    types: placeholder as Registry['unsubscribe']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
