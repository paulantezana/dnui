import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { messageStore, type MessageItem } from '../core/stores/messageStore'
import { Icon } from '../core/utils/icon'
import { cx } from '../core/utils/cx'
import { usePortalScope } from '../hooks/usePortalScope'
import { useStore } from '../hooks/useStore'

/** Duracion de la transicion de entrada y salida, igual que dn-ui. */
export const TRANSITION_LENGTH = 700

const Toast = ({ item }: { item: MessageItem }) => {
  const [open, setOpen] = useState(false)
  const closing = useRef(false)

  // dn-ui anade `open` en un timeout para que la transicion CSS arranque.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const dismiss = () => {
    if (closing.current) return
    closing.current = true
    setOpen(false)
    setTimeout(() => messageStore.close(item.id), TRANSITION_LENGTH)
  }

  useEffect(() => {
    if (!Number.isFinite(item.duration)) return

    const timer = setTimeout(dismiss, item.duration)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.duration, item.id])

  return (
    <div className={cx('message', item.type, open && 'open')} role="status" aria-live="polite">
      <span
        className="message-icon"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: Icon[item.icon] }}
      />
      <span className="message-content">{item.content}</span>
      <span
        className="message-close"
        role="button"
        tabIndex={0}
        aria-label="Cerrar mensaje"
        onClick={dismiss}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            dismiss()
          }
        }}
      >
        x
      </span>
    </div>
  )
}

/**
 * Monta una vez cerca de la raiz para habilitar `message.info(...)` y companeros.
 *
 * `message.css` fija el contenedor arriba a la derecha, asi que no hay otras
 * posiciones; dn-ui tampoco las tiene, aunque su pagina de demo las mencione.
 */
export const MessageHost = () => {
  const scope = usePortalScope('message-scope')
  const { items } = useStore(messageStore)

  if (!scope) return null

  return createPortal(
    <>
      {items.map((item) => (
        <Toast key={item.id} item={item} />
      ))}
    </>,
    scope
  )
}

/** API imperativa equivalente a `PdMessage`. Requiere `<MessageHost />` montado. */
export const message = {
  info: messageStore.info,
  success: messageStore.success,
  warning: messageStore.warning,
  danger: messageStore.danger,
  message: messageStore.message,
  update: messageStore.update,
  close: messageStore.close,
  closeAll: messageStore.closeAll,
  getAll: messageStore.getAll
}
