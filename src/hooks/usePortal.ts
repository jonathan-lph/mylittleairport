import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function usePortal() {
  const [portalNode] = useState<HTMLElement | null>(() =>
    typeof document === 'undefined' ? null : document.getElementById('portal')
  )

  return [portalNode, createPortal] as const
}
