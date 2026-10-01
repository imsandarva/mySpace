import { useEffect, useState } from 'react'

/* Same cutoff as the desktop shelf: below it, the phone composition takes over. */
const PHONE = '(max-width: 959px)'

function matches() {
  return window.matchMedia(PHONE).matches
}

export function usePhone() {
  const [phone, setPhone] = useState(matches)
  useEffect(() => {
    const mq = window.matchMedia(PHONE)
    const onChange = () => setPhone(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    window.addEventListener('resize', onChange)
    return () => { mq.removeEventListener('change', onChange); window.removeEventListener('resize', onChange) }
  }, [])
  return phone
}
