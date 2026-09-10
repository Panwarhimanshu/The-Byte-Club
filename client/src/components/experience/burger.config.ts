/**
 * THE BYTE CLUB — cinematic burger experience: layer definitions.
 *
 * The burger is a stack of independent layers. Each `BurgerLayer` is animated
 * on its own, driven by a single scroll-progress MotionValue (0 → 1).
 *
 * ── Swapping in a real 3D model later ─────────────────────────────
 * `BurgerScene` renders these layers as CSS-3D discs. To move to a GLTF model,
 * replace the layer rendering in `BurgerScene` with a react-three-fiber <Canvas>
 * and map each mesh's position/rotation to the same MotionValues. This config
 * (labels, story copy, act ranges) stays exactly as-is.
 */

export type LayerShape =
  | 'topBun'
  | 'sauce'
  | 'lettuce'
  | 'tomato'
  | 'cheese'
  | 'patty'
  | 'onions'
  | 'bottomBun';

export interface BurgerLayerDef {
  id: LayerShape;
  order: number;
  width: number;
  /** visible edge thickness in px (the "side" of the slice) */
  thickness: number;
  color: string;
  edge: string;
  highlight?: string;
  /** z-offset (px) when the burger is assembled — centred on 0 */
  assembledZ: number;
  /** z-offset (px) when fully exploded — centred on 0 */
  explodedZ: number;
}

export const LAYERS: BurgerLayerDef[] = [
  { id: 'bottomBun', order: 0, width: 300, thickness: 28, color: '#E3A458', edge: '#B77C3B', highlight: '#F0C489', assembledZ: -74, explodedZ: -268 },
  { id: 'onions', order: 1, width: 302, thickness: 14, color: '#E0A652', edge: '#B0781F', assembledZ: -48, explodedZ: -191 },
  { id: 'patty', order: 2, width: 290, thickness: 32, color: '#5C3B2A', edge: '#3C261A', highlight: '#7A5038', assembledZ: -24, explodedZ: -115 },
  { id: 'cheese', order: 3, width: 312, thickness: 12, color: '#F4B23C', edge: '#D68F22', assembledZ: -2, explodedZ: -38 },
  { id: 'tomato', order: 4, width: 270, thickness: 15, color: '#D94F3B', edge: '#AE382A', highlight: '#E87B68', assembledZ: 12, explodedZ: 38 },
  { id: 'lettuce', order: 5, width: 320, thickness: 18, color: '#7FB856', edge: '#5C9440', assembledZ: 27, explodedZ: 115 },
  { id: 'sauce', order: 6, width: 266, thickness: 10, color: '#F3CBA3', edge: '#E0A97C', highlight: '#FBE4CC', assembledZ: 40, explodedZ: 191 },
  { id: 'topBun', order: 7, width: 302, thickness: 62, color: '#E6A85C', edge: '#BE8039', highlight: '#F7CD90', assembledZ: 54, explodedZ: 268 },
];

/** Acts, expressed as scroll-progress breakpoints (0 → 1). */
export const ACTS = {
  reveal: [0.0, 0.1] as const,
  explode: [0.1, 0.3] as const,
  story: [0.3, 0.7] as const,
  reassemble: [0.7, 0.84] as const,
  closeUp: [0.84, 0.93] as const,
  handoff: [0.93, 1.0] as const,
};

export interface IngredientStory {
  target: LayerShape;
  label: string;
  line: string;
  side: 'left' | 'right';
  /** progress window: [in-start, in-end, out-start, out-end] */
  window: [number, number, number, number];
}

/* five beats spread across the "story" act (0.30 → 0.70) */
export const STORIES: IngredientStory[] = [
  { target: 'topBun', label: 'The Bun', line: 'Soft. Toasted. Built for the first bite.', side: 'right', window: [0.31, 0.325, 0.37, 0.385] },
  { target: 'sauce', label: 'The Sauce', line: 'Our signature flavour. Recipe stays in the kitchen.', side: 'left', window: [0.388, 0.403, 0.448, 0.463] },
  { target: 'cheese', label: 'The Cheese', line: 'Melty. Rich. Unapologetic.', side: 'right', window: [0.466, 0.481, 0.526, 0.541] },
  { target: 'patty', label: 'The Patty', line: 'Smash-crafted on a screaming griddle for maximum flavour.', side: 'left', window: [0.544, 0.559, 0.604, 0.619] },
  { target: 'onions', label: 'The Crunch', line: 'Crispy onions. Because texture matters.', side: 'right', window: [0.622, 0.637, 0.68, 0.7] },
];

export const OUTRO_ITEMS = [
  { name: 'The Classic Byte', slug: 'classic-byte', price: 229 },
  { name: 'Double Stack Overflow', slug: 'double-stack-overflow', price: 319 },
  { name: 'Crispy Chick Commit', slug: 'crispy-chick-commit', price: 279 },
  { name: 'Paneer Protocol', slug: 'paneer-protocol', price: 249 },
];
