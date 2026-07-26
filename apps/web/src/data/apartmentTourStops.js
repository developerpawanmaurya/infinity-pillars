export const APARTMENT_MODEL_URL = '/models/apartment/appartement-optimized.glb';

// Camera geometry for the apartment scan's 5 room stops — tuned by eye
// against the model's actual bounding boxes (see RoomTour3D.jsx). Shared
// across any page that embeds <RoomTour3D>; each page supplies its own
// tag/title/body copy and merges it with these stops by index.
export const APARTMENT_TOUR_STOPS = [
  {
    key: 'overview', boxKey: 'overview', overview: true,
    angleDeg: 35, distFactor: 1.25, heightFrac: 1.7, lookHeightFrac: 0.2,
  },
  {
    key: 'living', boxKey: 'living',
    angleDeg: 200, distFactor: 0.46, heightFrac: 0.5, lookHeightFrac: 0.44,
  },
  {
    key: 'kitchen', boxKey: 'living',
    angleDeg: 165, distFactor: 0.3, heightFrac: 0.5, lookHeightFrac: 0.42,
  },
  {
    // The kitchen/living box and the bedroom box don't share a wall — the
    // straight camera lerp between them used to tunnel through the wall
    // that actually separates them. This waypoint sits in the hallway box
    // ("Banheiros_Corredor") that genuinely connects the two, so both legs
    // of the walk (kitchen->hallway, hallway->bedroom) stay in open space.
    key: 'hallway', boxKey: 'bath',
    angleDeg: 300, distFactor: 0.32, heightFrac: 0.6, lookHeightFrac: 0.4, lookAtBias: [0.35, 0.1],
  },
  {
    // "Chambre01_Meuble_Lit" is only the bed/furniture prop (low, ~0.86m
    // bbox) — "Quartos" is the actual room shell, floor to ceiling.
    key: 'bedroom', boxKey: 'quartos',
    angleDeg: 165, distFactor: 0.36, heightFrac: 0.72, lookHeightFrac: 0.42,
  },
  {
    // "Banheiros_Corredor" is the bathroom fused with the hallway that
    // leads to it — a wide distFactor lands the camera in the hallway
    // itself (or clips its door), so this stays in tight, inside the
    // bathroom, framing the tub instead of the corridor beyond it.
    key: 'bath', boxKey: 'bath',
    angleDeg: 330, distFactor: 0.1, heightFrac: 0.55, lookHeightFrac: 0.45, lookAtBias: [-0.15, 0.1],
  },
];

// Merges page-specific copy (by array index, same order as the stops
// above) onto the shared geometry.
export function withRoomCopy(copy) {
  return APARTMENT_TOUR_STOPS.map((stop, i) => ({ ...stop, ...copy[i] }));
}
