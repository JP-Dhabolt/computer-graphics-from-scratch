import type { Color } from './colors';

export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type Vector4 = [number, number, number, number];
export type Matrix4x4 = [Vector4, Vector4, Vector4, Vector4];

export const IdentityMatrix: Matrix4x4 = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 1],
  [0, 0, 0, 1],
];

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

export interface Line3D {
  start: Point3D;
  end: Point3D;
}

export interface Plane {
  normal: Vector3;
  distance: number;
}

export interface Triangle {
  a: number;
  b: number;
  c: number;
  color: Color;
}
