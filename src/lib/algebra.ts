import type { Vector3 } from './types';

export function dotProduct(v1: Vector3, v2: Vector3): number {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

export function subtract(v1: Vector3, v2: Vector3): Vector3 {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

export function add(v1: Vector3, v2: Vector3): Vector3 {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

export function length(vector: Vector3): number {
  return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
}

export function multiply(x: number, v: Vector3): Vector3 {
  return [x * v[0], x * v[1], x * v[2]];
}
