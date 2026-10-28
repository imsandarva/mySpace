/* The one place a problem is told to you. It never replaces your writing, and it says what to do next. */
export default function Notice({ message, onRetry, onDismiss }) {
  if (!message) return null
  return (
    <div className="notice" role="alert">
      <p>{message}</p>
      {onRetry && <button type="button" onClick={onRetry}>Try again</button>}
      <button type="button" className="is-quiet" onClick={onDismiss}>Dismiss</button>
    </div>
  )
}
