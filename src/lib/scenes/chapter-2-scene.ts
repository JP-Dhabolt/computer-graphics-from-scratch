import { Blue, Green, Red } from '$lib/colors';
import { Sphere } from '$lib/shapes/sphere';
import type { StaticScene } from '$lib/types';

export const scene: StaticScene = {
  spheres: [new Sphere([0, -1, 3], 1, Red), new Sphere([2, 0, 4], 1, Blue), new Sphere([-2, 0, 4], 1, Green)],
};
