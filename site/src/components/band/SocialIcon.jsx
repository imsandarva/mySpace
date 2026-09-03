/* Monochrome stroke icons — brand color on hover via CSS platform classes. */

const icons = {
  twitter: (
    <path
      d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
      fill="currentColor"
    />
  ),
  instagram: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle className="sign-icon-dot" cx="16.2" cy="7.8" r="0.75" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8 11v5M8 8.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 16v-3c0-1.5 1-2.5 2.5-2.5S17 11.5 17 13v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  github: (
    <path
      d="M12 3c-4.4 0-8 3.4-8 7.6 0 3.4 2.2 6.3 5.2 7.3.4.1.5-.2.5-.4v-1.4c-2.1.4-2.6-1-2.6-1-.4-.9-.9-1.1-.9-1.1-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.4.7.1-.5.3-.9.5-1.1-1.7-.2-3.5-.8-3.5-3.6 0-.8.3-1.5.8-2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2 0 2.8-1.8 3.4-3.5 3.6.3.2.5.7.5 1.4v2.1c0 .2.1.5.5.4 3.1-1 5.2-3.9 5.2-7.3C20 6.4 16.4 3 12 3z"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinejoin="round"
      fill="none"
    />
  ),
}

export default function SocialIcon({ id }) {
  return (
    <svg className="sign-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {id === 'instagram' && (
        <defs>
          <linearGradient id="sign-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
      )}
      {icons[id]}
    </svg>
  )
}
