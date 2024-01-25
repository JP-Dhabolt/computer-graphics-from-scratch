import type { Color } from './colors';

export type Vector2 = [number, number];
export type Vector3 = [number, number, number];

export interface ShadedPoint {
  x: number;
  y: number;
  intensity: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Triangle {
  a: number;
  b: number;
  c: number;
  color: Color;
}
