import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  /** Iniciales que se muestran cuando no hay imagen. */
  fallback?: string
}

/** Imagen si hay `src`; si no, las iniciales sobre el fondo de `.avatar-text`. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt = '', fallback, className, children, ...rest },
  ref
) {
  return (
    <span ref={ref} className={cx('avatar', className)} {...rest}>
      {src ? (
        <img className="avatar-img" src={src} alt={alt} />
      ) : (
        (children ?? <span className="avatar-text">{fallback}</span>)
      )}
    </span>
  )
})
