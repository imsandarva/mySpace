/* Shelf of titles — each entry exits to Substack. Update urls when posts go live. */

const thumb = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`

export const writings = [
  {
    slug: 'election-2026-of-nepal',
    title: 'Election 2026 of Nepal',
    subtitle: 'Views on an upcoming historic election.',
    url: 'https://imsandarva.substack.com/p/election-2026-of-nepal',
    thumb: thumb('photo-1605640840605-14ac1855827b'),
  },
  {
    slug: 'successful-people',
    title: 'Successful People',
    subtitle: 'On the scale of what people actually make.',
    url: 'https://imsandarva.substack.com/p/successful-people',
    thumb: thumb('photo-1548013146-72479768bada'),
  },
  {
    slug: 'what-we-get-from-reading-a-book',
    title: 'What we get from reading a book',
    subtitle: 'Why read, if we will not remember most of it.',
    url: 'https://imsandarva.substack.com/p/what-we-get-from-reading-a-book',
    thumb: thumb('photo-1512820790803-83ca734da794'),
  },
  {
    slug: 'life-of-an-idea',
    title: 'Life of an idea',
    subtitle: 'Willing things into existence.',
    url: 'https://imsandarva.substack.com/p/life-of-an-idea',
    thumb: thumb('photo-1449247709967-d4461a6a6103'),
  },
  {
    slug: 'by-endurance-we-conquer',
    title: 'By endurance we conquer',
    subtitle: 'On Ernest Shackleton’s voyage.',
    url: 'https://imsandarva.substack.com/p/by-endurance-we-conquer',
    thumb: thumb('photo-1464822759023-fed622ff2c3b'),
  },
]
