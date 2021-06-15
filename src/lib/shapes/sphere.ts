import type { Color } from '$lib/colors';
import type { Vector3 } from '$lib/types';

export class Sphere {
  constructor(public readonly center: Vector3, public readonly radius: number, public readonly color: Color) {}
}
