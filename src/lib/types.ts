import type { Sphere } from './shapes/sphere';

export type Vector2 = [number, number];
export type Vector3 = [number, number, number];

export interface StaticScene {
  spheres: Sphere[];
}
