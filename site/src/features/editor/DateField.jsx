import { useRef } from 'react'
import { formatDate } from '../../lib/post/dates'

/* The date readers see, set as quiet metadata. It reads as text; the native picker opens when you click it. */
export default function DateField({ value, onChange }) {
  const input = useRef(null)
  const open = () => { const el = input.current; if (!el) return; try { el.showPicker() } catch { el.focus() } }

  return (
    <span className="write-date">
      <button type="button" aria-label={`Date readers see: ${formatDate(value)}. Change it`} title="Change the date readers see" onClick={open}>
        <time dateTime={value}>{formatDate(value)}</time>
      </button>
      <input ref={input} type="date" tabIndex={-1} aria-hidden="true" value={value || ''} onChange={(e) => { if (e.target.value) onChange(e.target.value) }} />
    </span>
  )
}
