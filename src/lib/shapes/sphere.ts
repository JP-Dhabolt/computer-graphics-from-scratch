import type { Color } from '$lib/renderer';
import type { Vector3 } from '$lib/types';

export class Sphere {
  constructor(private readonly center: Vector3, private readonly radius: number, private readonly color: Color) {}
}
