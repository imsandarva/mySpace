/* Share of its slot the book fills. One number, used both to frame the resting book and to aim the flight,
   so the two cannot drift apart and the book cannot land smaller than the one waiting on the shelf. */
export const slotFill = (book) => 0.78 * (book.shape.h / 112)
