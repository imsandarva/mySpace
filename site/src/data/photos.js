/* Curated found images — one tonal world. Replace freely. */

const u = (id, w) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=78`

export const photos = [
  {
    id: 'khumbu',
    src: u('photo-1544735716-392fe2489ffa', 1400),
    full: u('photo-1544735716-392fe2489ffa', 2200),
    alt: 'Himalayan ridge after weather',
    caption: 'After weather',
    layout: 'hero',
  },
  {
    id: 'kathmandu',
    src: u('photo-1605640840605-14ac1855827b', 900),
    full: u('photo-1605640840605-14ac1855827b', 1800),
    alt: 'Kathmandu square in afternoon light',
    caption: 'Afternoon, Kathmandu',
    layout: 'mid',
  },
  {
    id: 'stack',
    src: u('photo-1512820790803-83ca734da794', 900),
    full: u('photo-1512820790803-83ca734da794', 1800),
    alt: 'A stack of books',
    caption: 'Waiting',
    layout: 'mid',
  },
  {
    id: 'fog',
    src: u('photo-1470071459604-3b5ec3a7fe05', 1100),
    full: u('photo-1470071459604-3b5ec3a7fe05', 2000),
    alt: 'Forested mountain in fog',
    caption: 'Held in cloud',
    layout: 'wide',
  },
  {
    id: 'paper',
    src: u('photo-1455390582262-044cdead277a', 800),
    full: u('photo-1455390582262-044cdead277a', 1600),
    alt: 'Open notebook and pen',
    caption: 'Before the sentence',
    layout: 'sm',
  },
  {
    id: 'interior',
    src: u('photo-1449247709967-d4461a6a6103', 800),
    full: u('photo-1449247709967-d4461a6a6103', 1600),
    alt: 'Quiet table by a window',
    caption: 'A room, late',
    layout: 'sm',
  },
  {
    id: 'peak',
    src: u('photo-1464822759023-fed622ff2c3b', 1100),
    full: u('photo-1464822759023-fed622ff2c3b', 2000),
    alt: 'A sharp mountain peak',
    caption: 'Stillness at altitude',
    layout: 'wide',
  },
  {
    id: 'library',
    src: u('photo-1481627834876-b7833e8f5570', 900),
    full: u('photo-1481627834876-b7833e8f5570', 1800),
    alt: 'Library shelves',
    caption: 'What remains',
    layout: 'mid',
  },
  {
    id: 'dusk',
    src: u('photo-1419242902214-272b3f66ee7a', 900),
    full: u('photo-1419242902214-272b3f66ee7a', 1800),
    alt: 'Warm dusk sky',
    caption: 'The last light',
    layout: 'mid',
  },
]
