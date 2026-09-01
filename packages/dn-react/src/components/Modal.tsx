import { useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { modalStack } from '../core/stores/modalStack'
import { confirmStore, type ConfirmRequest } from '../core/stores/confirmStore'
import { Icon } from '../core/utils/icon'
import { cx } from '../core/utils/cx'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { usePortalScope } from '../hooks/usePortalScope'
import { useStore } from '../hooks/useStore'

export type ModalSize = 'default' | 'confirm' | 'contain'

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean
  onClose(): void
  title?: ReactNode
  size?: ModalSize
  /** Cerrar al pulsar el fondo. Equivale a `data-maskclose` en dn-ui. */
  maskClosable?: boolean
  closable?: boolean
  closeLabel?: string
  footer?: ReactNode
}

/**
 * dn-ui apila los modales y cierra el ultimo con Escape, pero no atrapa el foco
 * ni lo devuelve, y su cierre desbloquea el scroll aunque queden otros abiertos.
 * Aqui el bloqueo lo lleva `modalStack` por contador y el foco queda encerrado
 * mientras el dialogo esta abierto.
 */
export const Modal = ({
  open,
  onClose,
  title,
  size = 'default',
  maskClosable = true,
  closable = true,
  closeLabel = 'Cerrar',
  footer,
  className,
  children,
  ...rest
}: ModalProps) => {
  const id = useId()
  const scope = usePortalScope('modal-gScope')
  const dialogRef = useRef<HTMLDivElement>(null)
  const { stack } = useStore(modalStack)
  const isTop = stack[stack.length - 1] === id

  useEffect(() => {
    if (!open) {
      modalStack.close(id)
      return
    }
    modalStack.open(id)
    return () => modalStack.close(id)
  }, [open, id])

  useEffect(() => {
    if (!open || !isTop) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, isTop, onClose])

  useFocusTrap({ enabled: open && isTop, containerRef: dialogRef })

  if (!open || !scope) return null

  return createPortal(
    <div className="modal-wrapper visible" onClick={maskClosable ? onClose : undefined} {...rest}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? `${id}-title` : undefined}
        className={cx('modal', size !== 'default' && size, className)}
        onClick={(event) => event.stopPropagation()}
      >
        {title != null && (
          <div className="modal-header" id={`${id}-title`}>
            {title}
          </div>
        )}

        {closable && (
          <button type="button" className="modal-close" aria-label={closeLabel} onClick={onClose}>
            <span className="icon icon-cross" aria-hidden="true" />
          </button>
        )}

        {children}
        {footer}
      </div>
    </div>,
    scope
  )
}

export const ModalHeader = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx('modal-header', className)} {...rest} />
)

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  confirm?: boolean
}

export const ModalBody = ({ confirm, className, ...rest }: ModalBodyProps) => (
  <div className={cx('modal-body', confirm && 'confirm', className)} {...rest} />
)

export const ModalFooter = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx('modal-confirmBtns', className)} {...rest} />
)

const ConfirmDialog = ({ request }: { request: ConfirmRequest }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const okRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    const key = String(request.id)
    modalStack.open(key)
    return () => modalStack.close(key)
  }, [request.id])

  useFocusTrap({
    enabled: true,
    containerRef: dialogRef,
    initialFocusRef: request.input ? inputRef : okRef
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      request.onCancel?.(inputRef.current ? inputRef.current.value : '')
      confirmStore.dismiss(request.id)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [request])

  const finish = (callback?: (value?: string) => void) => {
    callback?.(inputRef.current ? inputRef.current.value : '')
    confirmStore.dismiss(request.id)
  }

  return (
    <div className="modal-wrapper visible">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-content`}
        className="modal confirm"
      >
        <div className="modal-body confirm">
          <div
            className={cx('modal-confirmIcon', request.type)}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: Icon[request.type] }}
          />
          <div className="modal-confirmTile" id={`${id}-title`}>
            {request.title}
          </div>
          <div className="modal-confirmContent" id={`${id}-content`}>
            {request.content}
          </div>

          {request.input && (
            <div className="modal-confirmInput">
              <input
                ref={inputRef}
                type={request.inputType}
                className="form-control"
                defaultValue={request.inputValue}
              />
            </div>
          )}

          <div className="modal-confirmBtns">
            {request.confirm && (
              <button
                type="button"
                className={cx('btn', request.cancelClassNames)}
                onClick={() => finish(request.onCancel)}
              >
                {request.cancelText}
              </button>
            )}
            <button
              ref={okRef}
              type="button"
              className={cx('btn', request.okClassNames)}
              onClick={() => finish(request.onOk)}
            >
              {request.okText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Monta una vez cerca de la raiz para habilitar la API imperativa
 * `modal.confirm(...)`, `modal.info(...)`, etc.
 */
export const ModalHost = () => {
  const scope = usePortalScope('modal-gScope')
  const { items } = useStore(confirmStore)

  if (!scope) return null

  return createPortal(
    <>
      {items.map((request) => (
        <ConfirmDialog key={request.id} request={request} />
      ))}
    </>,
    scope
  )
}

/** API imperativa equivalente a la de dn-ui. Requiere `<ModalHost />` montado. */
export const modal = {
  confirm: confirmStore.confirm,
  info: confirmStore.info,
  success: confirmStore.success,
  danger: confirmStore.danger,
  warning: confirmStore.warning,
  closeAll: confirmStore.dismissAll
}
