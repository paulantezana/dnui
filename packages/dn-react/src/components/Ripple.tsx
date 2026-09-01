import { useCallback, useRef, useState, type MouseEvent } from 'react'

interface RippleCircle {
  id: number
  size: number
  left: number
  top: number
}

export interface UseRippleResult {
  /** Handler a poner en el `onClick` (o `onPointerDown`) del elemento. */
  onClick(event: MouseEvent<HTMLElement>): void
  /** Nodos a renderizar dentro del elemento, que debe ser `position: relative`. */
  ripples: React.ReactNode
}

/**
 * Onda al pulsar, como `ripple.ts` en dn-ui.
 *
 * Dos avisos: el original nunca se ejecuta, porque hace
 * `getElementsByClassName('.btn')` con punto y eso no coincide con nada; y no hay
 * CSS para la clase `ripple` en el paquete, asi que hay que darle estilo para
 * que se vea.
 */
export const useRipple = (): UseRippleResult => {
  const [circles, setCircles] = useState<RippleCircle[]>([])
  const nextId = useRef(0)

  const onClick = useCallback((event: MouseEvent<HTMLElement>) => {
    const target = event.currentTarget
    const size = Math.max(target.clientWidth, target.clientHeight)
    const rect = target.getBoundingClientRect()

    const circle: RippleCircle = {
      id: nextId.current++,
      size,
      left: event.clientX - rect.left - size / 2,
      top: event.clientY - rect.top - size / 2
    }

    // dn-ui solo mantiene una onda a la vez: la nueva reemplaza a la anterior.
    setCircles([circle])
  }, [])

  const ripples = circles.map((circle) => (
    <span
      key={circle.id}
      className="ripple"
      aria-hidden="true"
      style={{
        width: `${circle.size}px`,
        height: `${circle.size}px`,
        left: `${circle.left}px`,
        top: `${circle.top}px`
      }}
    />
  ))

  return { onClick, ripples }
}
