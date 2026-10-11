import { contact } from '../data/identity'

/* Props for any link that leaves the site. */
export const outbound = { target: '_blank', rel: 'noopener noreferrer' }

export const mailto = `mailto:${contact.email}`

/* Everywhere else I live online, in display order. */
export const elsewhere = [contact.primary, contact.pinterest, ...contact.secondary]
