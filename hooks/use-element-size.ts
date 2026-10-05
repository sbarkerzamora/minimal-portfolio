"use client"
import { useCallback, useEffect, useState } from "react"

export function useElementSize() {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const ref = useCallback((node: HTMLDivElement | null) => {
    setElement(node)
  }, [])
  const [size, setSize] = useState({ width: 320, height: 320 })
  useEffect(() => {
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height }
      )
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])
  return { ref, ...size }
}
