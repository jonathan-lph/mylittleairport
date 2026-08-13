import { useEffect, useState } from 'react'

export default function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (isMounted && !shouldRender) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors isMounted with no delay; the extra render is negligible for this exit-animation flag
      setShouldRender(true)
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime)
    }
    return () => clearTimeout(timeoutId)
  }, [isMounted, delayTime, shouldRender])
  
  return shouldRender
}
