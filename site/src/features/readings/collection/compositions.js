/* Art direction for the homepage collection, one plan per width. Plain data, so the arrangement can be re-composed
   without touching any component. Units: x = centre and w = width, both in % of the stage; y = lift off the bottom, in rem;
   yaw/pitch = resting turn and tilt, in radians. `pick` is 'current' or an index into the shelf (data/home.js).
   Principles: one focal book, slightly forward; varied scale and turn; breathing room; titles never hidden. */

export const compositions = {
  wide: {
    stageH: '30rem',
    slots: [
      { pick: 3, x: 4.9, w: 14, y: 2.4, yaw: 0.5, pitch: 0.18 },
      { pick: 0, x: 17.9, w: 17, y: 0.7, yaw: 0.42, pitch: 0.19 },
      { pick: 'current', x: 35.7, w: 28, y: 0, yaw: 0.36, pitch: 0.2 },
      { pick: 1, x: 54.3, w: 19, y: 1.2, yaw: 0.46, pitch: 0.17 },
      { pick: 2, x: 68.6, w: 16, y: 3.2, yaw: 0.4, pitch: 0.19 },
      { pick: 4, x: 82.4, w: 17.5, y: 0.5, yaw: 0.52, pitch: 0.18 },
      { pick: 5, x: 95.2, w: 13, y: 2.6, yaw: 0.44, pitch: 0.17 },
    ],
  },
  narrow: {
    stageH: '32rem',
    slots: [
      { pick: 'current', x: 31, w: 56, y: 14.2, yaw: 0.36, pitch: 0.2 },
      { pick: 0, x: 80, w: 38, y: 16.2, yaw: 0.46, pitch: 0.17 },
      { pick: 1, x: 17.5, w: 36, y: 1.2, yaw: 0.44, pitch: 0.18 },
      { pick: 2, x: 50, w: 36, y: 2.6, yaw: 0.4, pitch: 0.17 },
      { pick: 3, x: 82.5, w: 36, y: 0.8, yaw: 0.5, pitch: 0.19 },
    ],
  },
}
