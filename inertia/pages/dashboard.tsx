import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { Hash, MessageCircle, Plus, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Transmit } from '@adonisjs/transmit-client'
import { usePage } from '@inertiajs/react'
import type { InertiaProps } from '~/types'

type Channel = {
  id: number
  name: string
  description: string | null
}

type Message = {
  id: number
  content: string
  createdAt: string
  user: {
    id: number
    fullName: string | null
    initials: string
  }
}

type DashboardProps = {
  channels: Channel[]
  selectedChannelId: number | null
  messages: Message[]
}

export default function Dashboard({
  channels,
  selectedChannelId,
  messages: initialMessages,
}: InertiaProps<DashboardProps>) {
  const [messages, setMessages] = useState(initialMessages)
  const [showChannelForm, setShowChannelForm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const selectedChannel = channels.find((channel) => channel.id === selectedChannelId)
  const { user } = usePage<InertiaProps>().props

  useEffect(() => {
    if (!selectedChannelId) {
      return
    }

    const transmit = new Transmit({ baseUrl: window.location.origin })
    const subscription = transmit.subscription(`channels/${selectedChannelId}/messages`)
    const unsubscribe = subscription.onMessage<Message>((message) => {
      setMessages((current) =>
        current.some((item) => item.id === message.id) ? current : [...current, message]
      )
    })

    void subscription.create()

    return () => {
      unsubscribe()
      void subscription.delete()
      transmit.close()
    }
  }, [selectedChannelId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="discord">
      <aside className="discord__sidebar">
        <div className="discord__sidebar-header">
          <div>
            <span className="tag">Workspace</span>
            <h1>Mini Discord</h1>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Create a channel"
            onClick={() => setShowChannelForm((visible) => !visible)}
          >
            <Plus size={18} />
          </button>
        </div>

        {showChannelForm && (
          <Form route="channels.store" className="channel-create">
            {({ errors, processing }) => (
              <>
                {(() => {
                  const formErrors = errors as Record<string, string | undefined>
                  return (
                    <>
                      <input name="name" placeholder="Channel name" autoFocus />
                      <input name="description" placeholder="Description (optional)" />
                      {formErrors.name && <span className="field__error">{formErrors.name}</span>}
                      <button
                        type="submit"
                        className="btn btn--primary btn--sm"
                        disabled={processing}
                      >
                        Create channel
                      </button>
                    </>
                  )
                })()}
              </>
            )}
          </Form>
        )}

        <div className="discord__channels">
          <span className="tag">Text channels</span>
          {channels.length === 0 && <p className="discord__empty">Create your first channel.</p>}
          {channels.map((channel) => (
            <Link
              key={channel.id}
              href={`/channels/${channel.id}`}
              className={`channel-link${channel.id === selectedChannelId ? ' is-active' : ''}`}
            >
              <Hash size={16} />
              <span>{channel.name}</span>
            </Link>
          ))}
        </div>
      </aside>

      <main className="discord__chat">
        {selectedChannel ? (
          <>
            <header className="discord__chat-header">
              <div>
                <h2>
                  <Hash size={20} /> {selectedChannel.name}
                </h2>
                {selectedChannel.description && <p>{selectedChannel.description}</p>}
              </div>
              <span className="live-indicator">Live</span>
            </header>

            <div className="discord__messages">
              {messages.length === 0 && (
                <div className="discord__welcome">
                  <MessageCircle size={30} />
                  <h2>Welcome to #{selectedChannel.name}</h2>
                  <p>This is the beginning of this channel.</p>
                </div>
              )}
              {messages.map((message) => (
                <article
                  className={`message${message.user.id === user?.id ? ' message--own' : ''}`}
                  key={message.id}
                >
                  <div className="avatar">{message.user.initials}</div>
                  <div className="message__body">
                    <div className="message__meta">
                      <strong>{message.user.fullName || 'Anonymous'}</strong>
                      <time dateTime={message.createdAt}>
                        {new Date(message.createdAt).toLocaleString()}
                      </time>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </article>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <Form
              route="messages.store"
              routeParams={{ channelId: selectedChannel.id }}
              className="message-form"
              resetOnSuccess
            >
              {({ processing, errors }) => (
                <>
                  {(() => {
                    const formErrors = errors as Record<string, string | undefined>
                    return (
                      <>
                        <input
                          name="content"
                          placeholder={`Message #${selectedChannel.name}`}
                          aria-label={`Message #${selectedChannel.name}`}
                          disabled={processing}
                        />
                        <button type="submit" className="icon-btn" aria-label="Send message">
                          <Send size={18} />
                        </button>
                        {formErrors.content && (
                          <span className="field__error">{formErrors.content}</span>
                        )}
                      </>
                    )
                  })()}
                </>
              )}
            </Form>
          </>
        ) : (
          <div className="discord__welcome discord__welcome--empty">
            <MessageCircle size={36} />
            <h2>No channel yet</h2>
            <p>Use the plus button to create your first channel.</p>
          </div>
        )}
      </main>
    </div>
  )
}

Dashboard.layout = [AppLayout]
