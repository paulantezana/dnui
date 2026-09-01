import { useEffect, useLayoutEffect } from 'react'

/** `useLayoutEffect` en el navegador, `useEffect` en SSR, para no avisar en consola. */
export const useIsomorphicLayoutEffect =
  typeof document !== 'undefined' ? useLayoutEffect : useEffect
