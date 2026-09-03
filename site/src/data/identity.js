/* Living copy — the whole site reads from here. */

export const identity = {
  line: ['Sandarva'],
}

export const about =
  "This is where I put what I've made, what I've read, and occasionally what I'm thinking about."

export const contact = {
  email: 'imsandarva@gmail.com',
  primary: {
    id: 'substack',
    label: 'Substack',
    href: 'https://sandarva.substack.com',
    external: true,
  },
  secondary: [
    { id: 'twitter', label: 'Twitter', href: 'https://x.com/sandarvapaudel3', external: true },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/imsandarva/', external: true },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/sandarva', external: true },
    { id: 'github', label: 'GitHub', href: 'https://github.com/imsandarva', external: true },
  ],
}
