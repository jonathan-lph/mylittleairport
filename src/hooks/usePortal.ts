import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function usePortal() {
  const portalRef = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    portalRef.current = document.getElementById('portal')
    setMounted(true)
  }, [])

  return [
    mounted && portalRef.current ? portalRef.current : null, 
    createPortal
  ] as const
}
